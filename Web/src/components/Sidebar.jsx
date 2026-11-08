/* ==========================================
   COMPONENTE: SIDEBAR
   Responsável pelo menu lateral do AgendaTech.
   Contém a logo, identificação do usuário
   e as opções de navegação.
   ========================================== */


// Importação da logo e do avatar padrão
import logo from "../assets/imagens/logo.svg";
import avatar from "../assets/imagens/avatar-default.svg";


/* Lista dos links do menu.
   O "id" é o nome da página que o App vai abrir. */
const links = [
  { id: "inicio", texto: "Início" },
  { id: "perfil", texto: "Meu perfil" },
  { id: "favoritos", texto: "Favoritos" },
  { id: "inscricoes", texto: "Minhas inscrições" },
];


/* Props:
   - paginaAtual: id da página aberta (para destacar o link)
   - aoNavegar: função que troca de página
   - aoSair: função que faz o logout */
function Sidebar({ paginaAtual, aoNavegar, aoSair }) {

  // Troca de página sem recarregar o site
  function irParaPagina(evento, id) {
    // preventDefault evita que o href="#" suba a página para o topo
    evento.preventDefault();
    aoNavegar(id);
  }

  function sair(evento) {
    evento.preventDefault();
    aoSair();
  }

  return (
    <aside className="sidebar">
      {/* Logo do AgendaTech */}
      <div className="sidebar-logo">
        <img src={logo} alt="AgendaTech" />
      </div>

      {/* Informações do usuário */}
      <div className="sidebar-user">
        <img
          src={avatar}
          alt="Foto de perfil do usuário"
          className="sidebar-avatar"
        />

        <div className="sidebar-user-info">
          <h3>Ana Silva</h3>
          <span>Aluno</span>
        </div>
      </div>

      {/* Menu de navegação: o map cria um link para cada item da lista */}
      <nav className="sidebar-navigation">
        {links.map((link) => (
          <a
            key={link.id}
            href="#"
            className={
              paginaAtual === link.id ? "sidebar-link active" : "sidebar-link"
            }
            onClick={(evento) => irParaPagina(evento, link.id)}
          >
            {link.texto}
          </a>
        ))}
      </nav>

      {/* Opção de sair */}
      <div className="sidebar-footer">
        <a href="#" className="sidebar-link" onClick={sair}>
          Sair
        </a>
      </div>
    </aside>
  );
}


// Disponibiliza o componente para outras páginas
export default Sidebar;
