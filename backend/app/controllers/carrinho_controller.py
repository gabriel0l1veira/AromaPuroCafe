from sqlalchemy.orm import Session
from app.models.models import Carrinho, ItemCarrinho
from datetime import datetime

def obter_carrinho(db: Session, id_cliente: int):
    c = db.query(Carrinho).filter(Carrinho.id_cliente == id_cliente).first()
    if not c:
        return {"items": []}
    itens = db.query(ItemCarrinho).filter(ItemCarrinho.id_carrinho == c.id_carrinho).all()
    return {
        "cart_id": c.id_carrinho,
        "items": [
            {"id_item": i.id_item_carrinho, "id_produto": i.id_produto, "quantidade": i.quantidade, "opcoes": i.opcoes_personalizacao}
            for i in itens
        ]
    }

def adicionar_item(db: Session, id_cliente: int, id_produto: int, quantidade: int = 1, opcoes: str | None = None):
    cart = db.query(Carrinho).filter(Carrinho.id_cliente == id_cliente).first()
    if not cart:
        cart = Carrinho(id_cliente=id_cliente)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    item = ItemCarrinho(id_carrinho=cart.id_carrinho, id_produto=id_produto, quantidade=quantidade, opcoes_personalizacao=opcoes)
    db.add(item)
    cart.data_ultima_modificacao = datetime.utcnow()
    db.commit()
    return {"message": "Item adicionado", "id_item": item.id_item_carrinho}
