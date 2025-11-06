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

  // 🔹 Buscar produtos
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
        // ✅ Redireciona automaticamente para o carrinho
        router.push("/carrinho");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setAdicionando(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f6f1] text-[#3a2a1a]">
      {/* HERO */}
      <section className="text-center py-24 bg-[#f3e9dc] animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold mb-4">
          Descubra o Sabor Autêntico do Café ☕
        </h1>
        <p className="text-lg md:text-xl text-[#5a4631] mb-8 max-w-3xl mx-auto font-['Inter']">
          Explore nossa seleção de grãos especiais, bebidas artesanais e acessórios premium.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/produtos")}
            className="bg-[#8b5e34] text-white px-8 py-3 rounded-xl text-lg hover:bg-[#6f4728] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Ver Produtos
          </button>
          <button
            onClick={() => router.push("/recomendacoes")}
            className="border border-[#8b5e34] text-[#8b5e34] px-8 py-3 rounded-xl text-lg hover:bg-[#f7efe7] transition-all duration-300"
          >
            Recomendações AI
          </button>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="px-8 py-20">
        <h2 className="text-3xl md:text-4xl text-center font-['Playfair_Display'] font-bold mb-10">
          Produtos em Destaque
        </h2>

        {produtos.length === 0 ? (
          <p className="text-center text-gray-600">Carregando produtos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {produtos.map((p, i) => (
              <div
                key={p.id_produto}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fadeSlideIn"
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
                  <h2 className="text-xl font-semibold mb-2">{p.nome}</h2>
                  <p className="text-sm text-[#5a4631] mb-4">
                    {p.descricao || "Café premium para apreciadores."}
                  </p>
                  <p className="text-amber-800 font-bold mb-4 text-lg">
                    R$ {p.preco_base.toFixed(2)}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => verDetalhes(p.id_produto)}
                      className="border border-[#8b5e34] text-[#8b5e34] px-4 py-2 rounded-lg hover:bg-[#f7efe7] transition-all"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => adicionarAoCarrinho(p.id_produto)}
                      disabled={adicionando === p.id_produto}
                      className={`px-4 py-2 rounded-lg text-white transition-all ${
                        adicionando === p.id_produto
                          ? "bg-[#6f4728] opacity-70 cursor-wait"
                          : "bg-[#8b5e34] hover:bg-[#6f4728]"
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
