# backend/seed_data.py
import os
from database import get_db
from app.models.models import Produto, CategoriaProduto, TipoProdutoEnum
from sqlalchemy.orm import Session

def run_seed():
    db: Session = next(get_db())

    # 🔹 Cria categorias se não existirem
    categorias_nomes = ["Grãos", "Bebidas", "Acessórios"]
    categorias = {}

    for nome in categorias_nomes:
        cat = db.query(CategoriaProduto).filter_by(nome_categoria=nome).first()
        if not cat:
            nova = CategoriaProduto(nome_categoria=nome)
            db.add(nova)
            db.commit()
            print(f"✅ Categoria criada: {nome}")
            categorias[nome] = nova.id_categoria
        else:
            categorias[nome] = cat.id_categoria

    # 🔹 Produtos iniciais
    produtos = [
        # ☕ Grãos
        {
            "nome": "Café Filtro Gourmet",
            "preco_base": 29.90,
            "estoque_disponivel": 100,
            "tipo_produto": TipoProdutoEnum.grao_cafe,
            "id_categoria": categorias["Grãos"],
            "imagem_url": "/assets/produtos/cafe-filtro-gourmet.jpg",
            "descricao": "Grãos selecionados com torra média e notas suaves de chocolate e caramelo."
        },
        {
            "nome": "Café Orgânico da Serra",
            "preco_base": 34.90,
            "estoque_disponivel": 60,
            "tipo_produto": TipoProdutoEnum.grao_cafe,
            "id_categoria": categorias["Grãos"],
            "imagem_url": "/assets/produtos/cafe-organico-serra.jpg",
            "descricao": "Produzido em fazendas sustentáveis, 100% orgânico e de sabor encorpado."
        },
        {
            "nome": "Café Premium Reserva",
            "preco_base": 39.90,
            "estoque_disponivel": 80,
            "tipo_produto": TipoProdutoEnum.grao_cafe,
            "id_categoria": categorias["Grãos"],
            "imagem_url": "/assets/produtos/cafe-premium-reserva.jpg",
            "descricao": "Blend exclusivo com acidez equilibrada e aroma marcante."
        },

        # ☕ Bebidas
        {
            "nome": "Espresso Intenso",
            "preco_base": 12.50,
            "estoque_disponivel": 80,
            "tipo_produto": TipoProdutoEnum.bebida_cafe,
            "id_categoria": categorias["Bebidas"],
            "imagem_url": "/assets/produtos/espresso-intenso.jpg",
            "descricao": "Espresso forte e encorpado, ideal para quem ama sabor intenso."
        },
        {
            "nome": "Cappuccino Cremoso",
            "preco_base": 14.90,
            "estoque_disponivel": 70,
            "tipo_produto": TipoProdutoEnum.bebida_cafe,
            "id_categoria": categorias["Bebidas"],
            "imagem_url": "/assets/produtos/cappuccino-cremoso.jpg",
            "descricao": "Cappuccino clássico com toque aveludado e notas suaves de canela."
        },
        {
            "nome": "Latte Caramel",
            "preco_base": 15.90,
            "estoque_disponivel": 50,
            "tipo_produto": TipoProdutoEnum.bebida_cafe,
            "id_categoria": categorias["Bebidas"],
            "imagem_url": "/assets/produtos/latte-caramel.jpg",
            "descricao": "Leite vaporizado e calda de caramelo em perfeita harmonia."
        },

        # 🛍️ Acessórios
        {
            "nome": "Caneca Personalizada",
            "preco_base": 45.00,
            "estoque_disponivel": 50,
            "tipo_produto": TipoProdutoEnum.acessorio_cafe,
            "id_categoria": categorias["Acessórios"],
            "imagem_url": "/assets/produtos/caneca-personalizada.jpg",
            "descricao": "Caneca de porcelana premium com design exclusivo Aroma Puro Café."
        },
        {
            "nome": "Coador de Pano Tradicional",
            "preco_base": 19.90,
            "estoque_disponivel": 40,
            "tipo_produto": TipoProdutoEnum.acessorio_cafe,
            "id_categoria": categorias["Acessórios"],
            "imagem_url": "/assets/produtos/coador-pano.jpg",
            "descricao": "Clássico coador artesanal para um café com sabor autêntico."
        },
        {
            "nome": "Moedor Manual Vintage",
            "preco_base": 99.90,
            "estoque_disponivel": 25,
            "tipo_produto": TipoProdutoEnum.acessorio_cafe,
            "id_categoria": categorias["Acessórios"],
            "imagem_url": "/assets/produtos/moedor-manual.jpg",
            "descricao": "Moedor de café manual em estilo retrô, ideal para moagens frescas."
        },
    ]

    # 🔹 Inserção de produtos
    for p in produtos:
        produto_existente = db.query(Produto).filter_by(nome=p["nome"]).first()
        if not produto_existente:
            novo_produto = Produto(**p)
            db.add(novo_produto)
            print(f"✅ Produto adicionado: {p['nome']}")

    db.commit()
    db.close()
    print("🌱 Seed executado com sucesso!")

if __name__ == "__main__":
    run_seed()
