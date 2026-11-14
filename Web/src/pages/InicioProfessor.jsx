
/* ==========================================
   PÁGINA INICIAL DO PROFESSOR

   Mostra um resumo dos eventos cadastrados
   pelo professor e atalhos para as principais ações.
   ========================================== */

import { useCallback, useEffect, useState } from "react";
import "../styles/inicioProfessor.css";

function InicioProfessor({ usuario, aoNavegar }) {

    // Guarda os eventos cadastrados pelo professor
    const [eventos, setEventos] = useState([]);

    // Guarda as inscrições dos alunos
    const [inscricoes, setInscricoes] = useState([]);

    // Controla o carregamento e possíveis erros
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Busca os eventos e as inscrições do professor
    const buscarEventos = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("token");

            // Busca os eventos cadastrados
            const resposta = await fetch(
                "http://localhost:3000/eventos/professor/meus",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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

            // Busca as inscrições dos alunos nos eventos
            const respostaInscricoes = await fetch(
                "http://localhost:3000/inscricoes/professor/meus",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const resultadoInscricoes = await respostaInscricoes.json();

            if (!respostaInscricoes.ok) {
                throw new Error(
                    resultadoInscricoes.message ||
                    "Não foi possível carregar as inscrições."
                );
            }

            setInscricoes(resultadoInscricoes.data || []);
            setErro("");

        } catch (error) {
            console.log("Erro ao buscar dados do professor:", error);
            setErro(error.message);

        } finally {
            setCarregando(false);
        }
    }, []);

    // Carrega os dados quando a página é aberta
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        buscarEventos();
    }, [buscarEventos]);

    // Permite carregar os dados novamente
    function tentarNovamente() {
        setCarregando(true);
        buscarEventos();
    }

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

    // Conta quantos alunos estão inscritos em determinado evento
    function contarInscritos(idEvento) {
        return inscricoes.filter((inscricao) => {
            return Number(inscricao.eventoId) === Number(idEvento);
        }).length;
    }

    // Calcula as vagas restantes de cada evento
    function calcularVagasRestantes(evento) {
        const vagasTotais = Number(evento.vagas) || 0;
        const totalInscritos = contarInscritos(evento.id);

        return Math.max(0, vagasTotais - totalInscritos);
    }

    // Soma as vagas restantes de todos os eventos
    const totalVagasDisponiveis = eventos.reduce((total, evento) => {
        return total + calcularVagasRestantes(evento);
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
                    <span className="professor-etiqueta">
                        PAINEL DO PROFESSOR
                    </span>

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
                        <strong>
                            {carregando ? "—" : eventos.length}
                        </strong>
                    </div>
                </article>

                <article className="professor-resumo-card">
                    <div className="resumo-icone">◷</div>
                    <div>
                        <span>Próximos eventos</span>
                        <strong>
                            {carregando ? "—" : proximosEventos.length}
                        </strong>
                    </div>
                </article>

                <article className="professor-resumo-card">
                    <div className="resumo-icone">♧</div>
                    <div>
                        <span>Vagas disponíveis</span>
                        <strong>
                            {carregando ? "—" : totalVagasDisponiveis}
                        </strong>
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
                </div>

                {carregando && (
                    <p className="professor-mensagem">
                        Carregando seus eventos...
                    </p>
                )}

                {!carregando && erro && (
                    <div className="professor-mensagem professor-erro">
                        <p>{erro}</p>

                        <button
                            type="button"
                            onClick={tentarNovamente}
                        >
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
                            <article
                                className="professor-evento-linha"
                                key={evento.id}
                            >
                                <div className="professor-evento-data">
                                    <strong>
                                        {formatarData(evento.data)}
                                    </strong>

                                    <span>
                                        {evento.horario || "Horário não informado"}
                                    </span>
                                </div>

                                <div className="professor-evento-detalhes">
                                    <strong>{evento.titulo}</strong>

                                    <span>
                                        {evento.categoria} · {evento.local}
                                    </span>
                                </div>

                                <span className="professor-evento-vagas">
                                    {calcularVagasRestantes(evento)} vagas disponíveis
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
