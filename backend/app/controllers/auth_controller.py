from sqlalchemy.orm import Session
from app.models.models import Usuario, TipoUsuarioEnum
from passlib.hash import bcrypt

def registrar(db: Session, nome: str, email: str, senha: str, tipo: str = "cliente"):
    if db.query(Usuario).filter(Usuario.email == email).first():
        return None, "E-mail já cadastrado"
    user = Usuario(nome=nome, email=email, senha_hash=bcrypt.hash(senha), tipo_usuario=TipoUsuarioEnum(tipo))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id_usuario, "nome": user.nome, "email": user.email, "tipo": user.tipo_usuario.value}, None

def autenticar(db: Session, email: str, senha: str):
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if not user or not bcrypt.verify(senha, user.senha_hash):
        return None
    return {"id": user.id_usuario, "nome": user.nome, "email": user.email, "tipo": user.tipo_usuario.value}
