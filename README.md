# simple-reload
A simple reload lib for build tools

# Usage

```bash
# 安装
npm i light-reload --save-dev

```

Server端代码，一般用于构建工具

```javascript
const lightReload = require('light-reload');
lightReload.init([port]); // 提供websocket服务的端口，也是提供客户端文件的端口,如果不提供，默认是9107

//需要通知刷新的时候
lightReload.reload();
```

客户端如何使用

```html
<script src="http://localhost:9107/light-reload.js"></script>
<script>
	lightReload.init([port][,options]); //对应服务端的端口，不传递默认是9107
</script>
```

客户端结合 `webpack` 使用

```javascript
if(process.env === 'development'){
  require('light-reload/client');
  window.lightReload.init([port][,options]);
}
```

客户端 `options` 参数定义：

```
{
  maxReconnectCount: number, //最大重试次数，如果设置为0，则是不重试。不设置，一直重试。
  notifyMilliseconds: number, // 通知显示的毫秒数，默认为1000
  reconnectMilliseconds: number, // 重连时间毫秒数，默认为5000
  wsUrl: string // 要连接到的websocket服务，设置该参数后，port将会失效。该参数类似于： ws://localhost:9107/
}
```