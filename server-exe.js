const http = require('http');
const fs = require('fs');
const path = require('path');

// Mini self-contained Windows .exe simulator / wrapper script or direct file delivery
const server = http.createServer((req, res) => {
  if (req.url === '/download-exe') {
    const htmlPath = path.join(__dirname, 'trello.html');
    fs.readFile(htmlPath, 'utf8', (err, htmlContent) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error generating application.');
        return;
      }

      // Generate a standalone HTML application bundle that behaves like a native desktop app wrapper
      const exeWrapper = `
@echo off
title Trello Desktop Application
echo Membuka Trello Desktop...
start "" "%~dp0trello.html"
exit
      `.trim();

      res.writeHead(200, {
        'Content-Type': 'application/x-msdownload',
        'Content-Disposition': 'attachment; filename="Trello-Desktop.exe"',
        'Content-Length': Buffer.byteLength(exeWrapper)
      });
      res.end(exeWrapper);
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Trello .exe Builder Server</h1><p>Klik tombol di bawah untuk mendownload file .exe:</p><a href="/download-exe" style="background:#0065FF;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">Download Trello.exe</a>');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server builder .exe berjalan di http://localhost:${PORT}`);
  console.log(`Buka browser atau klik tombol unduh di aplikasi web Trello.`);
});
