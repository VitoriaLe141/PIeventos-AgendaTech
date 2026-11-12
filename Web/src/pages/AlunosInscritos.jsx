
/* ==========================================
   PÁGINA: Alunos inscritos

   Mostra os alunos que se inscreveram nos eventos
   cadastrados pelo professor que está conectado.
   ========================================== */

import { useEffect, useState } from "react";

// Importação dos estilos compartilhados
import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

function AlunosInscritos() {

    // Guarda a lista de alunos inscritos recebida do servidor
    const [inscricoes, setInscricoes] = useState([]);

    // Guarda a categoria escolhida no filtro
    const [eventoSelecionado, setEventoSelecionado] = useState("todos");

    // Guarda o texto digitado no campo de pesquisa
    const [busca, setBusca] = useState("");

    // Controla o carregamento da página e as mensagens de erro
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // ==========================================
    // BUSCAR ALUNOS INSCRITOS
    // ==========================================

    // Consulta os alunos inscritos nos eventos do professor conectado
    async function buscarInscricoes() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await fetch(
                "http://localhost:3000/inscricoes/professor/meus",
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            const resultado = await resposta.json();

            // Verifica se a consulta foi realizada corretamente
            if (!resposta.ok) {
                throw new Error(
                    resultado.message || "Não foi possível carregar os inscritos."
                );
            }

            // Guarda as inscrições retornadas pelo banco
            setInscricoes(resultado.data || []);

        } catch (error) {
            console.log("Erro ao buscar alunos inscritos:", error);
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    // ==========================================
    // CARREGAR A PÁGINA
    // ==========================================

    // Busca as inscrições assim que a página é aberta
    useEffect(() => {
        let ativo = true;

        async function carregarDados() {
            try {
                const resposta = await fetch(
                    "http://localhost:3000/inscricoes/professor/meus",
                    {
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        }
                    }
                );

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(
                        resultado.message || "Não foi possível carregar os inscritos."
                    );
                }

                if (ativo) {
                    setInscricoes(resultado.data || []);
                    setErro("");
                }

            } catch (error) {
                if (ativo) {
                    console.log("Erro ao buscar alunos inscritos:", error);
                    setErro(error.message);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        // Evita atualizar a página caso o componente seja desmontado
        return () => {
            ativo = false;
        };
    }, []);

    // ==========================================
    // ATUALIZAR INSCRIÇÕES
    // ==========================================

    // Consulta novamente os dados quando o professor clicar em atualizar
    function atualizarInscricoes() {
        buscarInscricoes();
    }

    // ==========================================
    // ORGANIZAR OS EVENTOS DO RESUMO
    // ==========================================

    // Conta os eventos diferentes que possuem inscritos
    const eventos = inscricoes.filter((inscricao, indice, lista) =>
        lista.findIndex((item) =>
            item.eventoId === inscricao.eventoId
        ) === indice
    );

    // ==========================================
    // PESQUISAR E FILTRAR ALUNOS
    // ==========================================

    // Filtra as inscrições pela categoria e pelo texto pesquisado
    const inscricoesFiltradas = inscricoes.filter((inscricao) => {

        const categoria = (
            inscricao.categoriaEvento ||
            inscricao.categoria ||
            ""
        ).trim().toLowerCase();

        // Verifica se a categoria corresponde à opção selecionada
        const combinaComCategoria =
            eventoSelecionado === "todos" ||
            categoria === eventoSelecionado;

        const textoBusca = busca.toLowerCase();

        // Pesquisa pelo nome do aluno, RA ou título do evento
        const combinaComBusca =
            (inscricao.nomeAluno || "").toLowerCase().includes(textoBusca) ||
            (inscricao.raAluno || "").toLowerCase().includes(textoBusca) ||
            (inscricao.tituloEvento || "").toLowerCase().includes(textoBusca);

        return combinaComCategoria && combinaComBusca;
    });

    // ==========================================
    // FORMATAR DATA
    // ==========================================

    // Converte a data recebida do banco para o formato brasileiro
    function formatarData(data) {
        if (!data) {
            return "Não informada";
        }

        const somenteData = String(data).slice(0, 10);
        const dataFormatada = new Date(`${somenteData}T00:00:00`);

        if (Number.isNaN(dataFormatada.getTime())) {
            return data;
        }

        return dataFormatada.toLocaleDateString("pt-BR");
    }

    // ==========================================
    // MOSTRAR A PÁGINA
    // ==========================================

    return (
        <section className="pagina-alunos-inscritos">

            {/* Título e explicação da página */}
            <header className="boas-vindas">
                <h1>Alunos inscritos</h1>
                <p>Acompanhe quem se inscreveu nos seus eventos.</p>
            </header>

            {/* Mostra os totais de inscrições e eventos com participantes */}
            <div className="inscritos-resumo">

                <article className="inscritos-resumo-card">
                    <span>Total de inscrições</span>
                    <strong>{inscricoes.length}</strong>
                </article>

                <article className="inscritos-resumo-card">
                    <span>Eventos com inscritos</span>
                    <strong>{eventos.length}</strong>
                </article>

            </div>

            {/* Campos para pesquisar alunos e escolher uma categoria */}
            <section className="inscritos-filtros">

                <div>
                    <label htmlFor="busca-inscritos">
                        Pesquisar aluno ou evento
                    </label>

                    <input
                        id="busca-inscritos"
                        type="search"
                        placeholder="Digite um nome, RA ou evento..."
                        value={busca}
                        onChange={(evento) => setBusca(evento.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="filtro-evento-inscritos">
                        Filtrar por categoria
                    </label>

                    <select
                        id="filtro-evento-inscritos"
                        value={eventoSelecionado}
                        onChange={(evento) => setEventoSelecionado(evento.target.value)}
                    >
                        <option value="todos">Todas as categorias</option>
                        <option value="workshop">Workshop</option>
                        <option value="palestra">Palestra</option>
                        <option value="feira">Feira</option>
                    </select>
                </div>

                {/* Atualiza os dados consultando novamente a API */}
                <button
                    type="button"
                    className="btn-principal inscritos-atualizar"
                    onClick={atualizarInscricoes}
                    disabled={carregando}
                >
                    {carregando ? "Carregando..." : "Atualizar"}
                </button>

            </section>

            {/* Informa quando os dados ainda estão sendo carregados */}
            {carregando && (
                <p className="sem-eventos">
                    Carregando alunos inscritos...
                </p>
            )}

            {/* Mostra o erro e permite tentar a consulta novamente */}
            {!carregando && erro && (
                <div className="estado-vazio">
                    <p>{erro}</p>

                    <button
                        type="button"
                        className="btn-principal btn-auto"
                        onClick={atualizarInscricoes}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Mostra um aviso se nenhum aluno se inscreveu ainda */}
            {!carregando && !erro && inscricoes.length === 0 && (
                <div className="estado-vazio">
                    <p>Ainda não há alunos inscritos nos seus eventos.</p>
                </div>
            )}

            {/* Avisa quando a pesquisa não encontra resultados */}
            {!carregando &&
                !erro &&
                inscricoes.length > 0 &&
                inscricoesFiltradas.length === 0 && (
                    <div className="estado-vazio">
                        <p>Nenhum aluno encontrado com esses filtros.</p>
                    </div>
                )}

            {/* Tabela com os dados dos alunos encontrados */}
            {!carregando && !erro && inscricoesFiltradas.length > 0 && (
                <div className="inscritos-tabela-area">

                    <table className="inscritos-tabela">

                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>RA / Login</th>
                                <th>Evento</th>
                                <th>Data da inscrição</th>
                            </tr>
                        </thead>

                        <tbody>
                            {inscricoesFiltradas.map((inscricao) => (
                                <tr key={inscricao.inscricaoId}>
                                    <td>{inscricao.nomeAluno}</td>
                                    <td>{inscricao.raAluno}</td>
                                    <td>{inscricao.tituloEvento}</td>
                                    <td>{formatarData(inscricao.dataInscricao)}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

        </section>
    );
}

// Exporta a página para ser usada no App.jsx
export default AlunosInscritos;
