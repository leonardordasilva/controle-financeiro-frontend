// frontend/src/components/ui/ResumoLancamentos.jsx
import React from "react";

export default function ResumoLancamentos({ totalReceitas, totalDespesas }) {
    const saldo = totalReceitas - totalDespesas;

    const formatarMoeda = (valor) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);

    return (
        <div className="bg-white shadow rounded p-4">
            <h4 className="text-lg font-semibold mb-2">Resumo</h4>
            <table className="min-w-full table-auto text-left border border-muted rounded-md shadowmin-w-full border-collapse">
                <tbody>
                <tr>
                    <td className="p-2">Total de Receitas</td>
                    <td className="p-2 text-right">{formatarMoeda(totalReceitas)}</td>
                </tr>
                <tr>
                    <td className="p-2">Total de Despesas</td>
                    <td className="p-2 text-right">{formatarMoeda(totalDespesas)}</td>
                </tr>
                <tr>
                    <td className="p-2 font-bold">Saldo</td>
                    <td className="p-2 text-right font-bold">{formatarMoeda(saldo)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}