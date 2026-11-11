
import { useEffect, useState } from "react";
import "../styles/paginasInternas.css";

function MeusEventos() {
    const [eventos, setEventos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Guarda o ID do evento que está sendo editado
    const [eventoEditando, setEventoEditando] = useState(null);

    // Guarda os dados do formulário
    const [formulario, setFormulario] = useState({
        titulo: "",
        descricao: "",
        categoria: "",
        data: "",
        horario: "",
        local: "",
        vagas: ""
    });

    // Busca os eventos do professor
    async function buscarEventos() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await fetch(
                "http://localhost:3000/eventos/professor/meus",
                {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.message || "Não foi possível carregar os eventos."
                );
            }

            setEventos(resultado.data || []);

        } catch (error) {
            console.log(error);
            setErro(error.message);

        } finally {
            setCarregando(false);
        }
    }

    // Carrega os eventos quando a página abre
    useEffect(() => {
        buscarEventos();
    }, []);

    // Atualiza os campos do formulário
    function aoMudarCampo(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    // Abre o formulário preenchido com os dados do evento
    function editarEvento(evento) {
        setEventoEditando(evento.id);

        setFormulario({
            titulo: evento.titulo || "",
            descricao: evento.descricao || "",
            categoria: evento.categoria || "",
            data: evento.data || "",
            horario: evento.horario || "",
            local: evento.local || "",
            vagas: evento.vagas || ""
        });
    }

    // Cancela a edição
    function cancelarEdicao() {
        setEventoEditando(null);

        setFormulario({
            titulo: "",
            descricao: "",
            categoria: "",
            data: "",
            horario: "",
            local: "",
            vagas: ""
        });
    }

    // Envia as alterações para o backend
    async function salvarEdicao(evento) {
        evento.preventDefault();

        try {
            const resposta = await fetch(
                `http://localhost:3000/eventos/${eventoEditando}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        ...formulario,
                        vagas: Number(formulario.vagas)
                    })
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.message || "Não foi possível atualizar o evento.");
                return;
            }

            alert("Evento atualizado com sucesso!");

            cancelarEdicao();
            await buscarEventos();

        } catch (error) {
            console.log(error);
            alert("Erro ao conectar com o servidor.");
        }
    }

    // Exclui um evento
    async function excluirEvento(id) {
        const confirmar = window.confirm(
            "Tem certeza de que deseja excluir este evento?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const resposta = await fetch(
                `http://localhost:3000/eventos/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.message || "Não foi possível excluir o evento.");
                return;
            }

            alert("Evento excluído com sucesso!");

            if (eventoEditando === id) {
                cancelarEdicao();
            }

            await buscarEventos();

        } catch (error) {
            console.log(error);
            alert("Erro ao conectar com o servidor.");
        }
    }

    return (
        <section className="meus-eventos">

            <header className="boas-vindas">
                <h1>Meus eventos</h1>
                <p>Visualize e gerencie os eventos que você cadastrou.</p>
            </header>

            {carregando && (
                <p className="sem-eventos">Carregando seus eventos...</p>
            )}

            {!carregando && erro && (
                <p className="sem-eventos">{erro}</p>
            )}

            {!carregando && !erro && eventos.length === 0 && (
                <p className="sem-eventos">
                    Você ainda não cadastrou nenhum evento.
                </p>
            )}

            {!carregando && !erro && eventos.length > 0 && (
                <div className="lista-meus-eventos">

                    {eventos.map((evento) => (
                        <article className="meu-evento-card" key={evento.id}>

                            {eventoEditando === evento.id ? (

                                // Formulário de edição
                                <form onSubmit={salvarEdicao}>

                                    <h2>Editar evento</h2>

                                    <div className="formulario-editar-evento">

                                        <div>
                                            <label>Título</label>
                                            <input
                                                type="text"
                                                name="titulo"
                                                value={formulario.titulo}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Descrição</label>
                                            <textarea
                                                name="descricao"
                                                value={formulario.descricao}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Categoria</label>
                                            <input
                                                type="text"
                                                name="categoria"
                                                value={formulario.categoria}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Data</label>
                                            <input
                                                type="date"
                                                name="data"
                                                value={formulario.data}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Horário</label>
                                            <input
                                                type="time"
                                                name="horario"
                                                value={formulario.horario}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Local</label>
                                            <input
                                                type="text"
                                                name="local"
                                                value={formulario.local}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label>Quantidade de vagas</label>
                                            <input
                                                type="number"
                                                name="vagas"
                                                min="1"
                                                value={formulario.vagas}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                    </div>

                                    <div className="acoes-editar-evento">
                                        <button
                                            type="submit"
                                            className="btn-salvar-evento"
                                        >
                                            Salvar alterações
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-cancelar-edicao"
                                            onClick={cancelarEdicao}
                                        >
                                            Cancelar
                                        </button>
                                    </div>

                                </form>

                            ) : (

                                // Visualização do evento
                                <>
                                    <span className="event-categoria">
                                        {evento.categoria}
                                    </span>

                                    <h2>{evento.titulo}</h2>

                                    <p className="meu-evento-descricao">
                                        {evento.descricao}
                                    </p>

                                    <div className="meu-evento-informacoes">
                                        <p><strong>Data:</strong> {evento.data}</p>
                                        <p><strong>Horário:</strong> {evento.horario}</p>
                                        <p><strong>Local:</strong> {evento.local}</p>
                                        <p><strong>Vagas:</strong> {evento.vagas}</p>
                                    </div>

                                    <div className="acoes-meu-evento">

                                        <button
                                            type="button"
                                            className="btn-editar-evento"
                                            onClick={() => editarEvento(evento)}
                                        >
                                            Editar evento
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-excluir-evento"
                                            onClick={() => excluirEvento(evento.id)}
                                        >
                                            Excluir evento
                                        </button>

                                    </div>
                                </>
                            )}

                        </article>
                    ))}

                </div>
            )}

        </section>
    );
}

export default MeusEventos;
