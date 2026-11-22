require("dotenv").config();
module.exports = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || "postgres://mpdesk:mpdesk@localhost:5432/mpdesk",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-troque",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  uploadDir: process.env.UPLOAD_DIR || "uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 5),
};
