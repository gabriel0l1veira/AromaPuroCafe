import type { AppProps } from "next/app";
import "../styles/globals.css";
import Header from "../components/Header";
import { CarrinhoProvider } from "../context/CartContext"; // 🧩 Importa o contexto

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CarrinhoProvider>
      <div className="bg-stone-50 min-h-screen text-stone-800">
        <Header />
        <main className="pt-24 container mx-auto px-4">
          <Component {...pageProps} />
        </main>
        <footer className="text-center py-6 text-sm text-stone-600">
          © {new Date().getFullYear()} Aroma Puro Café ☕ — Todos os direitos reservados
        </footer>
      </div>
    </CarrinhoProvider>
  );
}
