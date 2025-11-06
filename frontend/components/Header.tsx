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
    <header className="bg-amber-950 text-white shadow-md fixed w-full top-0 left-0 z-50">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold hover:text-amber-400 transition-colors"
        >
          Aroma Puro Café
        </Link>

        <ul className="flex gap-6 items-center">
          {navItems.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center text-sm transition-colors ${
                  pathname === href ? "text-amber-400" : "hover:text-amber-400"
                }`}
              >
                <Icon size={22} strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
