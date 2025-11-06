# Placeholder de recomendação (IA). Substituir por integração real se desejar.
def recomendar(texto_usuario: str) -> str:
    if not texto_usuario:
        return "Blend sugerido: Clássico — notas de chocolate e caramelo."
    if "frut" in texto_usuario.lower():
        return "Blend sugerido: Frutado — notas de frutas vermelhas e acidez brilhante."
    return "Blend sugerido: Intenso — torra média/escura com corpo aveludado."
