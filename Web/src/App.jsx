
/* ==========================================
   COMPONENTE PRINCIPAL: App
   Controla qual página será exibida.
   O aluno começa no Login e, após entrar,
   é direcionado para a página inicial.
   ========================================== */

import { useState } from "react";

// Importa as páginas do projeto
import Login from "./pages/Login";
import PaginaInicial from "./pages/PaginaInicial";

function App() {

  // Controla se o aluno está autenticado
  const [logado, setLogado] = useState(false);

  // Se o aluno estiver logado, abre a página inicial
  if (logado) {
    return <PaginaInicial />;
  }

  // Se não estiver logado, mostra a tela de Login
  return (
    <Login
      aoEntrar={() => setLogado(true)}
    />
  );

}

// Exporta o componente principal
export default App;
