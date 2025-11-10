"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

type Produto = {
  id_produto: number;
  nome: string;
  preco_base: number;
  tipo_produto: string;
  imagem_url?: string | null;
  descricao?: string | null;
};

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [adicionando, setAdicionando] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const router = useRouter();

  // 🔹 Buscar produtos em destaque
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(`${apiUrl}/produtos`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        setProdutos(data.slice(0, 3));
      } catch (error) {
        console.error("❌ Erro ao carregar produtos:", error);
      }
    };
    fetchProdutos();
  }, [apiUrl]);

  // 🔹 Redirecionar para detalhes
  const verDetalhes = (id: number) => {
    router.push(`/produtos?id=${id}`);
  };

  // 🔹 Adicionar produto ao carrinho e redirecionar
  const adicionarAoCarrinho = async (id_produto: number) => {
    try {
      setAdicionando(id_produto);
      const res = await fetch(`${apiUrl}/carrinho/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_produto, quantidade: 1 }),
      });

      if (res.ok) {
        router.push("/carrinho");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setAdicionando(null);
    }
  };

  return (
    <main className="min-h-screen bg-cafe-claro text-cafe-escuro font-['Inter']">
      {/* 🎯 HERO */}
      <section className="text-center py-24 bg-cafe-suave shadow-inner animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-6 text-cafe-escuro">
          Descubra o Sabor Autêntico do Café
        </h1>
        <p className="text-lg md:text-xl text-cafe-medio mb-10 max-w-3xl mx-auto">
          Explore nossa seleção de grãos especiais, bebidas artesanais e acessórios premium.
        </p>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => router.push("/produtos")}
            className="bg-cafe-destaque text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-cafe-hover shadow-md hover:shadow-lg transition-all"
          >
            Ver Produtos
          </button>
          <button
            onClick={() => router.push("/recomendacoes")}
            className="border border-cafe-destaque text-cafe-destaque px-8 py-3 rounded-xl text-lg font-semibold hover:bg-cafe-suave transition-all"
          >
            Recomendações AI
          </button>
        </div>
      </section>

      {/* 🛍️ PRODUTOS EM DESTAQUE */}
      <section className="px-6 md:px-12 py-20">
        <h2 className="text-3xl md:text-4xl text-center font-['Playfair_Display'] font-bold mb-12 text-cafe-escuro">
          Produtos em Destaque
        </h2>

        {produtos.length === 0 ? (
          <p className="text-center text-cafe-medio">Carregando produtos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {produtos.map((p, i) => (
              <div
                key={p.id_produto}
                className="bg-white rounded-3xl border border-cafe-medio shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fadeSlideIn"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="relative w-full h-56">
                  <Image
                    src={
                      p.imagem_url?.startsWith("/")
                        ? p.imagem_url
                        : `/${p.imagem_url ?? "assets/produtos/default.jpg"}`
                    }
                    alt={p.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-cafe-escuro">
                    {p.nome}
                  </h3>
                  <p className="text-sm text-cafe-medio mb-4">
                    {p.descricao || "Café premium para apreciadores."}
                  </p>
                  <p className="text-cafe-destaque font-bold mb-4 text-lg">
                    R$ {p.preco_base.toFixed(2)}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => verDetalhes(p.id_produto)}
                      className="border border-cafe-destaque text-cafe-destaque px-4 py-2 rounded-lg hover:bg-cafe-suave transition-all font-medium"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => adicionarAoCarrinho(p.id_produto)}
                      disabled={adicionando === p.id_produto}
                      className={`px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md ${
                        adicionando === p.id_produto
                          ? "bg-cafe-hover opacity-70 cursor-wait"
                          : "bg-cafe-destaque hover:bg-cafe-hover"
                      }`}
                    >
                      {adicionando === p.id_produto
                        ? "Adicionando..."
                        : "Adicionar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
