import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Ajuste do path para permitir importações diretas
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, Base
from app.routes import register_routes


def create_app():
    """Cria e configura a aplicação Flask"""
    load_dotenv()

    app = Flask(__name__)
    app.json.ensure_ascii = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev_secret_key")

    # ✅ Configuração completa de CORS (com suporte a preflight)
    CORS(app, resources={r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "https://aroma-puro-cafe.vercel.app"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }})

    # ✅ Evita redirects de /pedidos -> /pedidos/
    app.url_map.strict_slashes = False

    # ✅ Cria tabelas
    Base.metadata.create_all(bind=engine)

    # ✅ Registra rotas
    register_routes(app)

    @app.route("/")
    def index():
        return jsonify({"message": "API do Aroma Puro Café rodando!"})

    return app


if __name__ == "__main__":
    app = create_app()

    print("\n🔍 Rotas registradas:")
    for rule in sorted(app.url_map.iter_rules(), key=lambda r: str(r)):
        print(f"➡  {rule}")

    app.run(debug=True, port=5000)
