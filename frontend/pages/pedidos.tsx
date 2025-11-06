import { useEffect, useState } from "react";

interface Pedido {
  id_pedido: number;
  data_hora_pedido: string;
  valor_total: number;
  status_pedido: string;
  forma_pagamento: string;
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch(`${apiUrl}/pedidos/`);
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        setErro("Não foi possível carregar seus pedidos.");
      } finally {
        setCarregando(false);
      }
    };
    fetchPedidos();
  }, [apiUrl]);

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6f4728]">
        Carregando pedidos...
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
        Meus Pedidos
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {pedidos.length > 0 ? (
          <ul className="divide-y divide-[#e0cdb7]">
            {pedidos.map((pedido) => (
              <li key={pedido.id_pedido} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-[#4b2e14]">
                      Pedido #{pedido.id_pedido}
                    </h2>
                    <p className="text-sm text-[#6f4728]">
                      {new Date(pedido.data_hora_pedido).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#8b5e34]">
                      R$ {pedido.valor_total.toFixed(2)}
                    </p>
                    <p className="text-sm capitalize text-[#5a4631]">
                      {pedido.forma_pagamento.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-2 text-[#6f4728]">
                  Status: <span className="font-semibold">{pedido.status_pedido}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-[#6f4728]">
            Você ainda não possui pedidos.
          </p>
        )}
      </div>
    </main>
  );
}
