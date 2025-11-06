from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Carrega variáveis de ambiente do .env
load_dotenv()

# Importação absoluta (corrigida)
from database import engine, Base

def create_app():
    app = Flask(__name__)

    # Configurações
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializa extensões
    # Permite apenas o frontend local por padrão (ajuste via FRONTEND_URL no .env)
    CORS(app, origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")])
    JWTManager(app)

    # Registra rotas
    from app.routes import register_routes
    register_routes(app)

    # Cria tabelas no banco se não existirem
    Base.metadata.create_all(bind=engine)

    @app.route("/")
    def index():
        return {"message": "API do Aroma Puro Café (Flask) rodando!"}

    return app
