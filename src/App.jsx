import { useState } from "react";
import Layout from "./components/Layout";
import ItensPage from "./pages/ItensPage";
import LancamentosPage from "./pages/LancamentosPage";
import RelatorioPage from "./pages/RelatorioPage";

export default function App() {
  const [page, setPage] = useState("itens");

  const renderPage = () => {
    if (page === "itens") return <ItensPage />;
    if (page === "lancamentos") return <LancamentosPage />;
    if (page === "relatorio") return <RelatorioPage />;
    return null;
  };

  return (
    <div className="flex">
      <Layout setPage={setPage} />
      <main className="ml-60 p-6 w-full">{renderPage()}</main>
    </div>
  );
}