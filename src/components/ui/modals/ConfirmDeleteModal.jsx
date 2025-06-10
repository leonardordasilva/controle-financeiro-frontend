import { Dialog } from "@headlessui/react";
import CancelButton from "../buttons/CancelButton";
import DeleteButton from "../buttons/DeleteButton";

export default function ConfirmDeleteModal({ open, onClose, onConfirm, itemName }) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg bg-white p-6 rounded shadow-md z-50 max-w-md w-full">
        <Dialog.Title className="text-xl font-bold mb-4">Confirmar exclusão</Dialog.Title>
        <p>Tem certeza que deseja excluir <strong>{itemName}</strong>?</p>
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex justify-end gap-2 mt-4">
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <DeleteButton onClick={onConfirm}>Excluir</DeleteButton>
        </div>
      </div>
    </Dialog>
  );
}