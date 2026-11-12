/* ==========================================
   COMPONENTE: HEADER
   Faixa de boas-vindas no topo da página inicial.
   ========================================== */


function Header({ nome }) {
  return (
    <header className="boas-vindas">
      <h1>Bem-vinda, {nome}!</h1>
      <p>Confira os eventos da Fatec e participe de novas experiências.</p>
    </header>
  );
}


// Disponibiliza o componente para outras páginas
export default Header;
