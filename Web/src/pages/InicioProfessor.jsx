/* ==========================================
   PÁGINA INICIAL DO PROFESSOR

   Mostra um resumo dos eventos cadastrados
   pelo professor e atalhos para as principais ações.
   ========================================== */

import { useEffect, useState } from "react";
import "../styles/inicioProfessor.css";
//
import {API_URL} from "../api/apiconfig";

// Monta o painel inicial com o resumo dos eventos do professor.

function InicioProfessor({ usuario, aoNavegar }) {

    // Guarda os eventos cadastrados pelo professor
    const [eventos, setEventos] = useState([]);

    // Controla o carregamento e possíveis erros
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Busca somente os eventos do professor logado
    async function buscarEventos() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await fetch(
                `${API_URL}/eventos/professor/meus`,
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.message || "Não foi possível carregar seus eventos."
                );
            }

            setEventos(resultado.data || []);

        } catch (error) {
            console.log("Erro ao buscar eventos:", error);
            setErro(error.message);

        } finally {
            setCarregando(false);
        }
    }

    // Carrega os eventos quando a página é aberta
    useEffect(() => {
        buscarEventos();
    }, []);

    // Considera como próximos os eventos de hoje em diante
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const proximosEventos = eventos
        .filter((evento) => {
            const dataEvento = new Date(`${evento.data}T00:00:00`);
            return !isNaN(dataEvento) && dataEvento >= hoje;
        })
        .sort((a, b) => {
            return new Date(`${a.data}T${a.horario || "00:00"}`) -
                new Date(`${b.data}T${b.horario || "00:00"}`);
        });

    // Soma a quantidade de vagas dos eventos cadastrados
    const totalVagas = eventos.reduce((total, evento) => {
        return total + Number(evento.vagas || 0);
    }, 0);

    // Mostra a data em formato brasileiro
    function formatarData(data) {
        if (!data) return "Data não informada";

        const partes = data.split("-");
        if (partes.length !== 3) return data;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return (
        <section className="inicio-professor">

            {/* Boas-vindas */}
            <header className="professor-boas-vindas">
                <div>
                    <span className="professor-etiqueta">PAINEL DO PROFESSOR</span>
                    <h1>Olá, {usuario?.name || "professor"}!</h1>
                    <p>
                        Acompanhe seus eventos e organize as atividades da Fatec.
                    </p>
                </div>

                <button
                    type="button"
                    className="professor-botao-principal"
                    onClick={() => aoNavegar("cadastrar")}
                >
                    + Cadastrar evento
                </button>
            </header>

            {/* Indicadores do professor */}
            <div className="professor-resumo">

                <article className="professor-resumo-card">
                    <div className="resumo-icone">▦</div>
                    <div>
                        <span>Eventos cadastrados</span>
                        <strong>{carregando ? "—" : eventos.length}</strong>
                    </div>
                </article>

                <article className="professor-resumo-card">
                    <div className="resumo-icone">◷</div>
                    <div>
                        <span>Próximos eventos</span>
                        <strong>{carregando ? "—" : proximosEventos.length}</strong>
                    </div>
                </article>

                <article className="professor-resumo-card">
                    <div className="resumo-icone">♧</div>
                    <div>
                        <span>Total de vagas</span>
                        <strong>{carregando ? "—" : totalVagas}</strong>
                    </div>
                </article>

            </div>

            {/* Atalhos */}
            <section className="professor-secao">
                <div className="professor-titulo-secao">
                    <div>
                        <h2>Acesso rápido</h2>
                        <p>Encontre facilmente o que precisa.</p>
                    </div>
                </div>

                <div className="professor-atalhos">

                    <button
                        type="button"
                        className="professor-atalho"
                        onClick={() => aoNavegar("cadastrar")}
                    >
                        <span className="atalho-icone">＋</span>
                        <span>
                            <strong>Cadastrar evento</strong>
                            <small>Adicione uma nova atividade</small>
                        </span>
                        <span className="atalho-seta">›</span>
                    </button>

                    <button
                        type="button"
                        className="professor-atalho"
                        onClick={() => aoNavegar("eventos")}
                    >
                        <span className="atalho-icone">▤</span>
                        <span>
                            <strong>Meus eventos</strong>
                            <small>Edite ou exclua seus eventos</small>
                        </span>
                        <span className="atalho-seta">›</span>
                    </button>

                    <button
                        type="button"
                        className="professor-atalho"
                        onClick={() => aoNavegar("inscritos")}
                    >
                        <span className="atalho-icone">♙</span>
                        <span>
                            <strong>Alunos inscritos</strong>
                            <small>Acompanhe as inscrições</small>
                        </span>
                        <span className="atalho-seta">›</span>
                    </button>

                </div>
            </section>

            {/* Lista dos próximos eventos */}
            <section className="professor-secao professor-proximos">
                <div className="professor-titulo-secao">
                    <div>
                        <h2>Próximos eventos</h2>
                        <p>Confira as atividades que estão por vir.</p>
                    </div>

                    <button
                        type="button"
                        className="professor-link-ver"
                        onClick={() => aoNavegar("eventos")}
                    >
                        Ver todos
                    </button>
                </div>

                {carregando && (
                    <p className="professor-mensagem">Carregando seus eventos...</p>
                )}

                {!carregando && erro && (
                    <div className="professor-mensagem professor-erro">
                        <p>{erro}</p>
                        <button type="button" onClick={buscarEventos}>
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!carregando && !erro && proximosEventos.length === 0 && (
                    <div className="professor-mensagem">
                        <p>Você ainda não tem próximos eventos.</p>
                        <button
                            type="button"
                            onClick={() => aoNavegar("cadastrar")}
                        >
                            Cadastrar meu primeiro evento
                        </button>
                    </div>
                )}

                {!carregando && !erro && proximosEventos.length > 0 && (
                    <div className="professor-lista-proximos">
                        {proximosEventos.slice(0, 4).map((evento) => (
                            <article className="professor-evento-linha" key={evento.id}>
                                <div className="professor-evento-data">
                                    <strong>{formatarData(evento.data)}</strong>
                                    <span>{evento.horario || "Horário não informado"}</span>
                                </div>

                                <div className="professor-evento-detalhes">
                                    <strong>{evento.titulo}</strong>
                                    <span>{evento.categoria} · {evento.local}</span>
                                </div>

                                <span className="professor-evento-vagas">
                                    {evento.vagas} vagas
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>

        </section>
    );
}

export default InicioProfessor;
