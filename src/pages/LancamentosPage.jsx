import { motion } from "framer-motion";
// frontend/src/pages/LancamentosPage.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import MonthYearPicker from "../components/ui/utils/MonthYearPicker";
import TabelaLancamentos from "../components/ui/tables/TabelaLancamentos";
import LancarItensModal from "../components/ui/modals/LancarItensModal";
import EditarLancamentoModal from "../components/ui/modals/EditarLancamentoModal";
import ResumoLancamentos from "../components/ui/tables/ResumoLancamentos";
import ConfirmDeleteLancamentoModal from "../components/ui/modals/ConfirmDeleteLancamentoModal";
import LaunchReceitasButton from "../components/ui/buttons/LaunchReceitasButton";
import LaunchDespesasButton from "../components/ui/buttons/LaunchDespesasButton";

function getNomeMes(index) {
    const nomes = [
        "Janeiro", "Fevereiro", "Março",
        "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro",
        "Outubro", "Novembro", "Dezembro"
    ];
    return nomes[index] || "Mês Inválido";
}

export default function LancamentosPage() {
    const [dataReferencia, setDataReferencia] = useState(() => new Date());
    const [lancamentos, setLancamentos] = useState([]);

    const [modalLancamentoTipo, setModalLancamentoTipo] = useState(null); // "RECEITA" ou "DESPESA" ou null
    const [modalEditarOpen, setModalEditarOpen] = useState(false);
    const [lancamentoSelecionado, setLancamentoSelecionado] = useState(null);
    const [modalExcluirOpen, setModalExcluirOpen] = useState(false);
    const [lancamentoParaExcluir, setLancamentoParaExcluir] = useState(null);

    // Itens que serão passados para o modal (só os não lançados)
    const [itensParaModal, setItensParaModal] = useState([]);

    const mes = dataReferencia.getMonth() + 1;
    const ano = dataReferencia.getFullYear();

    useEffect(() => {
        carregarLancamentos();
    }, [mes, ano]);

    const carregarLancamentos = async () => {
        try {
            const res = await api.get("/valores");
            const filtrados = res.data.filter((v) => v.mes === mes && v.ano === ano);
            setLancamentos(filtrados);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar lançamentos");
        }
    };

    /**
     * Verifica se há itens do tipo selecionado que ainda não foram lançados neste período (mes/ano).
     * Retorna um array de itens não lançados ou null caso não haja itens do tipo.
     */
    const buscarItensNaoLancados = async (tipo) => {
        // 1. busca todos os itens do tipo
        const resItens = await api.get("/itens");
        const itensDoTipo = resItens.data.filter((i) => i.tipo === tipo);

        if (itensDoTipo.length === 0) {
            // não há itens deste tipo cadastrado
            toast.warn(`Não há itens do tipo ${tipo} cadastrados.`);
            return null;
        }

        // 2. busca lançamentos do período e do tipo
        const resValores = await api.get("/valores");
        const lancamentosDoPeriodo = resValores.data.filter(
            (l) => l.mes === mes && l.ano === ano && l.item.tipo === tipo
        );

        // 3. obtém os IDs dos itens que já foram lançados
        const lancadosIDs = lancamentosDoPeriodo.map((l) => l.item.id);

        // 4. filtra para só manter os itens do tipo que não foram lançados
        const naoLancados = itensDoTipo.filter(
            (item) => !lancadosIDs.includes(item.id)
        );

        if (naoLancados.length === 0) {
            // todos os itens do tipo já foram lançados
            toast.warn(`Todos os itens do tipo ${tipo} já foram lançados neste período.`);
            return null;
        }

        // ordenar por nome
        naoLancados.sort((a, b) => a.nome.localeCompare(b.nome));
        return naoLancados;
    };

    const handleLancarReceitas = async () => {
        const itensNaoLancados = await buscarItensNaoLancados("RECEITA");
        if (itensNaoLancados) {
            // temos itens não lançados => abre modal
            setItensParaModal(itensNaoLancados);
            setModalLancamentoTipo("RECEITA");
        }
        // se for null => não abre modal, toast já exibido
    };

    const handleLancarDespesas = async () => {
        const itensNaoLancados = await buscarItensNaoLancados("DESPESA");
        if (itensNaoLancados) {
            setItensParaModal(itensNaoLancados);
            setModalLancamentoTipo("DESPESA");
        }
    };

    const onLancamentoSalvo = () => {
        setModalLancamentoTipo(null);
        carregarLancamentos();
    };

    const abrirModalEdicao = (lancamento) => {
        setLancamentoSelecionado(lancamento);
        setModalEditarOpen(true);
    };

    const salvarEdicao = async () => {
        setModalEditarOpen(false);
        carregarLancamentos();
    };

    // Abre modal de exclusão, recebendo o lançamento a ser excluído
    const handleExcluirLancamento = (lancamento) => {
        setLancamentoParaExcluir(lancamento);
        setModalExcluirOpen(true);
    };

    // Executa a exclusão do lançamento
    const confirmarExclusao = async () => {
        try {
            await api.delete(`/valores/${lancamentoParaExcluir.id}`);
            toast.success("Lançamento excluído com sucesso!");
            setModalExcluirOpen(false);
            carregarLancamentos();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir lançamento");
        }
    };

    const lancamentosReceita = lancamentos.filter(
        (l) => l.item.tipo === "RECEITA" && parseFloat(l.valor) > 0
    );
    const lancamentosDespesa = lancamentos.filter(
        (l) => l.item.tipo === "DESPESA" && parseFloat(l.valor) > 0
    );

    const totalReceitas = lancamentosReceita.reduce(
        (acc, l) => acc + parseFloat(l.valor),
        0
    );
    const totalDespesas = lancamentosDespesa.reduce(
        (acc, l) => acc + parseFloat(l.valor),
        0
    );

    const nomeMes = getNomeMes(dataReferencia.getMonth());
    const mesAnoFormatado = `${nomeMes}/${ano}`;

    return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="p-4 space-y-6">
            <h2 className="text-2xl font-bold">Lançamentos Mensais</h2>

            <MonthYearPicker date={dataReferencia} onChange={setDataReferencia} />

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex gap-1 mt-2">
            <LaunchReceitasButton onClick={handleLancarReceitas}>
                Lançar Receitas
            </LaunchReceitasButton>
            <LaunchDespesasButton onClick={handleLancarDespesas}>
                Lançar Despesas
            </LaunchDespesasButton>
        </motion.div>

            <h3 className="text-lg font-semibold mt-2">{mesAnoFormatado}</h3>

            <TabelaLancamentos
                titulo="Receitas Lançadas"
                dados={lancamentosReceita}
                onEditar={abrirModalEdicao}
                onExcluir={handleExcluirLancamento}
            />
            <TabelaLancamentos
                titulo="Despesas Lançadas"
                dados={lancamentosDespesa}
                onEditar={abrirModalEdicao}
                onExcluir={handleExcluirLancamento}
            />

            <div className="max-w-sm">
                <ResumoLancamentos
                    totalReceitas={totalReceitas}
                    totalDespesas={totalDespesas}
                />
            </div>

            {/* Modal para lançar itens */}
            {modalLancamentoTipo && (
                <LancarItensModal
                    open={true}
                    onClose={() => setModalLancamentoTipo(null)}
                    tipo={modalLancamentoTipo}
                    mes={mes}
                    ano={ano}
                    onSalvou={onLancamentoSalvo}
                    itensNaoLancados={itensParaModal} // Passamos a lista diretamente
                />
            )}

            {/* Modal para editar lançamento */}
            {modalEditarOpen && lancamentoSelecionado && (
                <EditarLancamentoModal
                    open={modalEditarOpen}
                    onClose={() => setModalEditarOpen(false)}
                    valorAtual={lancamentoSelecionado.valor}
                    onSave={salvarEdicao}
                    lancamentoId={lancamentoSelecionado.id}
                    mes={mes}
                    ano={ano}
                    itemId={lancamentoSelecionado.item.id}
                />
            )}

            {/* Modal para confirmar exclusão de lançamento */}
            {modalExcluirOpen && lancamentoParaExcluir && (
                <ConfirmDeleteLancamentoModal
                    open={modalExcluirOpen}
                    onClose={() => setModalExcluirOpen(false)}
                    onConfirm={confirmarExclusao}
                    nomeItem={lancamentoParaExcluir.item.nome}
                />
            )}
        </motion.div>
    );
}