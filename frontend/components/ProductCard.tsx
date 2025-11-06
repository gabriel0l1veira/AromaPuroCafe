"use client";

interface ProductCardProps {
  product: {
    id_produto?: number;
    nome?: string | null;
    preco?: number | string | null;
    imagem_url?: string | null;
    tipo?: string | null;
    id_categoria?: number | null;
  };
  onAdd?: () => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const nomeProduto =
    typeof product?.nome === "string" ? product.nome : "Produto sem nome";
  const tipoProduto =
    typeof product?.tipo === "string" ? product.tipo : "Produto artesanal";
  const precoProduto = Number(product?.preco || 0);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 overflow-hidden">
      {/* Imagem */}
      <div className="h-48 w-full bg-[#f3e9dc] flex items-center justify-center relative">
        {product?.imagem_url ? (
          <img
            src={
              product.imagem_url.startsWith("/")
                ? product.imagem_url
                : `/${product.imagem_url}`
            }
            alt={nomeProduto}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-4xl text-[#8b5e34]">☕</span>
        )}
      </div>

      {/* Informações */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between text-xs text-[#8b5e34]/80">
          <span>{tipoProduto}</span>
          <span>Cat. {product?.id_categoria || "-"}</span>
        </div>

        <h3 className="text-lg font-semibold text-[#4b2e14] truncate">
          {nomeProduto}
        </h3>

        <div className="flex justify-between items-center mt-3">
          <p className="text-lg font-bold text-[#4b2e14]">
            R$ {precoProduto.toFixed(2)}
          </p>

          <button
            onClick={onAdd}
            className="bg-[#8b5e34] text-white px-4 py-2 rounded-lg hover:bg-[#6f4728] transition"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
