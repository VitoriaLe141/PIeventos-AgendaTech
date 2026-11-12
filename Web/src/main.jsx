/* ==========================================
   ARQUIVO DE ENTRADA DO PROJETO
   É por aqui que o React começa a rodar
   e mostra o site na tela.
   ========================================== */

// StrictMode ajuda a encontrar erros enquanto eu programo
import { StrictMode } from "react";
// createRoot liga o React à página HTML
import { createRoot } from "react-dom/client";
// Importei o CSS global para as cores e estilos valerem no site todo
import "./styles/global.css";
// Importei o componente principal
import App from "./App.jsx";

// Aqui eu procuro no index.html a div com id "root"
// e mostro o meu App dentro dela
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
