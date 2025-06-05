const http = require('http');
const fs = require('fs');
const exec = require("child_process").exec;
const subtxt = './.npm/sub.txt'; 
const PORT = process.env.PORT || 3000; 

// 修改后的启动逻辑 - 移除了chmod操作
const child = exec('bash start.sh', (error) => {
  if (error) {
    console.error(`Failed to execute start.sh: ${error}`);
    return;
  }
});

child.stdout.on('data', (data) => {
  console.log(data);
});

child.stderr.on('data', (data) => {
  console.error(data);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  console.clear();
  console.log(`App is running`);
});

// create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello world!');
  }
  
  // get-sub
  if (req.url === '/sub') {
    fs.readFile(subtxt, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error reading sub.txt' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
