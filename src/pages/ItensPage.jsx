import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import ItemModal from "../components/ui/modals/ItemModal";
import ConfirmDeleteModal from "../components/ui/modals/ConfirmDeleteModal";
import NovoItemButton from "../components/ui/buttons/NovoItemButton";
import EditButton from "../components/ui/buttons/EditButton";
import DeleteButton from "../components/ui/buttons/DeleteButton";

export default function ItensPage() {
  const [itens, setItens] = useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const listar = async () => {
    const res = await api.get("/itens");
    setItens(res.data);
  };

  const salvar = async (item) => {
    if (!item.nome.trim()) {
      toast.error("O nome do item é obrigatório.");
      return;
    }
    if (item.id) {
      await api.put(`/itens/${item.id}`, item);
      toast.success("Item atualizado!");
    } else {
      await api.post("/itens", item);
      toast.success("Item criado!");
    }
    listar();
  };

  const excluir = async () => {
    if (itemSelecionado) {
      await api.delete(`/itens/${itemSelecionado.id}`);
      toast.success("Item excluído!");
      listar();
    }
    setModalExcluir(false);
  };

  const abrirEdicao = (item) => {
    setItemSelecionado(item);
    setModalEditar(true);
  };

  const abrirExclusao = (item) => {
    setItemSelecionado(item);
    setModalExcluir(true);
  };

  useEffect(() => {
    listar();
  }, []);

  // Separando os itens em Receitas e Despesas (ordenados)
  const receitas = itens
      .filter((i) => i.tipo === "RECEITA")
      .sort((a, b) => a.nome.localeCompare(b.nome));

  const despesas = itens
      .filter((i) => i.tipo === "DESPESA")
      .sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6 p-4">
        <h2 className="text-2xl font-bold">Itens</h2>

        <NovoItemButton
            onClick={() => {
              setItemSelecionado(null);
              setModalEditar(true);
            }}
        >
          Novo Item
        </NovoItemButton>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600">
            <tr>
              <th className="p-3 text-left text-white font-semibold w-1/2">Receitas</th>
              <th className="p-3 text-left text-white font-semibold w-1/2">Despesas</th>
            </tr>
            </thead>
            <tbody className="bg-white">
            <tr>
              {/* Coluna de RECEITAS */}
              <td className="p-4 border-r align-top">
                {receitas.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center mb-2 border-b pb-1"
                    >
                      <span className="text-gray-700">{item.nome}</span>
                      <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <EditButton onClick={() => abrirEdicao(item)} />
                        <DeleteButton onClick={() => abrirExclusao(item)} />
                      </motion.div>
                    </div>
                ))}
              </td>
              {/* Coluna de DESPESAS */}
              <td className="p-4 align-top">
                {despesas.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center mb-2 border-b pb-1"
                    >
                      <span className="text-gray-700">{item.nome}</span>
                      <div className="flex items-center gap-2">
                        <EditButton onClick={() => abrirEdicao(item)} />
                        <DeleteButton onClick={() => abrirExclusao(item)} />
                      </div>
                    </div>
                ))}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        {/* Modal de criação/edição de item */}
        <ItemModal
            open={modalEditar}
            onClose={() => setModalEditar(false)}
            onSave={salvar}
            initialData={itemSelecionado}
        />

        {/* Modal de exclusão de item */}
        <ConfirmDeleteModal
            open={modalExcluir}
            onClose={() => setModalExcluir(false)}
            onConfirm={excluir}
            itemName={itemSelecionado?.nome}
        />
      </motion.div>
  );
}