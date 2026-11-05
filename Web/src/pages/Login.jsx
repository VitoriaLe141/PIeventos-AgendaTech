
/* ==========================================
   PÁGINA: Login
   Tela de entrada do AgendaTech.
   O aluno informa seu RA e sua senha
   para acessar a plataforma.
   ========================================== */

import { useState } from "react";
import CampoTexto from "../components/CampoTexto";
import "../styles/login.css";

// Quantidade de números do RA
const TAMANHO_RA = 13;

// Limite de caracteres da senha
const TAMANHO_SENHA = 20;

// Endereço do backend
const URL_SERVIDOR = "http://localhost:3000";

function Login({ aoEntrar }) {

  /* ---------- VARIÁVEIS DE ESTADO ---------- */

  const [ra, setRa] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erros, setErros] = useState({});
  const [erroLogin, setErroLogin] = useState("");
  const [carregando, setCarregando] = useState(false);


  /* ---------- CAMPO RA ---------- */

  function aoMudarRa(evento) {

    // Permite somente números
    const somenteNumeros = evento.target.value.replace(/\D/g, "");

    // Limita o RA a 13 números
    setRa(somenteNumeros.slice(0, TAMANHO_RA));

  }


  /* ---------- CAMPO SENHA ---------- */

  function aoMudarSenha(evento) {

    // Permite somente números
    const somenteNumeros = evento.target.value.replace(/\D/g, "");

    // Limita a senha a 20 números
    setSenha(somenteNumeros.slice(0, TAMANHO_SENHA));

  }


  /* ---------- VALIDAÇÃO ---------- */

  function validar() {

    const novosErros = {};

    if (ra === "") {
      novosErros.ra = "Informe seu RA.";

    } else if (ra.length !== TAMANHO_RA) {
      novosErros.ra = "O RA deve ter exatamente 13 números.";
    }

    if (senha === "") {
      novosErros.senha = "Informe sua senha.";
    }

    return novosErros;

  }


  /* ---------- ENVIO DO LOGIN ---------- */

  async function aoEnviar(evento) {

    evento.preventDefault();

    // Limpa mensagens anteriores
    setErroLogin("");

    // Verifica os campos antes de enviar
    const novosErros = validar();

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    // Inicia o carregamento
    setCarregando(true);

    try {

      // Envia o RA e a senha para o backend
      const resposta = await fetch(`${URL_SERVIDOR}/auth/login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          login: ra,
          password: senha
        })

      });

      // Recebe a resposta do servidor
      const dados = await resposta.json();

      // Verifica se o login foi recusado
      if (!resposta.ok) {

        setErroLogin(dados.message || "Não foi possível entrar.");

        return;
      }

      // Verifica se a autenticação foi realizada
      if (dados.message === "sucess") {

        // Guarda o token de autenticação
        sessionStorage.setItem("token", dados.data);

        // Avisa ao App que o aluno entrou
        aoEntrar();
      }

    } catch (erro) {

      console.error("Erro no login:", erro);

      setErroLogin(
        "Não foi possível conectar ao servidor. Tente novamente."
      );

    } finally {

      // Finaliza o carregamento
      setCarregando(false);

    }

  }


  /* ---------- TELA DO LOGIN ---------- */

  return (

    <div className="login-fundo">

      <div className="login-painel">

        <div className="login-topo">

          <div className="logo">PI</div>

          <h1>AgendaTech</h1>

          <p>Conectando você aos eventos da Fatec</p>

        </div>


        <form onSubmit={aoEnviar} noValidate>

          {/* CAMPO RA */}

          <CampoTexto
            id="ra"
            rotulo="RA"
            tipo="text"
            valor={ra}
            aoMudar={aoMudarRa}
            placeholder="Digite seu RA"
            erro={erros.ra}
            tamanhoMaximo={TAMANHO_RA}
            modoTeclado="numeric"
          />


          {/* CAMPO SENHA */}

          <div className="campo-senha">

            <CampoTexto
              id="senha"
              rotulo="Senha"
              tipo={mostrarSenha ? "text" : "password"}
              valor={senha}
              aoMudar={aoMudarSenha}
              placeholder="Digite sua senha"
              erro={erros.senha}
              tamanhoMaximo={TAMANHO_SENHA}
              modoTeclado="numeric"
            />


            {/* BOTÃO PARA MOSTRAR OU ESCONDER A SENHA */}

            <button
              type="button"
              className="btn-olho"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >

              {mostrarSenha ? (

                /* Olho riscado: senha visível */

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>

              ) : (

                /* Olho aberto: senha escondida */

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>

              )}

            </button>

          </div>


          {/* BOTÃO ENTRAR */}

          <button
            type="submit"
            className="btn-principal"
            disabled={carregando}
          >

            {carregando ? "Entrando..." : "Entrar"}

          </button>


          {/* MENSAGEM DE ERRO DO SERVIDOR */}

          {erroLogin && (
            <p className="msg-erro-login">
              {erroLogin}
            </p>
          )}

        </form>


        <footer className="login-rodape">
          AgendaTech © 2026
        </footer>

      </div>

    </div>

  );

}

export default Login;
