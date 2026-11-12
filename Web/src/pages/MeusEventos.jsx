
/* ==========================================
   PÁGINA: Meus eventos
   Lista os eventos do professor e permite editar
   ou excluir os eventos cadastrados.
   ========================================== */

import { useEffect, useState, useCallback } from "react";
import "../styles/paginasInternas.css";

// Monta a página com os eventos cadastrados pelo professor.
function MeusEventos() {

    // Guarda a lista de eventos do professor
    const [eventos, setEventos] = useState([]);

    // Controla o carregamento e as mensagens de erro
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Guarda o ID do evento que está sendo editado
    const [eventoEditando, setEventoEditando] = useState(null);

    // Guarda os dados do formulário de edição
    const [formulario, setFormulario] = useState({
        titulo: "",
        descricao: "",
        categoria: "",
        data: "",
        horario: "",
        local: "",
        vagas: ""
    });

    // Controla a exibição do modal de mensagem
    const [modalAberto, setModalAberto] = useState(false);

    // Guarda o título e a mensagem que aparecem no modal
    const [tituloModal, setTituloModal] = useState("");
    const [mensagemModal, setMensagemModal] = useState("");

    // Controla se o modal está pedindo confirmação de exclusão
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

    // Guarda o ID do evento que será excluído
    const [idEventoExcluir, setIdEventoExcluir] = useState(null);

    // Busca os eventos no servidor e retorna os dados encontrados
    async function obterEventos() {
        const resposta = await fetch(
            "http://localhost:3000/eventos/professor/meus",
            {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        );

        // Converte a resposta do servidor para JSON
        const resultado = await resposta.json();

        // Verifica se ocorreu algum erro na busca
        if (!resposta.ok) {
            throw new Error(
                resultado.message || "Não foi possível carregar os eventos."
            );
        }

        return resultado.data || [];
    }

    // Carrega os eventos quando a página abre
    useEffect(() => {
        let paginaAtiva = true;

        async function carregarEventos() {
            try {
                const dados = await obterEventos();

                // Atualiza a tela somente se a página ainda estiver aberta
                if (paginaAtiva) {
                    setEventos(dados);
                    setErro("");
                }
            } catch (error) {
                console.log(error);

                if (paginaAtiva) {
                    setErro(error.message);
                }
            } finally {
                if (paginaAtiva) {
                    setCarregando(false);
                }
            }
        }

        carregarEventos();

        // Impede atualizações caso o componente seja desmontado
        return () => {
            paginaAtiva = false;
        };
    }, []);

    // Atualiza a lista depois de editar ou excluir um evento
    const buscarEventos = useCallback(async () => {
        try {
            const dados = await obterEventos();

            setEventos(dados);
            setErro("");
        } catch (error) {
            console.log(error);
            setErro(error.message);
        }
    }, []);

    // Atualiza os campos do formulário de edição
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

    // Cancela a edição e limpa os campos do formulário
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

    // Envia as alterações do evento para o backend
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

            // Converte a resposta do servidor para JSON
            const resultado = await resposta.json();

            // Verifica se a atualização apresentou algum erro
            if (!resposta.ok) {
                alert(resultado.message || "Não foi possível atualizar o evento.");
                return;
            }

            // Fecha o formulário de edição
            cancelarEdicao();

            // Atualiza a lista com os dados modificados
            await buscarEventos();

            // Prepara e exibe o modal de sucesso
            setConfirmandoExclusao(false);
            setTituloModal("Evento atualizado!");
            setMensagemModal("As alterações do seu evento foram salvas com sucesso.");
            setModalAberto(true);

        } catch (error) {
            console.log(error);
            alert("Erro ao conectar com o servidor.");
        }
    }

    // Abre o modal para confirmar a exclusão
    function excluirEvento(id) {
        setIdEventoExcluir(id);
        setTituloModal("Excluir evento?");

        setMensagemModal(
            "Tem certeza de que deseja excluir este evento? Essa ação não poderá ser desfeita."
        );

        setConfirmandoExclusao(true);
        setModalAberto(true);
    }

    // Exclui o evento depois da confirmação
    async function confirmarExclusao() {
        try {
            const resposta = await fetch(
                `http://localhost:3000/eventos/${idEventoExcluir}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            // Converte a resposta do servidor para JSON
            const resultado = await resposta.json();

            // Verifica se a exclusão apresentou algum erro
            if (!resposta.ok) {
                alert(resultado.message || "Não foi possível excluir o evento.");
                return;
            }

            // Cancela a edição caso o evento excluído estivesse sendo editado
            if (eventoEditando === idEventoExcluir) {
                cancelarEdicao();
            }

            // Atualiza a lista depois da exclusão
            await buscarEventos();

            // Prepara o modal de sucesso
            setConfirmandoExclusao(false);
            setTituloModal("Evento excluído!");
            setMensagemModal("O evento foi excluído com sucesso.");
            setIdEventoExcluir(null);

        } catch (error) {
            console.log(error);
            alert("Erro ao conectar com o servidor.");
        }
    }

    // Fecha o modal e limpa os dados da confirmação
    function fecharModal() {
        setModalAberto(false);
        setConfirmandoExclusao(false);
        setIdEventoExcluir(null);
    }

    return (
        <section className="meus-eventos">

            {/* Cabeçalho da página */}
            <header className="boas-vindas">
                <h1>Meus eventos</h1>
                <p>Visualize e gerencie os eventos que você cadastrou.</p>
            </header>

            {/* Mensagem exibida durante o carregamento */}
            {carregando && (
                <p className="sem-eventos">Carregando seus eventos...</p>
            )}

            {/* Mensagem exibida caso ocorra um erro */}
            {!carregando && erro && (
                <p className="sem-eventos">{erro}</p>
            )}

            {/* Mensagem exibida quando o professor ainda não possui eventos */}
            {!carregando && !erro && eventos.length === 0 && (
                <p className="sem-eventos">
                    Você ainda não cadastrou nenhum evento.
                </p>
            )}

            {/* Lista dos eventos cadastrados pelo professor */}
            {!carregando && !erro && eventos.length > 0 && (
                <div className="lista-meus-eventos">

                    {eventos.map((evento) => (
                        <article
                            className="meu-evento-card"
                            key={evento.id}
                        >

                            {/* Formulário de edição do evento */}
                            {eventoEditando === evento.id ? (

                                <form onSubmit={salvarEdicao}>

                                    <h2>Editar evento</h2>

                                    <div className="formulario-editar-evento">

                                        {/* Campo para o título */}
                                        <div>
                                            <label htmlFor="titulo">Título</label>
                                            <input
                                                id="titulo"
                                                type="text"
                                                name="titulo"
                                                value={formulario.titulo}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        {/* Campo para a descrição */}
                                        <div>
                                            <label htmlFor="descricao">Descrição</label>
                                            <textarea
                                                id="descricao"
                                                name="descricao"
                                                value={formulario.descricao}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        {/* Campo para selecionar a categoria */}
                                        <div>
                                            <label htmlFor="categoria">Categoria</label>
                                            <select
                                                id="categoria"
                                                name="categoria"
                                                value={formulario.categoria}
                                                onChange={aoMudarCampo}
                                                required
                                            >
                                                <option value="">Selecione uma categoria</option>
                                                <option value="Palestra">Palestra</option>
                                                <option value="Workshop">Workshop</option>
                                                <option value="Feira">Feira</option>
                                            </select>
                                        </div>

                                        {/* Campo para a data */}
                                        <div>
                                            <label htmlFor="data">Data</label>
                                            <input
                                                id="data"
                                                type="date"
                                                name="data"
                                                value={formulario.data}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        {/* Campo para o horário */}
                                        <div>
                                            <label htmlFor="horario">Horário</label>
                                            <input
                                                id="horario"
                                                type="time"
                                                name="horario"
                                                value={formulario.horario}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        {/* Campo para o local */}
                                        <div>
                                            <label htmlFor="local">Local</label>
                                            <input
                                                id="local"
                                                type="text"
                                                name="local"
                                                value={formulario.local}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                        {/* Campo para a quantidade de vagas */}
                                        <div>
                                            <label htmlFor="vagas">Quantidade de vagas</label>
                                            <input
                                                id="vagas"
                                                type="number"
                                                name="vagas"
                                                min="1"
                                                value={formulario.vagas}
                                                onChange={aoMudarCampo}
                                                required
                                            />
                                        </div>

                                    </div>

                                    {/* Botões para salvar ou cancelar a edição */}
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

                                /* Visualização dos dados do evento */
                                <>
                                    <span className="event-categoria">
                                        {evento.categoria}
                                    </span>

                                    <h2>{evento.titulo}</h2>

                                    <p className="meu-evento-descricao">
                                        {evento.descricao}
                                    </p>

                                    {/* Informações principais do evento */}
                                    <div className="meu-evento-informacoes">
                                        <p><strong>Data:</strong> {evento.data}</p>
                                        <p><strong>Horário:</strong> {evento.horario}</p>
                                        <p><strong>Local:</strong> {evento.local}</p>
                                        <p><strong>Vagas:</strong> {evento.vagas}</p>
                                    </div>

                                    {/* Botões de edição e exclusão */}
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

            {/* Modal de confirmação e mensagens de sucesso */}
            {modalAberto && (
                <div className="modal-fundo">

                    <div
                        className="modal-mensagem"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal"
                    >

                        {/* Ícone do modal */}
                        <div className={`modal-icone ${confirmandoExclusao ? "confirmacao" : "sucesso"}`}>
                            <span>{confirmandoExclusao ? "!" : "✓"}</span>
                        </div>

                        {/* Título e mensagem */}
                        <h2 id="titulo-modal">{tituloModal}</h2>
                        <p>{mensagemModal}</p>

                        {/* Botões de confirmação ou fechamento */}
                        {confirmandoExclusao ? (

                            <div className="acoes-editar-evento">
                                <button
                                    type="button"
                                    className="btn-cancelar-edicao"
                                    onClick={fecharModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    className="btn-excluir-evento"
                                    onClick={confirmarExclusao}
                                >
                                    Sim, excluir
                                </button>
                            </div>

                        ) : (

                            <button
                                type="button"
                                onClick={fecharModal}
                            >
                                Continuar
                            </button>

                        )}

                    </div>
                </div>
            )}

        </section>
    );
}

export default MeusEventos;
