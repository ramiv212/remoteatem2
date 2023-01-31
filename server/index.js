import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(cors())

var corsOptions = {
    origin: 'http://localhost:5173/',
    methods: ["GET"],
    optionsSuccessStatus: 200,
  }

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
      } 
    });


app.get('/', cors(corsOptions), function (req, res, next) {
    return
  })


io.on("connection", (socket) => {
  console.log(socket.id)
});



console.log('Running on port 3000')
httpServer.listen(3000);