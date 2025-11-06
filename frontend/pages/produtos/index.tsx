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
      <div className="min-h-screen flex items-center justify-center text-[#6f4728]">
        Carregando produtos...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {erro}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-6 py-10">
      <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#4b2e14] mb-10 text-center">
        Nossos Produtos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <div
              key={produto.id_produto}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transition-transform"
            >
              <div className="w-full h-56 bg-[#f3e9dc] flex items-center justify-center overflow-hidden">
                <img
                  src={
                    produto.imagem_url
                      ? produto.imagem_url.startsWith("/")
                        ? produto.imagem_url
                        : `/${produto.imagem_url}`
                      : "/placeholder.png"
                  }
                  alt={produto.nome}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-[#4b2e14] mb-2">
                  {produto.nome}
                </h2>
                <p className="text-[#8b5e34] font-semibold mb-3">
                  R$ {produto.preco_base.toFixed(2)}
                </p>
                <p
                  className={`text-sm mb-4 ${
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
                  className="mt-auto text-center bg-[#8b5e34] hover:bg-[#6f4728] text-white py-2 rounded-xl font-semibold transition-all"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-[#6f4728]">
            Nenhum produto disponível no momento.
          </p>
        )}
      </div>
    </main>
  );
}
