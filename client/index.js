; (function (window) {
	var reconnectCount = 0;
	var RECONNECT_SECONDS = 5 * 1000; // 重连间隔时间
	var intervalId;
	var globalWssUrl;
	var util = {
		reconnect: function () {
			reconnectCount += 1;
			console.log('重连次数:', reconnectCount);
			ws = newWs();
		},

		handleError: function () {
			window.clearInterval(intervalId);
			intervalId = setInterval(function () {
				util.reconnect();
			}, RECONNECT_SECONDS);
		},

		handleMessage: function (evt) {
			var data = JSON.parse(evt.data);
			if (data && data.event === 'reload') {
				console.log('reload', new Date());
				window.location.reload();
			}
		},

		handleOpen: function () {
			window.clearInterval(intervalId);
		}
	};
	var newWs = function (wsUrl) {
		wsUrl = wsUrl || globalWssUrl;
		var ws = new WebSocket(wsUrl);
		ws.onopen = util.handleOpen;
		ws.onmessage = util.handleMessage;
		ws.onerror = ws.onclose = util.handleError;
		return ws;
	};

	window.lightReload = {
		init: function (port, options) {
			var defaultUrl;
			if (options && options.wsUrl) {
				defaultUrl = wsUrl;
			} else {
				if (port === undefined) {
					defaultUrl = 'ws://localhost:9107/';
				} else if (port <= 0 || port > 65535) {
					return console.error('lightReload: port must in [1~65535].');
				} else {
					defaultUrl = 'ws://localhost:' + port + '/';
				}
			}
			globalWssUrl = defaultUrl;
			newWs(defaultUrl);
		}
	};
})(window);
