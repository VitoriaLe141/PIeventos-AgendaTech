
/* ==========================================
   PÁGINA INICIAL DO AGENDATECH

   Exibe os eventos cadastrados no banco de dados.
   Também controla a busca, os filtros e a ordenação.
   ========================================== */

import { useState, useEffect } from "react";

// Importação dos estilos
import "../styles/paginaInicial.css";

// Importação da função que organiza as datas
import { transformarEmData } from "../data/eventos";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EventFilters from "../components/EventFilters";
import EventCard from "../components/EventCard";


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

        async function buscarEventos() {
            try {
                const resposta = await fetch("http://localhost:3000/eventos");

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

    function aoMudarBusca(evento) {
        setBusca(evento.target.value);
    }

    function aoMudarCategoria(evento) {
        setCategoria(evento.target.value);
    }

    function aoMudarOrdem(evento) {
        setOrdem(evento.target.value);
    }


    /* ---------- FILTRAR EVENTOS ---------- */

    const eventosFiltrados = eventos.filter((evento) => {

        const combinaComBusca = evento.titulo
            .toLowerCase()
            .includes(busca.toLowerCase());

        const combinaComCategoria =
            categoria === "Todas" || evento.categoria === categoria;

        return combinaComBusca && combinaComCategoria;
    });


    /* ---------- ORDENAR EVENTOS ---------- */

    const eventosOrdenados = [...eventosFiltrados].sort((a, b) => {

        if (ordem === "nome") {
            return a.titulo.localeCompare(b.titulo);
        }

        if (ordem === "vagas") {
            return b.vagas - a.vagas;
        }

        // Mostra primeiro os eventos com datas mais próximas
        return transformarEmData(a.data) - transformarEmData(b.data);
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
