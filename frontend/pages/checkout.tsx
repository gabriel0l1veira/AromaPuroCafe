import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ItemCarrinho {
  id_item_carrinho: number;
  nome_produto: string;
  quantidade: number;
  preco_unitario: number;
  imagem_url?: string | null;
}

export default function Checkout() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [mensagem, setMensagem] = useState("");
  const [finalizando, setFinalizando] = useState(false);

  // 🔹 Buscar itens do carrinho
  useEffect(() => {
    const carregarCarrinho = async () => {
      try {
        const res = await fetch(`${apiUrl}/carrinho`);
        if (!res.ok) throw new Error("Erro ao buscar carrinho");
        const data = await res.json();
        setItens(data);
      } catch (e) {
        console.error("Erro ao carregar carrinho:", e);
      }
    };
    carregarCarrinho();
  }, [apiUrl]);

  const subtotal = itens.reduce((sum, i) => sum + i.preco_unitario * i.quantidade, 0);

  // 🔹 Enviar pedido
  const finalizarPedido = async () => {
    if (!nome || !endereco || !bairro || !cidade || !cep) {
      setMensagem("⚠️ Preencha todos os campos obrigatórios!");
      return;
    }

    setFinalizando(true);
    setMensagem("Enviando pedido...");

    try {
      const res = await fetch(`${apiUrl}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          endereco,
          numero,
          bairro,
          cidade,
          cep,
          forma_pagamento: formaPagamento,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMensagem(`✅ Pedido #${data.id_pedido} criado com sucesso!`);
        setTimeout(() => router.push("/"), 3000);
      } else {
        const erro = await res.json().catch(() => ({}));
        setMensagem(erro.erro || "Erro ao finalizar pedido.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      setMensagem("Erro ao conectar com o servidor.");
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f6f1] px-6 py-10">
      <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#4b2e14] mb-10 text-center">
        Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 🧾 Coluna Esquerda — Itens do Pedido */}
        <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          {itens.length === 0 ? (
            <p className="text-[#6f4728]">Seu carrinho está vazio.</p>
          ) : (
            itens.map((item) => (
              <div
                key={item.id_item_carrinho}
                className="flex items-center justify-between border-b border-[#e0cdb7] pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f3e9dc] flex items-center justify-center">
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
                    <p className="font-medium">{item.nome_produto}</p>
                    <p className="text-sm text-[#5a4631]">
                      {item.quantidade}x R$ {item.preco_unitario.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-[#8b5e34]">
                  R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
                </p>
              </div>
            ))
          )}

          <div className="flex justify-between font-bold text-lg pt-3">
            <span>Total:</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
        </section>

        {/* 🧍 Coluna Direita — Dados do Cliente */}
        <section className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold mb-4">Dados para Entrega</h2>

          <input
            type="text"
            placeholder="Nome completo"
            className="w-full border rounded-lg px-4 py-2"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Endereço"
            className="w-full border rounded-lg px-4 py-2"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Número"
              className="border rounded-lg px-4 py-2"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
            <input
              type="text"
              placeholder="Bairro"
              className="border rounded-lg px-4 py-2"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Cidade"
              className="border rounded-lg px-4 py-2"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
            <input
              type="text"
              placeholder="CEP"
              className="border rounded-lg px-4 py-2"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
          </div>

          <div>
            <h3 className="font-semibold mt-4 mb-2">Forma de Pagamento</h3>
            <div className="flex flex-wrap gap-4">
              {["pix", "boleto", "cartao_credito", "cartao_debito"].map((opcao) => (
                <label key={opcao} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="forma_pagamento"
                    value={opcao}
                    checked={formaPagamento === opcao}
                    onChange={(e) => setFormaPagamento(e.target.value)}
                  />
                  <span className="capitalize">
                    {opcao.replace("_", " ").replace("cartao", "Cartão")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {mensagem && (
            <p className="text-sm text-[#8b5e34] mt-2 text-center">{mensagem}</p>
          )}

          <button
            onClick={finalizarPedido}
            disabled={finalizando}
            className="w-full bg-[#8b5e34] hover:bg-[#6f4728] text-white py-3 rounded-xl mt-4 font-semibold transition-all"
          >
            {finalizando ? "Finalizando..." : "Finalizar Pedido"}
          </button>
        </section>
      </div>
    </main>
  );
}
