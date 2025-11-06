from app.services.recomendacao_service import recomendar

def gerar_recomendacao(texto_usuario: str) -> str:
    return recomendar(texto_usuario)
