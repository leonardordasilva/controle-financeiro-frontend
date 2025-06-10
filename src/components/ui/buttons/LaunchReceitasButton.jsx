import Button from "./button";

export default function LaunchReceitasButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-success text-white">
      Lançar Receitas
    </Button>
  );
}
