from sqlalchemy.orm import Session
from app.models.models import Produto

def listar_produtos(db: Session):
    return [serialize_produto(p) for p in db.query(Produto).all()]

def buscar_produto(db: Session, produto_id: int):
    p = db.query(Produto).filter(Produto.id_produto == produto_id).first()
    return serialize_produto(p) if p else None

def serialize_produto(p: Produto):
    if not p: return None
    return {
        "id": p.id_produto,
        "nome": p.nome,
        "preco": float(p.preco_base) if p.preco_base is not None else None,
        "estoque": p.estoque_disponivel,
        "tipo": p.tipo_produto.value if p.tipo_produto else None,
        "id_categoria": p.id_categoria,
    }
