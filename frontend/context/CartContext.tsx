"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ItemCarrinho {
  id_produto: number;
  nome_produto: string;
  preco_unitario: number;
  quantidade: number;
  imagem_url?: string;
}

interface CarrinhoContextType {
  carrinho: ItemCarrinho[];
  adicionarAoCarrinho: (item: ItemCarrinho) => void;
  removerDoCarrinho: (id_item_carrinho: number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  const adicionarAoCarrinho = (item: ItemCarrinho) => {
    setCarrinho((prev) => {
      const existente = prev.find((i) => i.id_produto === item.id_produto);
      if (existente) {
        return prev.map((i) =>
          i.id_produto === item.id_produto
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removerDoCarrinho = (id_item_carrinho: number) => {
    setCarrinho((prev) => prev.filter((i) => i.id_produto!== id_item_carrinho));
  };

  const limparCarrinho = () => setCarrinho([]);

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
}
