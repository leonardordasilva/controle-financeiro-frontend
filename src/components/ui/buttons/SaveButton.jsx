import Button from "./button";

export default function SaveButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-primary text-white">
      Salvar
    </Button>
  );
}
