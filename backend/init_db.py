from database import Base, engine
from app.models import models  # garante o registro das classes Base

print("🔄 Criando tabelas no banco aroma_puro_cafe...")

# Import direto para registrar explicitamente os modelos
from app.models.models import *

# Cria as tabelas
Base.metadata.create_all(bind=engine)

print("✅ Tabelas criadas com sucesso no banco aroma_puro_cafe!")
