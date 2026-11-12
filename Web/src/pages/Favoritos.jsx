/* ==========================================
   PÁGINA: Favoritos
   Mostra os eventos marcados pelo aluno.
   ========================================== */

import { useEffect, useState } from "react";

import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";

function Favoritos({
    usuario,
    favoritos,
    inscricoes,
    aoFavoritar,
    aoInscrever,
    aoNavegar,
    aoSair,
}) {

    // Guarda todos os eventos recebidos do servidor
    const [eventos, setEventos] = useState([]);

    // Busca os eventos cadastrados no sistema
    useEffect(() => {

        async function buscarEventos() {
            try {
                const resposta = await fetch(
                    "http://localhost:3000/eventos",
                    {
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        }
                    }
                );

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    throw new Error("Não foi possível carregar os eventos.");
                }

                // Guarda os eventos recebidos do backend
                setEventos(resultado.data || []);

            } catch (error) {
                console.log("Erro ao buscar eventos:", error);
            }
        }

        buscarEventos();

    }, []);

    // Mostra somente os eventos que estão nos favoritos
    const eventosFavoritos = eventos.filter((evento) =>
        favoritos.some((id) => Number(id) === Number(evento.id))
    );

    return (
        <div className="pagina-inicial">

            {/* Menu lateral */}
            <Sidebar
                paginaAtual="favoritos"
                usuario={usuario}
                aoNavegar={aoNavegar}
                aoSair={aoSair}
            />

            <main className="conteudo">

                {/* Cabeçalho da página */}
                <header className="boas-vindas">
                    <h1>Favoritos</h1>
                    <p>Os eventos que você marcou para não perder.</p>
                </header>

                {/* Verifica se existem eventos favoritos */}
                {eventosFavoritos.length > 0 ? (

                    <section className="lista-eventos">
                        {eventosFavoritos.map((evento) => (
                            <EventCard
                                key={evento.id}
                                titulo={evento.titulo}
                                descricao={evento.descricao}
                                categoria={evento.categoria}
                                data={evento.data}
                                horario={evento.horario}
                                local={evento.local}
                                vagas={evento.vagas}
                                favorito={true}
                                inscrito={inscricoes.some(
                                    (id) => Number(id) === Number(evento.id)
                                )}
                                aoFavoritar={() => aoFavoritar(evento.id)}
                                aoInscrever={() => aoInscrever(evento.id)}
                            />
                        ))}
                    </section>

                ) : (

                    // Mensagem exibida quando não existem favoritos
                    <section className="estado-vazio">
                        <div className="estado-vazio-icone">♡</div>

                        <h2>Nenhum favorito por enquanto</h2>

                        <p>
                            Você ainda não marcou nenhum evento como favorito.
                            Explore os eventos e salve os que mais gostar!
                        </p>

                        <button
                            type="button"
                            className="btn-principal"
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

export default Favoritos;
