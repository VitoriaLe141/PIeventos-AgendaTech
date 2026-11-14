/* ==========================================
   PÁGINA: Cadastrar evento
   Exibe o formulário usado pelo professor
   para cadastrar um novo evento.
   ========================================== */

import { useState } from "react";

import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

import Sidebar from "../components/Sidebar";

// Monta o formulário usado pelo professor para criar um evento.
function CadastrarEvento({ usuario, aoNavegar, aoSair }) {

    // Guarda as informações digitadas no formulário
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [minutos, setMinutos] = useState("");
    const [local, setLocal] = useState("");
    const [vagas, setVagas] = useState("");

    // Define a data mínima como o dia atual
    const hoje = new Date();

    const dataMinima = `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
    ).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

    // Controla a exibição do modal de sucesso
    const [modalAberto, setModalAberto] = useState(false);

    // Guarda a mensagem que será exibida no modal
    const [mensagemModal, setMensagemModal] = useState("");

    // Envia os dados do evento para o backend
    async function cadastrarEvento(e) {
        e.preventDefault();

        // Junta hora e minutos no formato HH:MM
        const horario = `${hora}:${minutos}`;

        // Organiza as informações preenchidas no formulário
        const novoEvento = {
            titulo,
            descricao,
            categoria,
            data,
            horario,
            local,
            vagas: Number(vagas)
        };

        try {
            // Envia os dados para a rota de cadastro de eventos
            const resposta = await fetch("http://localhost:3000/eventos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify(novoEvento)
            });

            // Converte a resposta do servidor para JSON
            const resultado = await resposta.json();

            // Verifica se o cadastro apresentou algum erro
            if (!resposta.ok) {
                alert(
                    resultado.Error ||
                    resultado.message ||
                    "Não foi possível cadastrar o evento."
                );
                return;
            }

            // Limpa os campos depois que o evento for cadastrado
            setTitulo("");
            setDescricao("");
            setCategoria("");
            setData("");
            setHora("");
            setMinutos("");
            setLocal("");
            setVagas("");

            // Prepara a mensagem de sucesso e abre o modal
            setMensagemModal("Seu evento foi cadastrado com sucesso!");
            setModalAberto(true);

        } catch (error) {
            // Avisa caso o servidor não responda
            console.log("Erro ao cadastrar evento:", error);
            alert("Erro ao conectar com o servidor.");
        }
    }

    return (
        <div className="pagina-inicial">

            {/* Menu lateral do professor */}
            <Sidebar
                paginaAtual="cadastrar"
                usuario={usuario}
                aoNavegar={aoNavegar}
                aoSair={aoSair}
            />

            <main className="conteudo">

                {/* Cabeçalho da página */}
                <header className="boas-vindas">
                    <h1>Cadastrar evento</h1>
                    <p>
                        Preencha as informações para divulgar um novo evento.
                    </p>
                </header>

                {/* Card com o formulário centralizado */}
                <section className="perfil-card card-cadastro-evento">

                    <form
                        className="formulario-evento"
                        onSubmit={cadastrarEvento}
                    >

                        {/* Campo para o título do evento */}
                        <div>
                            <label htmlFor="titulo">Título do evento</label>
                            <input
                                id="titulo"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo para a descrição do evento */}
                        <div>
                            <label htmlFor="descricao">Descrição</label>
                            <textarea
                                id="descricao"
                                className="campo-descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo para selecionar a categoria */}
                        <div>
                            <label htmlFor="categoria">Categoria</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma categoria</option>
                                <option value="Palestra">Palestra</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Feira">Feira</option>
                            </select>
                        </div>

                        {/* Campo para a data do evento */}
                        <div>
                            <label htmlFor="data">Data</label>
                            <input
                                id="data"
                                type="date"
                                min={dataMinima}
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campos para selecionar o horário */}
                        <div className="campo-horario">
                            <label>Horário</label>

                            <div className="horario-seletores">

                                <select
                                    aria-label="Hora do evento"
                                    value={hora}
                                    onChange={(e) => setHora(e.target.value)}
                                    required
                                >
                                    <option value="">Hora</option>

                                    {Array.from({ length: 24 }, (_, i) => (
                                        <option
                                            key={i}
                                            value={String(i).padStart(2, "0")}
                                        >
                                            {String(i).padStart(2, "0")}
                                        </option>
                                    ))}
                                </select>

                                <span>:</span>

                                <select
                                    aria-label="Minutos do evento"
                                    value={minutos}
                                    onChange={(e) => setMinutos(e.target.value)}
                                    required
                                >
                                    <option value="">Minutos</option>

                                    {Array.from({ length: 60 }, (_, i) => (
                                        <option key={i} value={String(i).padStart(2, "0")}>
                                            {String(i).padStart(2, "0")}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        {/* Campo para o local do evento */}
                        <div>
                            <label htmlFor="local">Local</label>
                            <input
                                id="local"
                                type="text"
                                value={local}
                                onChange={(e) => setLocal(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo para a quantidade de vagas */}
                        <div>
                            <label htmlFor="vagas">Quantidade de vagas</label>
                            <input
                                id="vagas"
                                type="number"
                                min="1"
                                value={vagas}
                                onChange={(e) => setVagas(e.target.value)}
                                required
                            />
                        </div>

                        {/* Botão para enviar o formulário */}
                        <button type="submit">
                            Cadastrar evento
                        </button>

                    </form>
                </section>

            </main>

            {/* Modal exibido quando o evento é cadastrado com sucesso */}
            {modalAberto && (
                <div className="modal-fundo">
                    <div
                        className="modal-mensagem"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal"
                    >

                        {/* Ícone de confirmação */}
                        <div className="modal-icone sucesso">
                            <span>✓</span>
                        </div>

                        {/* Título e mensagem do modal */}
                        <h2 id="titulo-modal">Evento cadastrado!</h2>
                        <p>{mensagemModal}</p>

                        {/* Fecha o modal */}
                        <button
                            type="button"
                            onClick={() => setModalAberto(false)}
                        >
                            Continuar
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

// Exporta a página para ser usada no App.jsx
export default CadastrarEvento;
