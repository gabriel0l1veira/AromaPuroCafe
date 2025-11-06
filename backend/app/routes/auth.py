import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.orm import Session
from database import get_db
from app.controllers import produtos_controller

bp = Blueprint('auth', __name__)

@bp.post('/register')
def register():
    data = request.get_json(force=True)
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    tipo = data.get("tipo", "cliente")
    db_gen = get_db()
    db: Session = next(db_gen)
    try:
        user, err = auth_controller.registrar(db, nome, email, senha, tipo)
        if err:
            return jsonify({"error": err}), 400
        token = create_access_token(identity={"id": user["id"], "email": user["email"], "tipo": user["tipo"]})
        return jsonify({"user": user, "access_token": token})
    finally:
        db_gen.close()

@bp.post('/login')
def login():
    data = request.get_json(force=True)
    email = data.get("email")
    senha = data.get("senha")
    db_gen = get_db()
    db: Session = next(db_gen)
    try:
        user = auth_controller.autenticar(db, email, senha)
        if not user:
            return jsonify({"error": "Credenciais inválidas"}), 401
        token = create_access_token(identity={"id": user["id"], "email": user["email"], "tipo": user["tipo"]})
        return jsonify({"user": user, "access_token": token})
    finally:
        db_gen.close()

@bp.get('/me')
@jwt_required()
def me():
    ident = get_jwt_identity()
    return jsonify({"me": ident})
