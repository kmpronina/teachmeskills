const http = require("http");
const { resolve } = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;

function createSend(req, res, start) {
  return (status, body, headers = {}) => {
    const payload = typeof body === "string" ? body : JSON.stringify(body);

    const isJSON = typeof body === "object";
    res.writeHead(status, {
      "Content-type": isJSON ? "application/json" : "text/html",
      ...headers,
    });
    res.end(payload);

    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${status} duration:${duration}ms`);
  };
}

const readBody = (req) => {
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;

      if (data.length > 1e6) {
        req.connection.destroy();
        reject(new Error("payload is too large"));
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", () => reject);
  });
};

const server = http.createServer(async (req, res) => {
  const start = Date.now();
  const send = createSend(req, res, start);

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = url;

    if (req.method === "GET" && pathname === "/") {
      return send(
        200,
        `
        <html>
         <head><title>NODEJS SERVER</title></head>
         <body>
          <h1>node.js server</h1>
         </body>
        </html>
        `
      );
    }

    if (req.method === "GET" && pathname === "/about") {
      return send(
        200,
        `
          <html>
           <head><title>ABOUT</title></head>
           <body>
            <h1>about node.js server</h1>
           </body>
          </html>
          `
      );
    }

    if (req.method === "GET" && pathname === "/time") {
      return send(200, {
        now: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }

    if (req.method === "GET" && pathname === "/random") {
      const min = parseInt(searchParams.get("min"));
      const max = parseInt(searchParams.get("max"));

      if (Number.isNaN(min) || Number.isNaN(max)) {
        send(400, { error: "Invalid type. MIN and MAX should be numbers" });
      }

      if (min < 10 || min > 20 || max < 10 || max > 20) {
        send(400, { error: "MIN and MAX must be between 10 and 20" });
      }

      const random = Math.floor(Math.random() * (max - min + 1) + min);

      return send(200, { random });
    }

    if (req.method === "POST" && pathname === "/echo") {
      const raw = await readBody(req);

      let json = null;

      try {
        json = raw ? JSON.parse(raw) : {};
      } catch {
        return send(404, { error: "Invalid JSON" });
      }

      return send(201, {
        received: json,
        headers: req.headers,
        method: req.method,
      });
    }

    send(404, { error: "Not found" });
  } catch (err) {
    console.error(err);

    send(500, { error: "Internal Server Error" });
  }
});

server.listen(PORT, () => {
  console.log(`Sever is running on http://localhost:${PORT}`);
});

const shutdown = () => {
  console.log("/n Server is shutting down");

  server.close(() => {
    console.log("Server stopped");
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 5000).unref();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
