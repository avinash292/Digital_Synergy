const express = require("express");
const { port } = require("./config");
// const db = require('./db');
const routes = require("./routes/routes");
const frontRoutes = require("./routes/frontRoutes");

const corsMiddleware = require("./middlewares/cors");
const auth = require("./middlewares/auth");
const multiLogin = require("./middlewares/multiLogin");

const { handleError } = require("./helpers/errorhandler");

const relations = require("./relations");
const socketIo = require('socket.io');
const http = require('http');
// const permissions 		= require('./middlewares/permissions');

function main() {
	const cors = require("cors");
	var app = express();
	const server = http.createServer(app);
	const io = socketIo(server, {
	    cors: {
	        origin: '*',
	    },
	});
	io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast message to all clients
    });
});
	app.use(cors());

	app.use(express.json({ limit: "400mb" }));
	app.use(express.urlencoded({ limit: "400mb", extended: false }));

	app.use(corsMiddleware.corsEnable);
	app.use(auth.checkToken);
	app.use(multiLogin.check);

	app.use("/", routes); // Common routing file
	app.use("/front/", frontRoutes); // Common frontend routing file

	app.use((err, req, res, next) => {
		// Always use the end of other middlewares and routes for it to function correctly
		handleError(err, res);
	});
	const PORT = process.env.PORT || 8080;
	server.listen(PORT, () => {
		console.log("API server started on: " + PORT);
	});
}

main();
