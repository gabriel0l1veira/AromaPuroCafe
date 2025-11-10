"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Produto {
  id_produto: number;
  nome: string;
  preco_base: number;
  estoque_disponivel: number;
  imagem_url?: string | null;
  tipo_produto?: string;
}

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${apiUrl}/produtos/`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setErro("Não foi possível carregar os produtos. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, [apiUrl]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cafe-destaque font-medium">
        Carregando produtos...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {erro}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cafe-claro px-6 py-20 text-cafe-escuro font-['Inter']">
      {/* 🏷️ Título */}
      <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-center mb-12">
        Nossos Produtos
      </h1>

      {/* 🛍️ Lista de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {produtos.length > 0 ? (
          produtos.map((produto, i) => (
            <div
              key={produto.id_produto}
              className="bg-white rounded-3xl border border-cafe-medio shadow-md hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 opacity-0 animate-fadeSlideIn"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Imagem */}
              <div className="w-full h-56 bg-cafe-suave flex items-center justify-center overflow-hidden">
                <img
                  src={
                    produto.imagem_url
                      ? produto.imagem_url.startsWith("/")
                        ? produto.imagem_url
                        : `/${produto.imagem_url}`
                      : "/placeholder.png"
                  }
                  alt={produto.nome}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Conteúdo */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-cafe-escuro mb-2 font-['Playfair_Display']">
                  {produto.nome}
                </h2>
                <p className="text-cafe-destaque font-bold text-lg mb-3">
                  R$ {produto.preco_base.toFixed(2)}
                </p>

                <p
                  className={`text-sm mb-4 font-medium ${
                    produto.estoque_disponivel > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {produto.estoque_disponivel > 0
                    ? `Em estoque: ${produto.estoque_disponivel}`
                    : "Indisponível"}
                </p>

                <Link
                  href={`/produtos/${produto.id_produto}`}
                  className="mt-auto text-center bg-cafe-destaque hover:bg-cafe-hover text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-cafe-medio">
            Nenhum produto disponível no momento.
          </p>
        )}
      </div>
    </main>
  );
}
