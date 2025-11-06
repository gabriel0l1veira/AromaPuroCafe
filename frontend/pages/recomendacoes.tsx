import { useState } from "react";

export default function Recomendacoes() {
  const [preferencia, setPreferencia] = useState("");
  const [recomendacao, setRecomendacao] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/recomendacoes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferencia }),
      });
      const data = await res.json();
      setRecomendacao(data);
    } catch {
      alert("Erro ao obter recomendação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f6f1] text-[#3a2a1a] flex flex-col items-center py-20 px-6">
      <h1 className="text-4xl font-['Playfair_Display'] font-bold mb-6 text-center">
        Recomendações com IA ☕
      </h1>
      <p className="text-lg text-[#5a4631] mb-10 max-w-2xl text-center">
        Conte-nos sobre seus gostos e preferências e nossa IA encontrará o café perfeito para você.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-md animate-fadeSlideIn"
      >
        <textarea
          value={preferencia}
          onChange={(e) => setPreferencia(e.target.value)}
          placeholder="Ex: Gosto de cafés encorpados com notas de chocolate e aroma intenso..."
          className="w-full border border-[#e2d5c3] rounded-xl p-4 focus:ring-2 focus:ring-[#8b5e34] resize-none h-32 mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8b5e34] text-white py-3 rounded-xl hover:bg-[#6f4728] transition-all"
        >
          {loading ? "Gerando recomendação..." : "Obter Recomendação"}
        </button>
      </form>

      {recomendacao && (
        <div className="mt-10 bg-white p-8 rounded-3xl shadow-md w-full max-w-lg text-center animate-fadeIn">
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold mb-2">
            {recomendacao.nome}
          </h2>
          <p className="text-[#5a4631]">{recomendacao.mensagem}</p>
          <p className="mt-3 font-semibold text-[#8b5e34]">
            R$ {recomendacao.preco_base.toFixed(2)}
          </p>
        </div>
      )}
    </main>
  );
}
