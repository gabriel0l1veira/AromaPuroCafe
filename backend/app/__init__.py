from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Carrega variáveis de ambiente do .env
load_dotenv()

# Importação do engine e Base a partir do módulo database
from database import engine
from app.models import models  # Importa o módulo completo (com Base declarada dentro dele)

def create_app():
    app = Flask(__name__)

    # Configurações básicas do Flask e JWT
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializa extensões
    CORS(app, origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")])
    JWTManager(app)

    # ✅ Cria todas as tabelas do banco se ainda não existirem
    # Aqui usamos models.Base, pois é a Base declarada no arquivo models/models.py
    models.Base.metadata.create_all(bind=engine)

    # ✅ Registra todas as rotas
    from app.routes import register_routes
    register_routes(app)

    # Rota simples para verificar se a API está rodando
    @app.route("/")
    def index():
        return {"message": "API do Aroma Puro Café (Flask) rodando com PostgreSQL no Render!"}

    return app
