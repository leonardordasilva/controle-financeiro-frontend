// frontend/src/components/ui/modals/LancarItensModal.jsx
import {Dialog} from "@headlessui/react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import api from "../../../services/api";
import InputMoeda from "../inputs/CurrencyInput";
import CancelButton from "../buttons/CancelButton";
import SaveButton from "../buttons/SaveButton";

export default function LancarItensModal({
                                             open,
                                             onClose,
                                             tipo,
                                             mes,
                                             ano,
                                             onSalvou,
                                             itensNaoLancados,
                                         }) {
    const [valores, setValores] = useState({}); // { itemId: valor }

    // Sempre que abrir o modal, resetamos os valores
    useEffect(() => {
        if (open) {
            setValores({});
        }
    }, [open]);

    const handleChangeValor = (itemId, valor) => {
        setValores((prev) => ({
            ...prev,
            [itemId]: valor,
        }));
    };

    const handleSalvar = async () => {
        // Cria payloads para os itens com valor > 0
        const payloads = Object.entries(valores)
            .map(([id, val]) => ({
                item: {id: parseInt(id)},
                valor: parseFloat(val) || 0,
                mes,
                ano,
            }))
            .filter((p) => p.valor > 0);

        if (payloads.length === 0) {
            toast.info("Nenhum valor informado");
            onClose();
            return;
        }

        try {
            for (const p of payloads) {
                await api.post("/valores", p);
            }
            toast.success("Lançamentos salvos!");
            onClose();
            onSalvou && onSalvou();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar lançamentos");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30"/>
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative bg-white p-6 rounded shadow-md max-w-lg w-full">
                <Dialog.Title className="text-xl font-bold mb-4">
                    Lançar {tipo === "RECEITA" ? "Receitas" : "Despesas"}
                </Dialog.Title>

                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg max-h-64 overflow-auto space-y-2">
                    {itensNaoLancados && itensNaoLancados.length > 0 ? (
                        itensNaoLancados.map((item) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <label className="w-1/2">{item.nome}</label>
                                <InputMoeda
                                    value={valores[item.id] || ""}
                                    onChange={(v) => handleChangeValor(item.id, v)}
                                    placeholder="Valor"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">
                            Não há itens disponíveis para lançamento.
                        </p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex justify-end mt-4 gap-2">
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    <SaveButton onClick={handleSalvar}>Salvar</SaveButton>
                </div>
            </div>
        </Dialog>
    );
}