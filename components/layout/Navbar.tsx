import Link from "next/link";

const navItems = [
  { label: "Categories", href: "/categories" },
  { label: "Near You", href: "/near-you" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="font-display text-lg font-semibold text-sand">
        Fonsi
      </Link>

      <div className="hidden items-center gap-1 rounded-full bg-white/10 px-2 py-1 backdrop-blur md:flex">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm text-sand/90 transition-colors hover:bg-white/10 hover:text-sand"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Link
        href="/submit"
        className="rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
      >
        Submit a Group
      </Link>
    </nav>
  );
}
