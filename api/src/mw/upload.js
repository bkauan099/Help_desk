// RF03 — upload de até 3 anexos (imagem/PDF, máx. 5 MB cada).
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { uploadDir, maxUploadMb } = require("../config");

fs.mkdirSync(uploadDir, { recursive: true });

const PERMITIDOS = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxUploadMb * 1024 * 1024, files: 3 },
  fileFilter: (req, file, cb) => {
    if (PERMITIDOS.has(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de arquivo não permitido (use imagem ou PDF)."));
  },
});

module.exports = { upload };
