
/* ==========================================
   COMPONENTE: SIDEBAR
   Responsável pelo menu lateral do AgendaTech.
   Contém a logo, identificação do usuário
   e as opções de navegação.
   ========================================== */

// Importação da logo e do avatar padrão
import logo from "../assets/imagens/logo.svg";
import avatar from "../assets/imagens/avatar-default.svg";

// Lista dos links disponíveis para o aluno
const linksAluno = [
  { id: "inicio", texto: "Início" },
  { id: "perfil", texto: "Meu perfil" },
  { id: "favoritos", texto: "Favoritos" },
  { id: "inscricoes", texto: "Minhas inscrições" },
];

// Lista dos links disponíveis para o professor
const linksProfessor = [
  { id: "inicio", texto: "Início" },
  { id: "cadastrar", texto: "Cadastrar evento" },
  { id: "eventos", texto: "Meus eventos" },
  { id: "inscritos", texto: "Alunos inscritos" },
];

/* Props:
   - paginaAtual: id da página aberta
   - aoNavegar: função que troca de página
   - aoSair: função que faz o logout
   - usuario: dados do usuário autenticado
*/

function Sidebar({ paginaAtual, aoNavegar, aoSair, usuario }) {

  // Escolhe os links de acordo com o perfil do usuário
  const perfil = usuario?.role?.toLowerCase();

  const links = perfil === "professor"
    ? linksProfessor
    : linksAluno;

  // Define o nome do perfil
  const nomePerfil = perfil === "professor"
    ? "Professor"
    : "Aluno";


  // Troca de página sem recarregar o site
  function irParaPagina(evento, id) {
    evento.preventDefault();
    aoNavegar(id);
  }

  // Realiza o logout
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
          <h3>{usuario?.name || "Usuário"}</h3>
          <span>{nomePerfil}</span>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="sidebar-navigation">
        {links.map((link) => (
          <a
            key={link.id}
            href="#"
            className={
              paginaAtual === link.id
                ? "sidebar-link active"
                : "sidebar-link"
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
