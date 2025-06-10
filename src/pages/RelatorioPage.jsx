import { motion } from "framer-motion";
// frontend/src/pages/RelatorioPage.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const monthNames = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

// Formata valor como moeda (R$)
function fmtMoeda(v) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export default function RelatorioPage() {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [dados, setDados] = useState(null);

  useEffect(() => {
    buscarRelatorio();
  }, [ano]);

  async function buscarRelatorio() {
    try {
      const res = await api.get(`/relatorio/${ano}`);
      setDados(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar relatório");
    }
  }

  if (!dados) {
    return (
        <motion.div className="p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Carregando relatório...
        </motion.div>
    );
  }

  // Somar valores mensais para RECEITAS ou DESPESAS (por mês)
  function somarPorMes(lista) {
    const totals = Array(12).fill(0);
    lista.forEach((item) => {
      item.valoresMensais.forEach((val, idx) => {
        totals[idx] += Number(val);
      });
    });
    return totals;
  }

  const totalMesReceitas = somarPorMes(dados.receitas);
  const totalMesDespesas = somarPorMes(dados.despesas);
  const totalAnualReceitas = totalMesReceitas.reduce((a, b) => a + b, 0);
  const totalAnualDespesas = totalMesDespesas.reduce((a, b) => a + b, 0);

  // Saldo e depósito por mês
  const saldoMensal = totalMesReceitas.map((rec, i) => rec - totalMesDespesas[i]);
  const depositoMensal = saldoMensal.map((s) => (s > 0 ? s / 2 : s));

  const saldoAnual = totalAnualReceitas - totalAnualDespesas;
  const depositoAnual = saldoAnual > 0 ? saldoAnual / 2 : saldoAnual;

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-4 space-y-4">
        <h2 className="text-2xl font-bold">Relatório Anual - {ano}</h2>

        <div className="flex gap-2 items-center mb-4">
          <label htmlFor="ano">Ano:</label>
          <input
              id="ano"
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              className="border p-1 rounded w-24"
          />
        </div>

        <div className="overflow-x-auto flex flex-col gap-2">
          {/* Tabela 1: Itens de RECEITAS e DESPESAS */}
          <table className="border-collapse table-fixed w-full">
            <colgroup>
              <col style={{ width: "180px" }} />
              {Array.from({ length: 12 }, (_, i) => (
                  <col key={i} style={{ width: "100px" }} />
              ))}
              <col style={{ width: "100px" }} />
            </colgroup>
            <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border border-gray-300 text-left">Item</th>
              {monthNames.map((m) => (
                  <th key={m} className="p-2 border border-gray-300 text-center">
                    {m}
                  </th>
              ))}
              <th className="p-2 border border-gray-300 text-center">Total</th>
            </tr>
            </thead>
            <tbody>
            {/* TÍTULO: RECEITAS */}
            <tr>
              <td colSpan={14} className="p-2 border border-gray-300 bg-blue-100 font-bold">
                RECEITAS
              </td>
            </tr>
            {dados.receitas.map((item, i) => {
              const somaItem = item.valoresMensais.reduce((acc, val) => acc + Number(val), 0);
              return (
                  <tr key={i}>
                    <td className="p-2 border border-gray-300 font-semibold">
                      {item.nomeItem}
                    </td>
                    {item.valoresMensais.map((valor, mesIdx) => (
                        <td key={mesIdx} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                          {fmtMoeda(valor)}
                        </td>
                    ))}
                    <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-semibold">
                      {fmtMoeda(somaItem)}
                    </td>
                  </tr>
              );
            })}
            {/* Só exibe "TOTAL RECEITAS" se houver algum item de receita */}
            {dados.receitas.length > 0 && (
                <tr className="bg-gray-50">
                  <td className="p-2 border border-gray-300 font-bold">TOTAL RECEITAS</td>
                  {totalMesReceitas.map((val, idx) => (
                      <td key={idx} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                        {fmtMoeda(val)}
                      </td>
                  ))}
                  <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-bold">
                    {fmtMoeda(totalAnualReceitas)}
                  </td>
                </tr>
            )}

            {/* TÍTULO: DESPESAS */}
            <tr>
              <td colSpan={14} className="p-2 border border-gray-300 bg-red-100 font-bold">
                DESPESAS
              </td>
            </tr>
            {dados.despesas.map((item, i) => {
              const somaItem = item.valoresMensais.reduce((acc, val) => acc + Number(val), 0);
              return (
                  <tr key={i}>
                    <td className="p-2 border border-gray-300 font-semibold">
                      {item.nomeItem}
                    </td>
                    {item.valoresMensais.map((valor, mesIdx) => (
                        <td key={mesIdx} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                          {fmtMoeda(valor)}
                        </td>
                    ))}
                    <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-semibold">
                      {fmtMoeda(somaItem)}
                    </td>
                  </tr>
              );
            })}
            {/* Só exibe "TOTAL DESPESAS" se houver algum item de despesa */}
            {dados.despesas.length > 0 && (
                <tr className="bg-gray-50">
                  <td className="p-2 border border-gray-300 font-bold">TOTAL DESPESAS</td>
                  {totalMesDespesas.map((val, idx) => (
                      <td key={idx} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                        {fmtMoeda(val)}
                      </td>
                  ))}
                  <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-bold">
                    {fmtMoeda(totalAnualDespesas)}
                  </td>
                </tr>
            )}
            </tbody>
          </table>

          {/* Tabela 2: SALDO e DEPÓSITO (sem thead) */}
          <table className="border-collapse table-fixed w-full">
            <colgroup>
              <col style={{ width: "180px" }} />
              {Array.from({ length: 12 }, (_, i) => (
                  <col key={i} style={{ width: "100px" }} />
              ))}
              <col style={{ width: "100px" }} />
            </colgroup>
            <tbody>
            {/* SALDO */}
            <tr>
              <td className="p-2 border border-gray-300 font-bold">SALDO</td>
              {totalMesReceitas.map((val, i) => {
                const saldo = val - totalMesDespesas[i];
                return (
                    <td key={i} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                      {fmtMoeda(saldo)}
                    </td>
                );
              })}
              <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-bold">
                {fmtMoeda(totalAnualReceitas - totalAnualDespesas)}
              </td>
            </tr>
            {/* DEPÓSITO PARA USO */}
            <tr>
              <td className="p-2 border border-gray-300 font-bold">DEPÓSITO PARA USO</td>
              {totalMesReceitas.map((val, i) => {
                const saldo = val - totalMesDespesas[i];
                const deposito = saldo > 0 ? saldo / 2 : saldo;
                return (
                    <td key={i} className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap ">
                      {fmtMoeda(deposito)}
                    </td>
                );
              })}
              <td className="p-2 border border-gray-300 text-right whitespace-nowrap min-w-[110px] px-3 py-1 text-sm  min-w-[90px] px-2 py-1 text-sm  whitespace-nowrap  font-bold">
                {(() => {
                  const s = totalAnualReceitas - totalAnualDespesas;
                  return fmtMoeda(s > 0 ? s / 2 : s);
                })()}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
  );
}