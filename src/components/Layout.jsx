import { CircleDollarSign, LayoutDashboard, ListTodo } from "lucide-react";

export default function Layout({ setPage }) {
  const menuItems = [
    { label: "Itens", icon: <ListTodo className="w-5 h-5" />, page: "itens" },
    { label: "Lançamentos", icon: <CircleDollarSign className="w-5 h-5" />, page: "lancamentos" },
    { label: "Relatório", icon: <LayoutDashboard className="w-5 h-5" />, page: "relatorio" },
  ];

  return (
    <aside className="w-60 h-screen fixed bg-white border-r border-muted shadow-lg p-4 flex flex-col">
      <h1 className="text-xl font-bold text-primary mb-8 text-center">Finance App</h1>
      <nav className="flex flex-col gap-2">
        {menuItems.map(({ label, icon, page }) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent text-gray-700 transition-colors"
          >
            {icon}
            <span className="text-base">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
