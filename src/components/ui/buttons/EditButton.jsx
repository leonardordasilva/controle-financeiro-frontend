import Button from "./button";

export default function EditButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-warning text-white">
      Editar
    </Button>
  );
}
