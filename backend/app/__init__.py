from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Carrega variáveis de ambiente do .env
load_dotenv()

# Importação absoluta
from database import engine, Base

def create_app():
    app = Flask(__name__)

    # Configurações
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Inicializa extensões
    CORS(app, origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")])
    JWTManager(app)

    # ✅ IMPORTA OS MODELOS ANTES DE CRIAR AS TABELAS
    from app.models.produto import Produto
    from app.models.categoria import Categoria
    # (adicione aqui todos os outros modelos que você tiver)

    # Cria tabelas no banco se não existirem
    Base.metadata.create_all(bind=engine)

    # Registra rotas
    from app.routes import register_routes
    register_routes(app)

    @app.route("/")
    def index():
        return {"message": "API do Aroma Puro Café (Flask) rodando!"}

    return app
