from sqlalchemy.orm import Session
from app.models.models import Pedido, ItemPedido
from datetime import datetime

def criar_pedido(db: Session, id_cliente: int, itens: list, valor_total: float, forma_pagamento: str):
    p = Pedido(id_cliente=id_cliente, data_hora_pedido=datetime.utcnow(), status_pedido="em_andamento", valor_total=valor_total, forma_pagamento=forma_pagamento)
    db.add(p)
    db.commit()
    db.refresh(p)
    for it in itens:
        ip = ItemPedido(id_pedido=p.id_pedido, id_produto=it["id_produto"], quantidade=it.get("quantidade",1), preco_unitario=it.get("preco_unitario"))
        db.add(ip)
    db.commit()
    return {"message": "Pedido criado", "id_pedido": p.id_pedido}

def obter_pedido(db: Session, id_pedido: int):
    p = db.query(Pedido).filter(Pedido.id_pedido == id_pedido).first()
    if not p: return None
    itens = db.query(ItemPedido).filter(ItemPedido.id_pedido == p.id_pedido).all()
    return {
        "id": p.id_pedido,
        "id_cliente": p.id_cliente,
        "status": p.status_pedido,
        "valor_total": float(p.valor_total) if p.valor_total else None,
        "itens": [{"id_item": it.id_item_pedido, "id_produto": it.id_produto, "quantidade": it.quantidade, "preco_unitario": float(it.preco_unitario) if it.preco_unitario else None} for it in itens]
    }
