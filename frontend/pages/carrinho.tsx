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
  const [mostrarModal, setMostrarModal] = useState(false); // 🔹 novo estado do modal

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

  // 🔹 Função real de limpeza (chamada após confirmação)
  const limparCarrinho = async () => {
    setLimpando(true);
    try {
      const res = await fetch(`${apiUrl}/carrinho/limpar`, { method: "DELETE" });
      if (res.ok) setItens([]);
      setMostrarModal(false);
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

  if (loading)
    return <p className="p-6 text-[#3a2411] text-center text-lg">Carregando carrinho...</p>;

  return (
    <main className="min-h-screen bg-[#f3efea] px-6 py-10 text-[#2e1a0d] relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#3a2411]">
          Seu Carrinho ({itens.length} {itens.length === 1 ? "item" : "itens"})
        </h1>
        <button
          onClick={() => setMostrarModal(true)} // 🔹 abre o modal
          disabled={limpando || itens.length === 0}
          className="border border-[#a06b42] text-[#a06b42] px-5 py-2 rounded-xl hover:bg-[#f8f3ed] hover:text-[#874d2b] transition-all disabled:opacity-50 shadow-sm"
        >
          {limpando ? "Limpando..." : "🗑️ Limpar Carrinho"}
        </button>
      </div>

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-[#4a3323] text-lg font-medium mb-4">
            Seu carrinho está vazio ☕
          </p>
          <a
            href="/"
            className="bg-[#a06b42] hover:bg-[#874d2b] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
          >
            Voltar à Loja
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2 space-y-4">
            {itens.map((item) => (
              <div
                key={item.id_item_carrinho}
                className="p-4 bg-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e7dccd]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f6f1ea] flex items-center justify-center shadow-sm">
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
                      <span className="text-sm text-[#a06b42]">☕</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{item.nome_produto}</p>
                    <p className="text-sm text-[#4a3323]">
                      Preço: R$ {item.preco_unitario.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantidade e ações */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#e0cdb7] rounded-lg overflow-hidden">
                    <button
                      onClick={() => atualizarQuantidade(item.id_item_carrinho, item.quantidade - 1)}
                      className="px-3 py-1 bg-[#f6f1ea] hover:bg-[#e7dccd] transition"
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
                      className="w-12 text-center border-l border-r border-[#e0cdb7] outline-none bg-white"
                    />
                    <button
                      onClick={() => atualizarQuantidade(item.id_item_carrinho, item.quantidade + 1)}
                      className="px-3 py-1 bg-[#f6f1ea] hover:bg-[#e7dccd] transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-[#a06b42] w-20 text-right">
                    R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removerItem(item.id_item_carrinho)}
                    disabled={atualizando === item.id_item_carrinho}
                    className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-all"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo */}
          <aside className="bg-white rounded-2xl shadow-md p-6 h-fit border border-[#e7dccd]">
            <h2 className="text-xl font-semibold mb-4 text-[#3a2411]">Resumo do Pedido</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm text-[#4a3323]">
              <span>Frete</span>
              <span>Calculado no checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4 text-[#3a2411]">
              <span>Total</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <a
              href="/checkout"
              className="block text-center bg-[#a06b42] hover:bg-[#874d2b] text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Ir para Checkout
            </a>
          </aside>
        </div>
      )}

      {/* 🔹 Modal estilizado de confirmação */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] sm:w-[400px] text-center">
            <h2 className="text-2xl font-bold text-[#3a2411] mb-3">
              Limpar Carrinho?
            </h2>
            <p className="text-[#4a3323] mb-6">
              Tem certeza de que deseja remover <b>todos os itens</b> do carrinho?  
              Esta ação não poderá ser desfeita.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 text-[#3a2411] font-medium hover:bg-gray-300 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={limparCarrinho}
                disabled={limpando}
                className="px-5 py-2 rounded-xl bg-[#a06b42] hover:bg-[#874d2b] text-white font-semibold transition-all shadow-md"
              >
                {limpando ? "Limpando..." : "Sim, limpar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
