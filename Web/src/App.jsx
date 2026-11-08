/* ==========================================
   COMPONENTE PRINCIPAL: App
   Controla qual página será exibida.
   O aluno começa no Login e, após entrar,
   é direcionado para a página inicial.
   Depois de logado, ele navega pelo menu
   lateral: Início, Meu perfil, Favoritos e
   Minhas inscrições.
   ========================================== */

import { useState } from "react";

// Importa as páginas do projeto
import Login from "./pages/Login";
import PaginaInicial from "./pages/PaginaInicial";
import MeuPerfil from "./pages/MeuPerfil";
import Favoritos from "./pages/Favoritos";
import MinhasInscricoes from "./pages/MinhasInscricoes";

function App() {

  // Controla se o aluno está autenticado
  const [logado, setLogado] = useState(false);

  // Controla qual página está aberta depois do login
  // Valores possíveis: "inicio", "perfil", "favoritos" e "inscricoes"
  const [pagina, setPagina] = useState("inicio");

  // Guardam só os ids dos eventos (ex: [1, 4]).
  // Ficam aqui no App porque várias páginas precisam deles.
  const [favoritos, setFavoritos] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);


  /* ---------- FAVORITAR E INSCREVER ---------- */

  // Se o evento já está nos favoritos, tira. Se não está, coloca.
  function alternarFavorito(id) {
    if (favoritos.includes(id)) {
      // filter fica só com os ids diferentes do que foi clicado
      setFavoritos(favoritos.filter((idFavorito) => idFavorito !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  }

  // Mesma ideia para a inscrição: inscreve ou cancela
  function alternarInscricao(id) {
    if (inscricoes.includes(id)) {
      setInscricoes(inscricoes.filter((idInscrito) => idInscrito !== id));
    } else {
      setInscricoes([...inscricoes, id]);
    }
  }


  /* ---------- SAIR ---------- */

  function sair() {
    // Apaga o token guardado no login
    sessionStorage.removeItem("token");

    // Volta tudo para o começo
    setLogado(false);
    setPagina("inicio");
    setFavoritos([]);
    setInscricoes([]);
  }


  /* ---------- TELA DE LOGIN ---------- */

  // Se não estiver logado, mostra a tela de Login
  if (!logado) {
    return (
      <Login
        aoEntrar={() => setLogado(true)}
      />
    );
  }


  /* ---------- PÁGINAS DO ALUNO LOGADO ---------- */

  // Tudo o que as páginas precisam receber fica junto neste objeto.
  // Assim eu não repito as mesmas props quatro vezes.
  const propsDasPaginas = {
    favoritos: favoritos,
    inscricoes: inscricoes,
    aoFavoritar: alternarFavorito,
    aoInscrever: alternarInscricao,
    aoNavegar: setPagina,
    aoSair: sair,
  };

  // Cada if abre uma página. O {...propsDasPaginas} entrega todas as props.
  if (pagina === "perfil") {
    return <MeuPerfil {...propsDasPaginas} />;
  }

  if (pagina === "favoritos") {
    return <Favoritos {...propsDasPaginas} />;
  }

  if (pagina === "inscricoes") {
    return <MinhasInscricoes {...propsDasPaginas} />;
  }

  // Se não for nenhuma das outras, abre a página inicial
  return <PaginaInicial {...propsDasPaginas} />;

}

// Exporta o componente principal
export default App;
