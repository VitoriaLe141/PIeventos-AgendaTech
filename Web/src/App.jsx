/* ==========================================
   COMPONENTE PRINCIPAL: App
   Controla qual página será exibida.
   Gerencia o login, a navegação e as funções
   compartilhadas entre as páginas do sistema.
   ========================================== */

import { useEffect, useState } from "react";

// Importa as páginas do projeto
import Login from "./pages/Login";
import PaginaInicial from "./pages/PaginaInicial";
import MeuPerfil from "./pages/MeuPerfil";
import Favoritos from "./pages/Favoritos";
import MinhasInscricoes from "./pages/MinhasInscricoes";
import AlunosInscritos from "./pages/AlunosInscritos";
import Sidebar from "./components/Sidebar";
import CadastrarEvento from "./pages/CadastrarEvento";
import MeusEventos from "./pages/MeusEventos";
import InicioProfessor from "./pages/InicioProfessor";

// Controla o login, a navegação e as páginas do sistema.
function App() {

    // Controla se o usuário está autenticado
    const [logado, setLogado] = useState(false);

    // Guarda os dados do usuário que entrou
    const [usuario, setUsuario] = useState(null);

    // Controla qual página está aberta
    const [pagina, setPagina] = useState("inicio");

    // Guarda os IDs dos eventos favoritos e inscritos
    const [favoritos, setFavoritos] = useState([]);
    const [inscricoes, setInscricoes] = useState([]);

    // ==========================================
    // BUSCAR INSCRIÇÕES DO ALUNO
    // ==========================================

    // Carrega as inscrições salvas no banco quando o aluno entra
    useEffect(() => {

        // Se não existir um aluno logado, não realiza a busca
        if (!usuario || usuario.role !== "aluno") {
            return;
        }

        // Busca as inscrições do aluno no backend
        async function buscarInscricoes() {
            try {
                const resposta = await fetch(
                    "http://localhost:3000/inscricoes/minhas",
                    {
                        headers: {
                            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                        }
                    }
                );

                const resultado = await resposta.json();

                // Verifica se ocorreu algum erro na busca
                if (!resposta.ok) {
                    throw new Error(
                        resultado.message || "Não foi possível buscar suas inscrições."
                    );
                }

                // Guarda somente os IDs dos eventos inscritos
                const ids = (resultado.data || []).map((item) =>
                    Number(item.eventoId)
                );

                setInscricoes(ids);

            } catch (error) {
                // Registra o erro no console
                console.log("Erro ao buscar inscrições:", error);
            }
        }

        buscarInscricoes();

    }, [usuario]);

    // ==========================================
    // FAVORITAR E INSCREVER
    // ==========================================

    // Adiciona ou remove um evento dos favoritos
    function alternarFavorito(id) {
        if (favoritos.includes(id)) {
            setFavoritos(
                favoritos.filter((idFavorito) => idFavorito !== id)
            );
        } else {
            setFavoritos([...favoritos, id]);
        }
    }

    // Salva uma inscrição nova ou cancela uma inscrição existente
    async function alternarInscricao(id) {
        const idEvento = Number(id);
        const jaInscrito = inscricoes.includes(idEvento);

        try {
            // Escolhe o método conforme a situação do aluno
            const resposta = await fetch(
                `http://localhost:3000/inscricoes/${idEvento}`,
                {
                    method: jaInscrito ? "DELETE" : "POST",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                }
            );

            const resultado = await resposta.json();

            // Mostra uma mensagem somente se houver erro
            if (!resposta.ok) {
                alert(
                    resultado.Error ||
                    resultado.message ||
                    "Não foi possível alterar a inscrição."
                );
                return;
            }

            // Atualiza a lista na tela depois que o banco confirma a ação
            if (jaInscrito) {
                setInscricoes(
                    inscricoes.filter((idInscrito) => idInscrito !== idEvento)
                );
            } else {
                setInscricoes([...inscricoes, idEvento]);
            }

            // Não exibe notificação quando a inscrição é realizada ou cancelada.

        } catch (error) {
            // Registra o erro no console e avisa caso o servidor não responda
            console.log("Erro ao alterar inscrição:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    // ==========================================
    // SAIR DO SISTEMA
    // ==========================================

    function sair() {
        // Apaga os dados guardados no login
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");

        // Limpa os dados do usuário
        setUsuario(null);

        // Volta o sistema para o início
        setLogado(false);
        setPagina("inicio");
        setFavoritos([]);
        setInscricoes([]);
    }

    // ==========================================
    // TELA DE LOGIN
    // ==========================================

    // Se não estiver logado, mostra a tela de Login
    if (!logado) {
        return (
            <Login
                aoEntrar={(dadosUsuario) => {
                    // Guarda os dados recebidos do login
                    setUsuario(dadosUsuario);

                    // Informa que o usuário está autenticado
                    setLogado(true);
                }}
            />
        );
    }

    // ==========================================
    // ÁREA DO PROFESSOR
    // ==========================================

    if (usuario?.role === "professor") {

        // Abre a página de cadastro de eventos
        if (pagina === "cadastrar") {
            return (
                <CadastrarEvento
                    usuario={usuario}
                    aoNavegar={setPagina}
                    aoSair={sair}
                />
            );
        }

        return (
            <div className="pagina-inicial">

                {/* Menu lateral do professor */}
                <Sidebar
                    paginaAtual={pagina}
                    usuario={usuario}
                    aoNavegar={setPagina}
                    aoSair={sair}
                />

                <main className="conteudo">

                    {/* Página inicial com o resumo do professor */}
                    {pagina === "inicio" && (
                        <InicioProfessor
                            usuario={usuario}
                            aoNavegar={setPagina}
                        />
                    )}

                    {/* Página dos eventos criados pelo professor */}
                    {pagina === "eventos" && (
                        <MeusEventos usuario={usuario} />
                    )}

                    {/* Página com a lista de alunos inscritos */}
                    {pagina === "inscritos" && (
                        <AlunosInscritos />
                    )}

                </main>
            </div>
        );
    }

    // ==========================================
    // PÁGINAS DO ALUNO LOGADO
    // ==========================================

    // Reúne as propriedades compartilhadas pelas páginas
    const propsDasPaginas = {
        usuario: usuario,
        favoritos: favoritos,
        inscricoes: inscricoes,
        aoFavoritar: alternarFavorito,
        aoInscrever: alternarInscricao,
        aoNavegar: setPagina,
        aoSair: sair,
    };

    // Abre a página de perfil
    if (pagina === "perfil") {
        return <MeuPerfil {...propsDasPaginas} />;
    }

    // Abre a página de favoritos
    if (pagina === "favoritos") {
        return <Favoritos {...propsDasPaginas} />;
    }

    // Abre a página de inscrições
    if (pagina === "inscricoes") {
        return <MinhasInscricoes {...propsDasPaginas} />;
    }

    // Se nenhuma outra página estiver selecionada,
    // abre a página inicial do aluno
    return <PaginaInicial {...propsDasPaginas} />;
}

// Exporta o componente principal
export default App;
