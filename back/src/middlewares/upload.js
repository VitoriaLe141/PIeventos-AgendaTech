/* ==========================================
   MIDDLEWARE: UPLOAD
   Configura como os arquivos enviados pelo sistema
   serão recebidos e armazenados.
   ========================================== */

import multer from "multer";

// Define a pasta e o nome usados para guardar os arquivos enviados
const storage = multer.diskStorage({
    // Escolhe a pasta onde o arquivo será salvo
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    // Mantém o nome original do arquivo enviado
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Cria o middleware que recebe os arquivos enviados
const uploads = multer({ storage: storage });

export default uploads;
