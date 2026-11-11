import { useState } from "react";

import "../styles/paginaInicial.css";
import "../styles/paginasInternas.css";

import Sidebar from "../components/Sidebar";

function CadastrarEvento({ usuario, aoNavegar, aoSair }) {

    // Guarda as informações digitadas no formulário
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");
    const [local, setLocal] = useState("");
    const [vagas, setVagas] = useState("");

    // Envia os dados do evento para o backend
    async function cadastrarEvento(e) {
        e.preventDefault();

        const novoEvento = {
            titulo,
            descricao,
            categoria,
            data,
            horario,
            local,
            vagas: Number(vagas),
        };

        try {
            const resposta = await fetch("http://localhost:3000/eventos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify(novoEvento)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                alert(resultado.Error || "Não foi possível cadastrar o evento.");
                return;
            }

            alert("Evento cadastrado com sucesso!");

            // Limpa os campos depois do cadastro
            setTitulo("");
            setDescricao("");
            setCategoria("");
            setData("");
            setHorario("");
            setLocal("");
            setVagas("");

        } catch (error) {
            console.log(error);
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

                {/* Card com o formulário */}
                <section className="perfil-card card-cadastro-evento">

                    <form
                        className="formulario-evento"
                        onSubmit={cadastrarEvento}
                    >

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

                        <div>
                            <label htmlFor="categoria">Categoria</label>
                            <input
                                id="categoria"
                                type="text"
                                placeholder="Ex.: Palestra, Workshop..."
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="data">Data</label>
                            <input
                                id="data"
                                type="date"
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="horario">Horário</label>
                            <input
                                id="horario"
                                type="time"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                required
                            />
                        </div>

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

                        <button type="submit">
                            Cadastrar evento
                        </button>

                    </form>
                </section>

            </main>
        </div>
    );
}

export default CadastrarEvento;
