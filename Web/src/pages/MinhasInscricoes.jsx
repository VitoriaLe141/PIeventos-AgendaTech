
/* ==========================================
   PÁGINA: Minhas inscrições

   Mostra os eventos em que o aluno se inscreveu,
   do mais próximo para o mais distante.
   Aqui também dá para cancelar a inscrição.
   ========================================== */

import { useEffect, useState } from "react";

// Importação dos estilos
import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

// Importação da função que organiza as datas
import { transformarEmData } from "../data/eventos";

// Importação dos componentes
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";

// Mostra os eventos em que o aluno está inscrito.
function MinhasInscricoes({
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

                // Guarda os eventos recebidos do servidor
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

    // Mantém somente os eventos em que o aluno está inscrito
    const eventosInscritos = eventos.filter((evento) =>
        inscricoes.some((id) => Number(id) === Number(evento.id))
    );

    // Ordena os eventos pela data sem alterar a lista original
    const eventosOrdenados = [...eventosInscritos].sort(
        (a, b) => transformarEmData(a.data) - transformarEmData(b.data)
    );

    return (
        <div className="pagina-inicial">

            {/* Menu lateral com Minhas inscrições destacado */}
            <Sidebar
                paginaAtual="inscricoes"
                usuario={usuario}
                aoNavegar={aoNavegar}
                aoSair={aoSair}
            />

            <main className="conteudo">

                {/* Título da página */}
                <header className="boas-vindas">
                    <h1>Minhas inscrições</h1>
                    <p>Acompanhe os eventos em que você vai participar.</p>
                </header>

                {/* Mensagem enquanto os eventos são carregados */}
                {carregando && (
                    <p className="sem-eventos">
                        Carregando suas inscrições...
                    </p>
                )}

                {/* Mensagem caso a API não consiga carregar os eventos */}
                {!carregando && erro && (
                    <p className="sem-eventos">
                        Não foi possível carregar suas inscrições.
                    </p>
                )}

                {/* Mostra a quantidade e os cards das inscrições */}
                {!carregando && !erro && eventosOrdenados.length > 0 && (
                    <>
                        {/* Resumo da quantidade de inscrições */}
                        <p className="resumo-centralizado">
                            Você tem <strong>{eventosOrdenados.length}</strong>{" "}
                            {eventosOrdenados.length === 1
                                ? "inscrição ativa"
                                : "inscrições ativas"}.
                        </p>

                        {/* Lista de eventos inscritos */}
                        <section className="lista-eventos">
                            {eventosOrdenados.map((evento) => {

                                // Calcula as vagas disponíveis considerando as inscrições
                                const vagasDisponiveis = Math.max(
                                    0,
                                    Number(evento.vagas || 0) -
                                    Number(evento.totalInscritos || 1)
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
                                        inscrito={true}
                                        aoFavoritar={() => aoFavoritar(Number(evento.id))}
                                        aoInscrever={() => aoInscrever(Number(evento.id))}
                                    />
                                );
                            })}
                        </section>
                    </>
                )}

                {/* Mostra um aviso quando o aluno ainda não tem inscrições */}
                {!carregando && !erro && eventosOrdenados.length === 0 && (
                    <section className="estado-vazio">
                        <p>Você ainda não se inscreveu em nenhum evento.</p>

                        <button
                            type="button"
                            className="btn-principal btn-auto"
                            onClick={() => aoNavegar("inicio")}
                        >
                            Ver eventos
                        </button>
                    </section>
                )}

            </main>
        </div>
    );
}

// Exporta a página para o App.jsx
export default MinhasInscricoes;
