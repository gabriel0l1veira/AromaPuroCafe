from flask import Blueprint, jsonify, request
from app.models.models import (
    Pedido,
    ItemPedido,
    Carrinho,
    ItemCarrinho,
    Produto,
    FormaPagamentoEnum,
    StatusPedidoEnum
)
from database import get_db
from sqlalchemy import text

bp = Blueprint("pedidos", __name__)

# 🔧 Garante que o carrinho esteja consistente
def garantir_carrinho_consistente(db, id_cliente=1):
    """Verifica e corrige inconsistências no carrinho"""
    carrinho = db.query(Carrinho).filter_by(id_cliente=id_cliente).first()
    if not carrinho:
        carrinho = Carrinho(id_cliente=id_cliente)
        db.add(carrinho)
        db.commit()
        print(f"🧩 Carrinho criado automaticamente (cliente={id_cliente})")

    # Corrige itens órfãos
    itens_orfaos = db.query(ItemCarrinho).filter(
        (ItemCarrinho.id_carrinho == None) | (ItemCarrinho.id_carrinho == 0)
    ).all()
    for item in itens_orfaos:
        item.id_carrinho = carrinho.id_carrinho
    if itens_orfaos:
        db.commit()
        print(f"🔧 {len(itens_orfaos)} item(ns) órfão(s) corrigido(s)")

    # Corrige duplicações
    duplicados = db.query(Carrinho).filter(Carrinho.id_cliente == id_cliente).all()
    if len(duplicados) > 1:
        principal = duplicados[0]
        for extra in duplicados[1:]:
            itens = db.query(ItemCarrinho).filter_by(id_carrinho=extra.id_carrinho).all()
            for item in itens:
                item.id_carrinho = principal.id_carrinho
            db.delete(extra)
        db.commit()
        print(f"🔄 Carrinhos duplicados mesclados no #{principal.id_carrinho}")

    return carrinho


# ✅ Criar pedido com dados de entrega
@bp.route("/", methods=["POST"])
def criar_pedido():
    db = next(get_db())
    id_cliente = 1  # simulado até autenticação

    if not request.is_json:
        return jsonify({"erro": "Envie os dados em JSON"}), 415

    dados = request.get_json(silent=True) or {}

    # Captura dados do formulário
    nome = dados.get("nome")
    endereco = dados.get("endereco")
    numero = dados.get("numero")
    bairro = dados.get("bairro")
    cidade = dados.get("cidade")
    cep = dados.get("cep")
    forma_pagamento = dados.get("forma_pagamento", "pix")

    # Validação simples
    campos_obrigatorios = [nome, endereco, bairro, cidade, cep]
    if not all(campos_obrigatorios):
        return jsonify({"erro": "Preencha todos os campos obrigatórios."}), 400

    # Garante que o carrinho esteja íntegro
    carrinho = garantir_carrinho_consistente(db, id_cliente)

    itens_carrinho = (
        db.query(ItemCarrinho, Produto)
        .join(Produto, ItemCarrinho.id_produto == Produto.id_produto)
        .filter(ItemCarrinho.id_carrinho == carrinho.id_carrinho)
        .all()
    )

    if not itens_carrinho:
        return jsonify({"erro": "Carrinho vazio. Adicione produtos antes de finalizar."}), 400

    # Calcula total
    valor_total = sum(float(produto.preco_base) * item.quantidade for item, produto in itens_carrinho)

    # Cria o pedido
    novo_pedido = Pedido(
        id_cliente=id_cliente,
        valor_total=valor_total,
        forma_pagamento=FormaPagamentoEnum(forma_pagamento),
        status_pedido=StatusPedidoEnum.em_andamento,
    )
    db.add(novo_pedido)
    db.commit()  # gera o id_pedido

    # Cria itens de pedido
    for item, produto in itens_carrinho:
        novo_item = ItemPedido(
            id_pedido=novo_pedido.id_pedido,
            id_produto=produto.id_produto,
            quantidade=item.quantidade,
            preco_unitario=produto.preco_base,
        )
        db.add(novo_item)

    # Salva dados adicionais na tabela pedido (endereços etc)
    try:
        db.execute(
            text("""
                UPDATE pedido
                SET 
                    nome_cliente = :nome,
                    endereco_entrega = :endereco,
                    numero_endereco = :numero,
                    bairro = :bairro,
                    cidade = :cidade,
                    cep = :cep
                WHERE id_pedido = :id_pedido
            """),
            {
                "nome": nome,
                "endereco": endereco,
                "numero": numero,
                "bairro": bairro,
                "cidade": cidade,
                "cep": cep,
                "id_pedido": novo_pedido.id_pedido
            }
        )
        db.commit()
    except Exception as e:
        print("⚠️ Erro ao salvar endereço no pedido:", e)

    # Limpa carrinho
    for item, _ in itens_carrinho:
        db.delete(item)
    db.commit()

    print(f"✅ Pedido #{novo_pedido.id_pedido} criado ({forma_pagamento.upper()}) — R$ {valor_total:.2f}")

    return jsonify({
        "mensagem": "Pedido criado com sucesso!",
        "id_pedido": novo_pedido.id_pedido,
        "valor_total": float(valor_total),
        "forma_pagamento": forma_pagamento,
        "cliente": nome,
        "endereco": f"{endereco}, {numero} - {bairro}, {cidade} - CEP {cep}"
    }), 201


# ✅ Listar pedidos
@bp.route("/", methods=["GET"])
def listar_pedidos():
    db = next(get_db())
    id_cliente = 1

    pedidos = db.query(Pedido).filter_by(id_cliente=id_cliente).all()
    resultado = []
    for p in pedidos:
        resultado.append({
            "id_pedido": p.id_pedido,
            "data_hora_pedido": p.data_hora_pedido,
            "valor_total": float(p.valor_total),
            "status_pedido": p.status_pedido.value if hasattr(p.status_pedido, "value") else p.status_pedido,
            "forma_pagamento": p.forma_pagamento.value if hasattr(p.forma_pagamento, "value") else p.forma_pagamento,
        })

    return jsonify(resultado)
