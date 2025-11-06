import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCarrinho } from "@context/CartContext";

interface Produto {
  id_produto: number;
  nome: string;
  preco_base: number;
  descricao?: string;
  imagem_url?: string;
  tipo_produto?: string;
}

export default function DetalhesProduto() {
  const router = useRouter();
  const { id } = router.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const { adicionarAoCarrinho } = useCarrinho();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

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
        setMensagem("Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [id, apiUrl]);

  const handleAddToCart = async () => {
    if (!produto) return;

    try {
      const res = await fetch(`${apiUrl}/carrinho/adicionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produto: produto.id_produto,
          quantidade: 1,
        }),
      });

      if (res.ok) {
        adicionarAoCarrinho({
          id_item_carrinho: Date.now(),
          nome_produto: produto.nome,
          preco_unitario: produto.preco_base,
          quantidade: 1,
          imagem_url: produto.imagem_url,
        });
        setMensagem("✅ Produto adicionado ao carrinho!");
      } else {
        const erro = await res.json();
        setMensagem(erro.erro || "Erro ao adicionar produto ao carrinho.");
      }
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[#8b5e34]">
        <p>Carregando produto...</p>
      </main>
    );
  }

  if (!produto) {
    return (
      <main className="min-h-screen flex items-center justify-center text-[#8b5e34]">
        <p>{mensagem || "Produto não encontrado."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f9f6f1] py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-8">
        {/* Imagem do produto */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
          <img
            src={
              produto.imagem_url?.startsWith("/")
                ? produto.imagem_url
                : `/${produto.imagem_url || "placeholder.jpg"}`
            }
            alt={produto.nome}
            className="w-full h-auto rounded-xl object-cover shadow-md"
          />
        </div>

        {/* Detalhes */}
        <div className="flex-1">
          <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#4b2e14] mb-3">
            {produto.nome}
          </h1>
          <p className="text-lg text-[#6f4728] mb-2">
            R$ {produto.preco_base.toFixed(2)}
          </p>
          <p className="text-sm text-[#5a4631] mb-4">
            {produto.descricao || "Café especial selecionado para você."}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-[#8b5e34] hover:bg-[#6f4728] text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Adicionar ao Carrinho
          </button>

          {mensagem && (
            <p className="mt-3 text-sm text-[#8b5e34] text-center">{mensagem}</p>
          )}
        </div>
      </div>
    </main>
  );
}
