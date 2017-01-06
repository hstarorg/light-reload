const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocketServer = require('ws').Server;

let server = null;
let wss = null;

const init = (port, options) => {
	port = port || 9107; // 默认9107
	server = http.createServer();
	wss = new WebSocketServer({ server });
	wss.on('connection', ws => {
		ws.send(JSON.stringify({ event: 'connected', data: null }));
	});
	server.on('request', (req, res) => {
		if (req.url === '/light-reload.js') {
			res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
			res.write(fs.readFileSync(path.join(__dirname, './../client/index.js'), 'utf8'))
			res.end();
		} else {
			res.end();
		}
	});
	return new Promise((resolve, reject) => {
		server.listen(port, err => {
			if (err) {
				return reject(err);
			}
			resolve(server);
		});
	});
};

const reload = () => {
	if (!wss) {
		return;
	}
	wss.clients.forEach(client => {
		client.send(JSON.stringify({ event: 'reload', data: null }));
	});
};

module.exports = {
	init,
	reload
};
