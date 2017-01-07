; (function (window) {
  var reconnectCount = 0;
  var RECONNECT_MILLISECONDS = 5000; // 重连间隔时间
  var intervalId;
  var reloadTimeoutId;
  var globalWssUrl;
  var maxReconnectCount = Number.MAX_SAFE_INTEGER; // 最大重连次数
  var NOTIFY_MILLISECONDS = 1000;
  var util = {
    reconnect: function () {
      reconnectCount += 1;
      if (maxReconnectCount < reconnectCount) {
        return;
      }
      console.log('重连次数:', reconnectCount);
      ws = newWs();
    },

    handleError: function () {
      window.clearInterval(intervalId);
      intervalId = setInterval(function () {
        util.reconnect();
      }, RECONNECT_MILLISECONDS);
    },

    handleMessage: function (evt) {
      var data = JSON.parse(evt.data);
      if (data && data.event === 'reload') {
        util.executeReload();
      }
    },

    handleOpen: function () {
      window.clearInterval(intervalId);
    },

    executeReload: function () {
      util.notify();
      window.clearTimeout(reloadTimeoutId);
      reloadTimeoutId = window.setTimeout(function () {
        window.location.reload();
      }, NOTIFY_MILLISECONDS);
    },

    setStyles: function (el, styleObj) {
      Object.keys(styleObj)
        .forEach(function (p) {
          el.style[p] = styleObj[p];
        });
    },

    notify: function () {
      var div = document.createElement('div');
      util.setStyles(div, {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        height: '30px',
        lineHeight: '30px',
        textAlign: 'center',
        zIndex: '99999999',
        background: 'green',
        color: 'yellow'
      });
      div.innerText = 'The program is about to refresh...';
      document.body.appendChild(div);
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
      if (options) {
        if (options.notifyMilliseconds) {
          NOTIFY_MILLISECONDS = options.notifyMilliseconds;
        }
        if (options.maxReconnectCount >= 0) {
          maxReconnectCount = options.maxReconnectCount;
        }
        if (options.reconnectMilliseconds) {
          RECONNECT_MILLISECONDS = options.reconnectMilliseconds;
        }
      }
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
