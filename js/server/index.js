const http = require("http");
const register = require("./handlers/register");
const ranking = require("./handlers/ranking");
const join = require("./handlers/join");
const notify = require("./handlers/notify");
const PORT = 9047;

class Server {
  constructor() {}

  getServer() {
    return this.server;
  }

  initServer() {
    this.server = http.createServer((request, response) => {
      switch (request.method) {
        case "GET":
          this.handleGET(request, response);
          break;
        case "POST":
          let body = "";
          request.on("data", (chunk) => {
            body += chunk;
          });
          request.on("end", () => {
            this.handlePOST(request, response, body);
          });
          break;
        case "OPTIONS":
          response.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
          });
          response.end();
          break;
        default:
          response.writeHead(404, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
          });
          response.end();
          break;
      }
    });
  }

  listen(PORT) {
    this.server.listen(PORT);
  }

  handleGET(req, res) {
    const url = req.url.split("?")[0];
    switch (url) {
      case "/update":
        handleUpdate();
        break;
      default:
        const error = {
          error: "Invalid GET Request",
        };
        res.writeHead(404, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(error), () => {
          res.end();
        });
    }
  }

  handlePOST(req, res, body) {
    const url = req.url.split("?")[0];
    let response;
    switch (url) {
      case "/join":
        response = join.handleJoin(body);
        res.writeHead(response[1], {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(response[0]), () => {
          res.end();
        });
        break;
      case "/leave":
        handleLeave();
        break;
      case "/notify":
        response = notify.handleNotify(body);
        res.writeHead(response[1], {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(response[0]), () => {
          res.end();
        });
        break;
      case "/ranking":
        response = ranking.handleRanking();
        res.writeHead(response[1], {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(response[0]), () => {
          res.end();
        });
        break;
      case "/register":
        console.log(body);
        response = register.handleRegister(body);
        res.writeHead(response[1], {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(response[0]), () => {
          res.end();
        });
        break;
      default:
        const error = {
          error: "Invalid POST Request",
        };
        res.writeHead(404, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
        });
        res.write(JSON.stringify(error), () => {
          res.end();
        });
    }
  }
}

const server = new Server();
server.initServer();
server.listen(PORT);
