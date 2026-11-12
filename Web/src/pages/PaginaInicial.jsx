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

    /* ---------- VARIÁVEIS DE ESTADO ---------- */

    // Guarda os eventos recebidos do banco
    const [eventos, setEventos] = useState([]);

    // Controla os campos de pesquisa e filtros
    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [ordem, setOrdem] = useState("data");

    // Controla o carregamento e possíveis erros
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);


    /* ---------- BUSCAR EVENTOS NO BANCO ---------- */

    useEffect(() => {

        // Consulta na API os eventos que serão mostrados na página
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


    /* ---------- FUNÇÕES DOS CAMPOS ---------- */

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


    /* ---------- CATEGORIAS DISPONÍVEIS ---------- */

    // Identifica as categorias existentes nos eventos cadastrados
    const categorias = [
        ...new Set(
            eventos
                .map((evento) => String(evento.categoria || "").trim())
                .filter((item) => item !== "")
        )
    ].sort((a, b) => a.localeCompare(b));


    /* ---------- FILTRAR EVENTOS ---------- */

    const eventosFiltrados = eventos.filter((evento) => {

        // Compara o título com o texto digitado na busca
        const titulo = String(evento.titulo || "").toLowerCase();
        const textoBusca = busca.trim().toLowerCase();

        const combinaComBusca = titulo.includes(textoBusca);

        // Compara as categorias sem diferenciar maiúsculas e espaços
        const categoriaEvento = String(evento.categoria || "")
            .trim()
            .toLowerCase();

        const categoriaSelecionada = categoria.trim().toLowerCase();

        const combinaComCategoria =
            categoria === "Todas" ||
            categoriaEvento === categoriaSelecionada;

        return combinaComBusca && combinaComCategoria;
    });


    /* ---------- ORDENAR EVENTOS ---------- */

    const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {

        // Ordena os eventos pelo nome, em ordem alfabética
        if (ordem === "nome") {
            return String(a.titulo || "").localeCompare(
                String(b.titulo || "")
            );
        }

        // Ordena pela quantidade de vagas, da maior para a menor
        if (ordem === "vagas") {
            return Number(b.vagas || 0) - Number(a.vagas || 0);
        }

        // Organiza os eventos pela data mais próxima
        const dataA = converterData(a.data);
        const dataB = converterData(b.data);

        // Coloca datas inválidas no final da lista
        if (!dataA && !dataB) return 0;
        if (!dataA) return 1;
        if (!dataB) return -1;

        // Coloca a data de hoje como referência
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Eventos que já passaram ficam depois dos próximos
        const valorA = dataA < hoje ? Infinity : dataA.getTime();
        const valorB = dataB < hoje ? Infinity : dataB.getTime();

        return valorA - valorB;
    });


    /* ---------- O QUE APARECE NA TELA ---------- */

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

                {/* Mensagem durante o carregamento */}
                {carregando && (
                    <p>Carregando eventos...</p>
                )}

                {/* Mensagem caso ocorra algum erro */}
                {erro && (
                    <p className="sem-eventos">
                        Não foi possível carregar os eventos.
                    </p>
                )}

                {/* Lista de eventos */}
                {!carregando && !erro && (
                    <section className="lista-eventos">

                        {eventosOrdenados.map((evento) => (
                            <EventCard
                                key={evento.id}
                                titulo={evento.titulo}
                                categoria={evento.categoria}
                                data={evento.data}
                                horario={evento.horario}
                                local={evento.local}
                                vagas={evento.vagas}
                                descricao={evento.descricao}
                                favorito={favoritos.includes(evento.id)}
                                inscrito={inscricoes.includes(evento.id)}
                                aoFavoritar={() => aoFavoritar(evento.id)}
                                aoInscrever={() => aoInscrever(evento.id)}
                            />
                        ))}

                    </section>
                )}

                {/* Mensagem quando não existem eventos */}
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
