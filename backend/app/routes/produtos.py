from flask import Blueprint, jsonify
from app.models.models import Produto
from database import get_db

# Define blueprint com prefixo explícito
bp = Blueprint("produtos", __name__, url_prefix="/produtos")

# 🔹 Listar todos os produtos
@bp.route("/", methods=["GET"])
def listar_produtos():
    db = next(get_db())
    produtos = db.query(Produto).all()

    return jsonify([
        {
            "id_produto": p.id_produto,
            "nome": p.nome,
            "preco_base": float(p.preco_base),
            "tipo_produto": getattr(p.tipo_produto, "value", p.tipo_produto),
            "imagem_url": p.imagem_url,
            "descricao": getattr(p, "descricao", None),
            "estoque_disponivel": p.estoque_disponivel,
        }
        for p in produtos
    ])

# 🔹 Obter um produto específico
@bp.route("/<int:id>", methods=["GET"])
def obter_produto(id):
    db = next(get_db())
    produto = db.query(Produto).filter(Produto.id_produto == id).first()

    if not produto:
        return jsonify({"erro": "Produto não encontrado"}), 404

    return jsonify({
        "id_produto": produto.id_produto,
        "nome": produto.nome,
        "preco_base": float(produto.preco_base),
        "tipo_produto": getattr(produto.tipo_produto, "value", produto.tipo_produto),
        "imagem_url": produto.imagem_url,
        "descricao": getattr(produto, "descricao", None),
        "estoque_disponivel": produto.estoque_disponivel,
    })
