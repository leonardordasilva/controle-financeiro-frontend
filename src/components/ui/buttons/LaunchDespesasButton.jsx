import Button from "./button";

export default function LaunchDespesasButton({ onClick }) {
  return (
    <Button onClick={onClick} className="bg-danger text-white">
      Lançar Despesas
    </Button>
  );
}
