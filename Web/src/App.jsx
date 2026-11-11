
/* ==========================================
   COMPONENTE PRINCIPAL: App
   Controla qual página será exibida.
   Gerencia o login, a navegação e as funções
   compartilhadas entre as páginas do sistema.
   ========================================== */

import { useState } from "react";

// Importa as páginas do projeto
import Login from "./pages/Login";
import PaginaInicial from "./pages/PaginaInicial";
import MeuPerfil from "./pages/MeuPerfil";
import Favoritos from "./pages/Favoritos";
import MinhasInscricoes from "./pages/MinhasInscricoes";
import Sidebar from "./components/Sidebar";
import CadastrarEvento from "./pages/CadastrarEvento";
import MeusEventos from "./pages/MeusEventos";
import InicioProfessor from "./pages/InicioProfessor";

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

    // Realiza ou cancela a inscrição em um evento
    function alternarInscricao(id) {
        if (inscricoes.includes(id)) {
            setInscricoes(
                inscricoes.filter((idInscrito) => idInscrito !== id)
            );
        } else {
            setInscricoes([...inscricoes, id]);
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

                    {/* Página de alunos inscritos */}
                    {pagina === "inscritos" && (
                        <header className="boas-vindas">
                            <h1>Alunos inscritos</h1>
                            <p>
                                Acompanhe os alunos inscritos nos seus eventos.
                            </p>
                        </header>
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
