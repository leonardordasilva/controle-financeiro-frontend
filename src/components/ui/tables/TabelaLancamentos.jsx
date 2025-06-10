// frontend/src/components/ui/TabelaLancamentos.jsx
import React from "react";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";

export default function TabelaLancamentos({ titulo, dados, onEditar, onExcluir }) {
    // Ordenar lançamentos por nome
    const dadosOrdenados = [...dados].sort((a, b) =>
        a.item.nome.localeCompare(b.item.nome)
    );

    return (
        <div className="bg-white shadow rounded p-4 space-y-2">
            <h3 className="text-xl font-semibold">{titulo}</h3>

            {dadosOrdenados.length > 0 ? (
                <table className="min-w-full table-auto text-left border border-muted rounded-md shadowtable-auto w-full border-collapse">
                    <thead className="bg-muted text-gray-700bg-gray-200 text-gray-700">
                    <tr>
                        <th className="p-2 text-left w-1/2">Item</th>
                        <th className="p-2 text-right w-1/4">Valor</th>
                        <th className="p-2 text-center w-1/4">Ações</th>
                        {/* text-center para alinhar o texto do cabeçalho no meio */}
                    </tr>
                    </thead>
                    <tbody>
                    {dadosOrdenados.map((lanc) => (
                        <tr key={lanc.id} className="border-b last:border-0">
                            <td className="p-2 text-gray-800">{lanc.item.nome}</td>
                            <td className="p-2 text-right text-gray-800">
                                {/* Formata em estilo moeda */}
                                {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(lanc.valor)}
                            </td>
                            {/* text-center para alinhar o botão ao centro da célula */}
                            <td className="p-2 text-center">
                                <div className="inline-flex items-center gap-2">
                                    <EditButton onClick={() => onEditar(lanc)}>
                                        Atualizar
                                    </EditButton>
                                    <DeleteButton onClick={() => onExcluir(lanc)}>
                                        Excluir
                                    </DeleteButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-600">Nenhum lançamento encontrado.</p>
            )}
        </div>
    );
}