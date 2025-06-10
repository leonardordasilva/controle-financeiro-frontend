import Button from "./button";

export default function DeleteButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-danger text-white">
      Excluir
    </Button>
  );
}
