from .produtos import bp as produtos_bp
from .carrinho import bp as carrinho_bp
from .recomendacoes import bp as recomendacoes_bp
from .pedidos import bp as pedidos_bp
from .auth import bp as auth_bp

def register_routes(app):
    # Cada blueprint com seu prefixo
    app.register_blueprint(produtos_bp, url_prefix="/produtos")
    app.register_blueprint(carrinho_bp, url_prefix="/carrinho")
    app.register_blueprint(recomendacoes_bp, url_prefix="/recomendacoes")
    app.register_blueprint(pedidos_bp, url_prefix="/pedidos")
    app.register_blueprint(auth_bp, url_prefix="/auth")

__all__ = ["register_routes"]
