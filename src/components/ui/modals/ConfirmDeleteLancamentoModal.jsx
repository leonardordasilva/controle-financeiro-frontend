// frontend/src/components/ui/modals/ConfirmDeleteLancamentoModal.jsx
import { Dialog } from "@headlessui/react";
import CancelButton from "../buttons/CancelButton";
import DeleteButton from "../buttons/DeleteButton";

export default function ConfirmDeleteLancamentoModal({ open, onClose, onConfirm, nomeItem }) {
    return (
        <Dialog open={open} onClose={onClose} className="fixed inset-0 flex items-center justify-center z-50">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-40"/>
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg relative bg-white p-6 rounded shadow-md max-w-md w-full z-50">
                <Dialog.Title className="text-xl font-bold mb-4">Confirmar Exclusão</Dialog.Title>
                <p className="mb-4">Deseja realmente excluir o lançamento referente a <strong>{nomeItem}</strong>?</p>
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex justify-end gap-2">
                    <CancelButton onClick={onClose}>
                        Cancelar
                    </CancelButton>
                    <DeleteButton onClick={onConfirm}>
                        Excluir
                    </DeleteButton>
                </div>
            </div>
        </Dialog>
    );
}