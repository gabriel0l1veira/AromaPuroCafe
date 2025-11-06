from sqlalchemy import Column, Integer, String, Text, Boolean, Enum, DECIMAL, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.dialects.postgresql import ENUM as PGEnum
import enum

Base = declarative_base()

class TipoUsuarioEnum(str, enum.Enum):
    cliente = "cliente"
    barista = "barista"
    administrador = "administrador"

class StatusPedidoEnum(str, enum.Enum):
    em_andamento = "em_andamento"
    finalizado = "finalizado"
    cancelado = "cancelado"

class FormaPagamentoEnum(str, enum.Enum):
    cartao = "cartao"
    pix = "pix"
    boleto = "boleto"
    assinatura = "assinatura"

class TipoProdutoEnum(str, enum.Enum):
    grao_cafe = "grao_cafe"
    bebida_cafe = "bebida_cafe"
    acessorio_cafe = "acessorio_cafe"

class Usuario(Base):
    __tablename__ = "usuario"
    id_usuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(Enum(TipoUsuarioEnum), nullable=False)

class Cliente(Base):
    __tablename__ = "cliente"
    id_cliente = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer)
    telefone = Column(String(20))

class CategoriaProduto(Base):
    __tablename__ = "categoriaproduto"
    id_categoria = Column(Integer, primary_key=True, index=True)
    nome_categoria = Column(String(100))

class Produto(Base):
    __tablename__ = "produto"
    id_produto = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100))
    preco_base = Column(DECIMAL(10, 2))
    estoque_disponivel = Column(Integer, default=0)
    imagem_url = Column(String(255), nullable=True)

    # ✅ Cria automaticamente o ENUM no PostgreSQL
    tipo_produto = Column(
        PGEnum(
            TipoProdutoEnum,
            name="tipo_produto_enum",
            create_type=True  # <-- alterado para criar o tipo automaticamente
        )
    )

    id_categoria = Column(Integer)

class Pedido(Base):
    __tablename__ = "pedido"
    id_pedido = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer)
    data_hora_pedido = Column(DateTime(timezone=True), server_default=func.now())
    status_pedido = Column(Enum(StatusPedidoEnum), default=StatusPedidoEnum.em_andamento)
    valor_total = Column(DECIMAL(10,2))
    forma_pagamento = Column(Enum(FormaPagamentoEnum))

class ItemPedido(Base):
    __tablename__ = "itempedido"
    id_item_pedido = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer)
    id_produto = Column(Integer)
    quantidade = Column(Integer, default=1)
    preco_unitario = Column(DECIMAL(10,2))
    personalizado_texto = Column(Text)

class Carrinho(Base):
    __tablename__ = "carrinho"
    id_carrinho = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer)
    data_ultima_modificacao = Column(DateTime(timezone=True), server_default=func.now())

class ItemCarrinho(Base):
    __tablename__ = "itemcarrinho"
    id_item_carrinho = Column(Integer, primary_key=True, index=True)
    id_carrinho = Column(Integer)
    id_produto = Column(Integer)
    quantidade = Column(Integer, default=1)
    opcoes_personalizacao = Column(Text)

class OpcaoPersonalizacao(Base):
    __tablename__ = "opcaopersonalizacao"
    id_opcao = Column(Integer, primary_key=True, index=True)
    nome_opcao = Column(String(100))
    preco_adicional = Column(DECIMAL(10, 2), default=0.00)

class Avaliacao(Base):
    __tablename__ = "avaliacao"
    id_avaliacao = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer)
    id_produto = Column(Integer)
    nota = Column(Integer)
    comentario = Column(Text)
    data_avaliacao = Column(DateTime(timezone=True), server_default=func.now())
