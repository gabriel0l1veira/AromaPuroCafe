from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from app.models.models import Produto
import difflib
import unicodedata

bp = Blueprint("recomendacoes", __name__)

def normalizar_texto(texto: str) -> str:
    """Remove acentos, pontuação e transforma em minúsculas."""
    if not texto:
        return ""
    texto = texto.lower().strip()
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(c for c in texto if unicodedata.category(c) != "Mn")
    return texto

@bp.route("/", methods=["POST"])
def recomendar_produto():
    try:
        dados = request.get_json()
        preferencia = normalizar_texto(dados.get("preferencia", ""))
        db: Session = next(get_db())

        produtos = db.query(Produto).all()
        if not produtos:
            return jsonify({"mensagem": "Nenhum produto cadastrado."}), 404

        melhor_produto = None
        maior_similaridade = 0

        for produto in produtos:
            nome = normalizar_texto(produto.nome)
            tipo = normalizar_texto(produto.tipo_produto or "")
            texto_produto = f"{nome} {tipo}"

            # Similaridade textual
            similaridade = difflib.SequenceMatcher(None, preferencia, texto_produto).ratio()

            # Palavras-chave com "peso extra"
            if any(p in preferencia for p in ["forte", "intenso", "espresso"]) and "espresso" in nome:
                similaridade += 0.4
            if any(p in preferencia for p in ["suave", "leve", "filtro", "tradicional"]) and "filtro" in nome:
                similaridade += 0.4
            if any(p in preferencia for p in ["caneca", "acessorio", "presente", "xicara"]) and "caneca" in nome:
                similaridade += 0.4

            if similaridade > maior_similaridade:
                maior_similaridade = similaridade
                melhor_produto = produto

        if not melhor_produto:
            return jsonify({"mensagem": "Nenhum produto encontrado para essa preferência."}), 404

        return jsonify({
            "id_produto": melhor_produto.id_produto,
            "nome": melhor_produto.nome,
            "preco_base": float(melhor_produto.preco_base),
            "tipo_produto": melhor_produto.tipo_produto,
            "mensagem": f"Baseado na sua preferência, recomendamos: {melhor_produto.nome}"
        })

    except Exception as e:
        print("❌ Erro na recomendação:", e)
        return jsonify({"erro": str(e)}), 500
