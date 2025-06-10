import Button from "./button";

export default function CancelButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-muted text-gray-800">
      Cancelar
    </Button>
  );
}
