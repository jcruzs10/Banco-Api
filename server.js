import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env de forma manual si existe el archivo
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key && val) {
        process.env[key] = val;
      }
    }
  });
}

// Obtener la URL de la API y calcular su origen para la Content-Security-Policy
const API_URL = process.env.VITE_API_URL || 'https://bancocentroamericano.azurewebsites.net';
let apiOrigin = API_URL;
try {
  const urlObj = new URL(API_URL);
  apiOrigin = urlObj.origin;
} catch (e) {
  console.warn('[Azure Deploy Server] URL de API inválida en la configuración, usando fallback origin');
}

// Azure asigna dinámicamente el puerto mediante la variable de entorno PORT
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  // Limpiar la URL para evitar ataques de salto de directorio
  let safeUrl = req.url.split('?')[0];
  if (safeUrl === '/') {
    safeUrl = '/index.html';
  }

  let filePath = path.join(DIST_DIR, safeUrl);

  // Validar si el archivo solicitado tiene extensión, si no, asumimos index.html (Soporte SPA)
  const ext = path.extname(filePath);
  if (!ext) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    // Si el archivo no existe o es un directorio, servimos index.html como fallback de la SPA
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const currentExt = path.extname(filePath);
    const contentType = MIME_TYPES[currentExt] || 'application/octet-stream';

    // Agregar cabeceras de seguridad recomendadas para producción en Azure
    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer-when-downgrade',
      'Content-Security-Policy': `default-src 'self' https://cdn.tailwindcss.com https://fonts.googleapis.com https://fonts.gstatic.com ${apiOrigin}; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; img-src 'self' data:;`
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[Azure Deploy Server] Servidor de producción en ejecución sobre el puerto ${PORT}`);
  console.log(`Servido desde la ruta: ${DIST_DIR}`);
});
