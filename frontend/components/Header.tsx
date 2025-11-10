"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Coffee,
  Star,
  ClipboardList,
  ShoppingCart,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início", Icon: House },
    { href: "/produtos", label: "Produtos", Icon: Coffee },
    { href: "/recomendacoes", label: "Recomendações", Icon: Star },
    { href: "/pedidos", label: "Pedidos", Icon: ClipboardList },
    { href: "/carrinho", label: "Carrinho", Icon: ShoppingCart },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-cafe-escuro text-cafe-claro shadow-lg z-50 border-b border-cafe-medio">
      <nav className="container mx-auto flex items-center justify-between px-8 py-4">
        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-['Playfair_Display'] font-bold text-cafe-claro hover:text-cafe-destaque transition-all tracking-wide"
        >
          Aroma Puro Café
        </Link>

        {/* MENU */}
        <ul className="flex gap-8 items-center">
          {navItems.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center text-sm font-medium transition-all ${
                    isActive
                      ? "text-cafe-destaque"
                      : "text-cafe-claro hover:text-cafe-destaque"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={1.75}
                    className={`mb-1 transition-transform ${
                      isActive ? "scale-110" : "hover:scale-110"
                    }`}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
