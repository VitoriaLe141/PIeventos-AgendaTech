
/* ==========================================
   PÁGINA INICIAL DO AGENDATECH

   Exibe os eventos cadastrados no banco de dados.
   Também controla a busca, os filtros e a ordenação.
   ========================================== */

import { useState, useEffect } from "react";

// Importação dos estilos
import "../styles/paginaInicial.css";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";

// Converte a data para um formato que o JavaScript consegue ordenar
function converterData(data) {
    if (!data) {
        return null;
    }

    // Remove possíveis informações de horário
    const dataLimpa = String(data).split("T")[0];

    // Verifica se a data está no formato brasileiro: DD/MM/AAAA
    if (dataLimpa.includes("/")) {
        const partes = dataLimpa.split("/");

        if (partes.length === 3) {
            const dia = Number(partes[0]);
            const mes = Number(partes[1]);
            const ano = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }
    }

    // Verifica se a data está no formato do banco: AAAA-MM-DD
    if (dataLimpa.includes("-")) {
        const partes = dataLimpa.split("-");

        if (partes.length === 3) {
            const ano = Number(partes[0]);
            const mes = Number(partes[1]);
            const dia = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }
    }

    return null;
}

// Monta a página inicial com a lista de eventos
function PaginaInicial({
    usuario,
    favoritos,
    inscricoes,
    aoFavoritar,
    aoInscrever,
    aoNavegar,
    aoSair,
}) {

    // Guarda os eventos recebidos do banco
    const [eventos, setEventos] = useState([]);

    // Controla os campos de pesquisa e filtros
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [ordem, setOrdem] = useState("data");

    // Controla o carregamento e possíveis erros
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    // Busca os eventos no banco de dados
    useEffect(() => {

        async function buscarEventos() {
            try {
                const resposta = await fetch(
                    "http://localhost:3000/eventos"
                );

                if (!resposta.ok) {
                    throw new Error("Não foi possível buscar os eventos.");
                }

                const resultado = await resposta.json();

                // Guarda os eventos recebidos da API
                setEventos(resultado.data || []);
                setErro(false);

            } catch (error) {
                console.log("Erro ao buscar eventos:", error);
                setErro(true);

            } finally {
                setCarregando(false);
            }
        }

        buscarEventos();

    }, []);

    // Atualiza o texto da busca
    function aoMudarBusca(evento) {
        setBusca(evento.target.value);
    }

    // Atualiza a categoria escolhida no filtro
    function aoMudarCategoria(evento) {
        setCategoria(evento.target.value);
    }

    // Atualiza a forma de ordenação dos eventos
    function aoMudarOrdem(evento) {
        setOrdem(evento.target.value);
    }

    // Identifica as categorias existentes nos eventos cadastrados
    const categorias = [
        ...new Set(
            eventos
                .map((evento) => String(evento.categoria || "").trim())
                .filter((item) => item !== "")
        )
    ].sort((a, b) => a.localeCompare(b));

    // Filtra os eventos de acordo com a busca e a categoria
    const eventosFiltrados = eventos.filter((evento) => {

        const titulo = String(evento.titulo || "").toLowerCase();
        const textoBusca = busca.trim().toLowerCase();

        const combinaComBusca = titulo.includes(textoBusca);

        const categoriaEvento = String(evento.categoria || "")
            .trim()
            .toLowerCase();

        const categoriaSelecionada = categoria.trim().toLowerCase();

        const combinaComCategoria =
            categoria === "Todas" ||
            categoriaEvento === categoriaSelecionada;

        return combinaComBusca && combinaComCategoria;
    });

    // Ordena os eventos
    const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {

        // Ordem alfabética
        if (ordem === "nome") {
            return String(a.titulo || "").localeCompare(
                String(b.titulo || "")
            );
        }

        // Maior quantidade de vagas primeiro
        if (ordem === "vagas") {
            return Number(b.vagas || 0) - Number(a.vagas || 0);
        }

        // Eventos pela data mais próxima
        const dataA = converterData(a.data);
        const dataB = converterData(b.data);

        if (!dataA && !dataB) return 0;
        if (!dataA) return 1;
        if (!dataB) return -1;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const valorA = dataA < hoje ? Infinity : dataA.getTime();
        const valorB = dataB < hoje ? Infinity : dataB.getTime();

        return valorA - valorB;
    });

    return (
        <div className="pagina-inicial">

            {/* Menu lateral */}
            <Sidebar
                paginaAtual="inicio"
                usuario={usuario}
                aoNavegar={aoNavegar}
                aoSair={aoSair}
            />

            {/* Conteúdo principal */}
            <main className="conteudo">

                <Header nome={usuario?.name || "Usuário"} />

                {/* Busca, categoria e ordenação */}
                <EventFilters
                    busca={busca}
                    aoMudarBusca={aoMudarBusca}
                    categoria={categoria}
                    aoMudarCategoria={aoMudarCategoria}
                    categorias={categorias}
                    ordem={ordem}
                    aoMudarOrdem={aoMudarOrdem}
                />

                {/* Carregamento */}
                {carregando && (
                    <p>Carregando eventos...</p>
                )}

                {/* Erro */}
                {erro && (
                    <p className="sem-eventos">
                        Não foi possível carregar os eventos.
                    </p>
                )}

                {/* Lista de eventos */}
                {!carregando && !erro && (
                    <section className="lista-eventos">

                        {eventosOrdenados.map((evento) => {

                            // Verifica se o aluno está inscrito no evento
                            const inscrito = inscricoes.some(
                                (id) => Number(id) === Number(evento.id)
                            );

                            // Atualiza as vagas exibidas quando o aluno se inscreve
                            const vagasDisponiveis = Math.max(
                                0,
                                Number(evento.vagas || 0) - (inscrito ? 1 : 0)
                            );

                            return (
                                <EventCard
                                    key={evento.id}
                                    titulo={evento.titulo}
                                    categoria={evento.categoria}
                                    data={evento.data}
                                    horario={evento.horario}
                                    local={evento.local}
                                    vagas={vagasDisponiveis}
                                    descricao={evento.descricao}
                                    favorito={favoritos.some(
                                        (id) => Number(id) === Number(evento.id)
                                    )}
                                    inscrito={inscrito}
                                    aoFavoritar={() => aoFavoritar(Number(evento.id))}
                                    aoInscrever={() => aoInscrever(Number(evento.id))}
                                />
                            );
                        })}

                    </section>
                )}

                {/* Nenhum evento encontrado */}
                {!carregando && !erro && eventosOrdenados.length === 0 && (
                    <p className="sem-eventos">
                        Nenhum evento encontrado.
                    </p>
                )}

            </main>
        </div>
    );
}

// Exporta a página inicial
export default PaginaInicial;
