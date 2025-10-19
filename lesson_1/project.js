const http = require("http");
const fs = require("fs");
const { Transform, pipeline } = require("stream");
const eventEmitter = require("events");

const PORT = 3000;

class UpperCaseStream extends Transform {
  _transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
}

const upper = new UpperCaseStream();

class Logger extends eventEmitter {
  log(message) {
    console.log(`[INFO]: ${message}`);
    this.emit("info", message);
  }
  error(message) {
    console.error(`[ERROR]: ${message}`);
    this.emit("error", message);
  }
  warn(message) {
    console.warn(`[WARN]: ${message}`);
    this.emit("warn", message);
  }
}

const logger = new Logger();

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    logger.log("Request received");

    res.writeHead(200, { "content-type": "text/plain, charset = utf-8" });

    const src = fs.createReadStream("data.txt");

    pipeline(src, upper, res, (err) => {
      if (err) {
        logger.error(`Pipeline error: ${err.message}`);

        if (!res.headersSent) {
          logger.error("No headers received");

          res.writeHead(500, { "content-type": "text/plain, charset=utf-8" });
        }

        if (!res.writableEnded) {
          logger.error("File processing error");

          res.end("File processing error");
        }
      }
    });
  } else {
    logger.error("Unprocessable method or url");

    res.writeHead(404, { "content-type": "text/plain, charset=utf-8" });
    res.end("NOT FOUND");
  }
});

server.listen(PORT, () => {
  logger.log("Server is running", PORT);
});
