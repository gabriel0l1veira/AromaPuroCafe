# create_tables.py
from database import engine
from app.models import models

print("🔄 Criando tabelas no banco remoto...")

models.Base.metadata.create_all(bind=engine)

print("✅ Tabelas criadas com sucesso no Render!")
