import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { Input } from "../inputs/input";
import { toast } from "react-toastify";
import CancelButton from "../buttons/CancelButton";
import SaveButton from "../buttons/SaveButton";

export default function ItemModal({ open, onClose, onSave, initialData }) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("RECEITA");

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || "");
      setTipo(initialData.tipo || "RECEITA");
    } else {
      setNome("");
      setTipo("RECEITA");
    }
  }, [initialData, open]);

  // Se tiver 'id', então estamos editando; senão, é novo item.
  const tituloModal = initialData?.id ? "Editar Item" : "Novo Item";

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast.error("O nome do item é obrigatório.");
      return;
    }

    onSave({ ...initialData, nome, tipo });
    onClose();
  };

  return (
      <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg bg-white p-6 rounded shadow-md z-50 max-w-md w-full">
          {/* Usa a variável 'tituloModal' para o título */}
          <Dialog.Title className="text-xl font-bold mb-4">{tituloModal}</Dialog.Title>

          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4">
            <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
            />
            <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="border rounded px-3 py-2 w-full"
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex justify-end gap-2">
              <CancelButton onClick={onClose}>Cancelar</CancelButton>
              <SaveButton onClick={handleSubmit}>Salvar</SaveButton>
            </div>
          </div>
        </div>
      </Dialog>
  );
}