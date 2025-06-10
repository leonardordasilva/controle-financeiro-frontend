import Button from "./button";

export default function NovoItemButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-success text-white">
      Novo Item
    </Button>
  );
}
