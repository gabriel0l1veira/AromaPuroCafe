from flask import Blueprint, jsonify, request
from app.models.models import Produto, ItemCarrinho, Carrinho
from database import get_db
from sqlalchemy.orm import joinedload

bp = Blueprint("carrinho", __name__)

# ✅ Função auxiliar — garante que o carrinho existe e está consistente
def garantir_carrinho(db, id_cliente=1):
    """Cria automaticamente o carrinho e vincula itens órfãos."""
    carrinho = db.query(Carrinho).filter_by(id_cliente=id_cliente).first()
    if not carrinho:
        carrinho = Carrinho(id_cliente=id_cliente)
        db.add(carrinho)
        db.commit()
        print(f"🛒 Carrinho criado automaticamente (cliente={id_cliente})")

    # Corrige itens sem carrinho vinculado
    itens_orfaos = db.query(ItemCarrinho).filter(
        (ItemCarrinho.id_carrinho == None) | (ItemCarrinho.id_carrinho == 0)
    ).all()
    for item in itens_orfaos:
        item.id_carrinho = carrinho.id_carrinho

    if itens_orfaos:
        db.commit()
        print(f"🔧 {len(itens_orfaos)} item(ns) órfão(s) vinculado(s) ao carrinho {carrinho.id_carrinho}")

    return carrinho


# ✅ Adicionar item
@bp.route("/adicionar", methods=["POST", "OPTIONS"])
def adicionar_ao_carrinho():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    db = next(get_db())
    data = request.get_json()
    id_produto = data.get("id_produto")
    quantidade = data.get("quantidade", 1)
    id_cliente = 1  # simulado

    if not id_produto:
        return jsonify({"erro": "ID do produto é obrigatório"}), 400

    produto = db.query(Produto).filter_by(id_produto=id_produto).first()
    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    # Garante que o carrinho existe
    carrinho = garantir_carrinho(db, id_cliente)

    # Verifica se o item já existe
    item_existente = (
        db.query(ItemCarrinho)
        .filter_by(id_carrinho=carrinho.id_carrinho, id_produto=id_produto)
        .first()
    )

    if item_existente:
        item_existente.quantidade += quantidade
    else:
        novo_item = ItemCarrinho(
            id_carrinho=carrinho.id_carrinho,
            id_produto=id_produto,
            quantidade=quantidade,
        )
        db.add(novo_item)

    db.commit()
    return jsonify({
        "mensagem": f"{produto.nome} adicionado ao carrinho!",
        "id_carrinho": carrinho.id_carrinho
    }), 201


# ✅ Listar itens
@bp.route("/", methods=["GET"])
def listar_carrinho():
    db = next(get_db())
    id_cliente = 1

    carrinho = garantir_carrinho(db, id_cliente)

    itens = (
        db.query(ItemCarrinho, Produto)
        .join(Produto, ItemCarrinho.id_produto == Produto.id_produto)
        .filter(ItemCarrinho.id_carrinho == carrinho.id_carrinho)
        .all()
    )

    resultado = [
        {
            "id_item_carrinho": ic.id_item_carrinho,
            "nome_produto": p.nome,
            "quantidade": ic.quantidade,
            "preco_unitario": float(p.preco_base),
            "imagem_url": p.imagem_url,
        }
        for ic, p in itens
    ]

    return jsonify(resultado)


# ✅ Atualizar quantidade
@bp.route("/atualizar", methods=["PUT"])
def atualizar_quantidade():
    db = next(get_db())
    data = request.get_json()
    id_item_carrinho = data.get("id_item_carrinho")
    nova_qtd = data.get("quantidade")

    if not id_item_carrinho or nova_qtd is None:
        return jsonify({"erro": "Dados incompletos"}), 400

    item = db.query(ItemCarrinho).filter_by(id_item_carrinho=id_item_carrinho).first()
    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    if nova_qtd < 1:
        db.delete(item)
        db.commit()
        return jsonify({"mensagem": "Item removido do carrinho"}), 200

    item.quantidade = nova_qtd
    db.commit()
    return jsonify({"mensagem": "Quantidade atualizada"}), 200


# ✅ Remover item
@bp.route("/remover/<int:id_item>", methods=["DELETE"])
def remover_item(id_item):
    db = next(get_db())
    item = db.query(ItemCarrinho).filter_by(id_item_carrinho=id_item).first()

    if not item:
        return jsonify({"erro": "Item não encontrado"}), 404

    db.delete(item)
    db.commit()
    return jsonify({"mensagem": "Item removido com sucesso"}), 200


# ✅ Limpar carrinho
@bp.route("/limpar", methods=["DELETE"])
def limpar_carrinho():
    db = next(get_db())
    id_cliente = 1
    carrinho = garantir_carrinho(db, id_cliente)

    itens = db.query(ItemCarrinho).filter_by(id_carrinho=carrinho.id_carrinho).all()
    if not itens:
        return jsonify({"mensagem": "Carrinho já está vazio"}), 200

    for item in itens:
        db.delete(item)

    db.commit()
    return jsonify({"mensagem": "Carrinho esvaziado!"}), 200
