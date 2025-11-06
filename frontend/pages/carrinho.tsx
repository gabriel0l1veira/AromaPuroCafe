import { useEffect, useState } from "react";

interface ItemCarrinho {
  id_item_carrinho: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  imagem_url?: string | null;
}

export default function Carrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [limpando, setLimpando] = useState(false);
  const [atualizando, setAtualizando] = useState<number | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const carregar = async () => {
    try {
      const res = await fetch(`${apiUrl}/carrinho`);
      if (!res.ok) throw new Error("Erro ao buscar carrinho");
      const data = await res.json();
      setItens(data);
    } catch (error) {
      console.error("❌ Erro ao carregar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const removerItem = async (id: number) => {
    try {
      const res = await fetch(`${apiUrl}/carrinho/remover/${id}`, { method: "DELETE" });
      if (res.ok) setItens((prev) => prev.filter((i) => i.id_item_carrinho !== id));
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const limparCarrinho = async () => {
    setLimpando(true);
    try {
      const res = await fetch(`${apiUrl}/carrinho/limpar`, { method: "DELETE" });
      if (res.ok) setItens([]);
    } catch (e) {
      console.error("Erro ao limpar carrinho:", e);
    } finally {
      setLimpando(false);
    }
  };

  // ✅ Atualizar quantidade do item
  const atualizarQuantidade = async (id_item_carrinho: number, novaQtd: number) => {
    if (novaQtd < 1) return;
    setAtualizando(id_item_carrinho);

    try {
      const res = await fetch(`${apiUrl}/carrinho/atualizar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_item_carrinho, quantidade: novaQtd }),
      });

      if (res.ok) {
        setItens((prev) =>
          prev.map((i) =>
            i.id_item_carrinho === id_item_carrinho ? { ...i, quantidade: novaQtd } : i
          )
        );
      } else {
        console.error("Erro ao atualizar quantidade");
      }
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
    } finally {
      setAtualizando(null);
    }
  };

  const subtotal = itens.reduce((sum, i) => sum + i.preco_unitario * i.quantidade, 0);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#4b2e14]">
          Seu Carrinho ({itens.length} {itens.length === 1 ? "item" : "itens"})
        </h1>
        <button
          onClick={limparCarrinho}
          disabled={limpando || itens.length === 0}
          className="border border-[#8b5e34] text-[#8b5e34] px-4 py-2 rounded-lg hover:bg-[#f7efe7] disabled:opacity-50"
        >
          {limpando ? "Limpando..." : "Limpar Carrinho"}
        </button>
      </div>

      {itens.length === 0 ? (
        <p className="text-[#5a4631]">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2 space-y-4">
            {itens.map((item) => (
              <div
                key={item.id_item_carrinho}
                className="p-4 bg-white rounded-2xl shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f3e9dc] flex items-center justify-center">
                    {item.imagem_url ? (
                      <img
                        src={
                          item.imagem_url.startsWith("/")
                            ? item.imagem_url
                            : `/${item.imagem_url}`
                        }
                        alt={item.nome_produto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-[#8b5e34]">☕</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{item.nome_produto}</p>
                    <p className="text-sm text-[#5a4631]">
                      Preço: R$ {item.preco_unitario.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantidade e ações */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => atualizarQuantidade(item.id_item_carrinho, item.quantidade - 1)}
                      className="px-3 py-1 bg-[#f3e9dc] hover:bg-[#e7dccd]"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={(e) =>
                        atualizarQuantidade(
                          item.id_item_carrinho,
                          Number(e.target.value)
                        )
                      }
                      className="w-12 text-center border-l border-r border-[#e0cdb7] outline-none"
                    />
                    <button
                      onClick={() => atualizarQuantidade(item.id_item_carrinho, item.quantidade + 1)}
                      className="px-3 py-1 bg-[#f3e9dc] hover:bg-[#e7dccd]"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-[#8b5e34] w-20 text-right">
                    R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removerItem(item.id_item_carrinho)}
                    disabled={atualizando === item.id_item_carrinho}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <aside className="bg-white rounded-2xl shadow p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-[#5a4631]">
              <span>Frete</span>
              <span>Calculado no checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="block text-center bg-[#8b5e34] text-white py-3 rounded-xl hover:bg-[#6f4728] transition-all"
            >
              Ir para Checkout
            </a>
          </aside>
        </div>
      )}
    </main>
  );
}
