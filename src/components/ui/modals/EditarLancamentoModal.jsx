import {Dialog} from "@headlessui/react";
import {useEffect, useState} from "react";
import InputMoeda from "../inputs/CurrencyInput";
import {toast} from "react-toastify";
import api from "../../../services/api";
import CancelButton from "../buttons/CancelButton";
import SaveButton from "../buttons/SaveButton";

export default function EditarLancamentoModal({
                                                  open,
                                                  onClose,
                                                  onSave,
                                                  valorAtual,
                                                  lancamentoId,
                                                  itemId,
                                                  mes,
                                                  ano
                                              }) {
    const [valor, setValor] = useState(valorAtual);

    useEffect(() => {
        setValor(valorAtual);
    }, [valorAtual, open]);

    const handleSubmit = async () => {
        const novoValor = parseFloat(valor);
        // Se o input estiver vazio ou o valor resultante for NaN ou igual a 0, exiba uma mensagem de errro!
        if (!valor || isNaN(novoValor) || novoValor === 0) {
            toast.error("Lançamento não pode ser zero ou vazio!");
        } else {
            try {
                await api.put(`/valores/${lancamentoId}`, {
                    item: {id: parseInt(itemId)},
                    ano: ano,
                    mes: mes,
                    valor: novoValor
            });
                toast.success("Lançamento atualizado com sucesso!");
                onSave && onSave();
                onClose();
            } catch (err) {
                console.error(err);
                toast.error("Erro ao atualizar lançamento");
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-40"/>
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative bg-white p-6 rounded shadow-md max-w-md w-full z-50">
                <Dialog.Title className="text-xl font-bold mb-4">Editar Lançamento</Dialog.Title>
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg space-y-4">
                    <InputMoeda
                        value={valor}
                        onChange={setValor}
                        placeholder="Valor"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex justify-end gap-2">
                        <CancelButton onClick={onClose}>Cancelar</CancelButton>
                        <SaveButton onClick={handleSubmit}>Salvar</SaveButton>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}