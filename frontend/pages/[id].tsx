import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCarrinho } from "../context/CartContext";

interface Produto {
  id_produto: number;
  nome: string;
  preco_base: number;
  tipo_produto?: string;
  imagem_url?: string;
  id_categoria?: number;
  estoque_disponivel?: number;
}

export default function DetalhesProduto() {
  const router = useRouter();
  const { id } = router.query;
  const { adicionarAoCarrinho } = useCarrinho();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduto = async () => {
      try {
        const res = await fetch(`${apiUrl}/produtos/${id}`);
        if (!res.ok) throw new Error("Erro ao buscar produto");
        const data = await res.json();
        setProduto(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setErro("Não foi possível carregar o produto.");
      } finally {
        setCarregando(false);
      }
    };

    fetchProduto();
  }, [id, apiUrl]);

  if (carregando)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6f4728]">
        Carregando produto...
      </div>
    );

  if (erro)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {erro}
      </div>
    );

  if (!produto)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#8b5e34]">
        Produto não encontrado.
      </div>
    );

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-10">
        {/* 🖼️ Imagem */}
        <div className="w-full lg:w-1/2 flex justify-center items-center bg-[#f3e9dc] rounded-2xl overflow-hidden">
          {produto.imagem_url ? (
            <img
              src={
                produto.imagem_url.startsWith("/")
                  ? produto.imagem_url
                  : `/${produto.imagem_url}`
              }
              alt={produto.nome}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-6xl text-[#8b5e34]">☕</span>
          )}
        </div>

        {/* 🧾 Detalhes */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-[#4b2e14]">{produto.nome}</h1>
          <p className="text-[#6f4728]/80">
            {produto.tipo_produto || "Produto artesanal de alta qualidade"}
          </p>
          <p className="text-2xl font-bold text-[#4b2e14] mt-4">
            R$ {produto.preco_base.toFixed(2)}
          </p>

          <button
            onClick={() =>
              adicionarAoCarrinho({
                id_produto: produto.id_produto,
                nome_produto: produto.nome,
                preco_unitario: produto.preco_base,
                quantidade: 1,
              })
            }
            className="bg-[#8b5e34] hover:bg-[#6f4728] text-white px-6 py-3 rounded-xl mt-6 font-semibold transition-all"
          >
            Adicionar ao Carrinho
          </button>

          <button
            onClick={() => router.push("/carrinho")}
            className="block mt-3 text-sm text-[#6f4728] underline hover:text-[#4b2e14]"
          >
            Ver carrinho
          </button>
        </div>
      </div>
    </main>
  );
}
