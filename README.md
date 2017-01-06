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
lightReload.init(port); // 提供websocket服务的端口，也是提供客户端文件的端口

//需要通知刷新的时候
lightReload.reload();
```

客户端如何使用？

```html
<script src="http://localhost:9107/light-reload.js"></script>
<script>
	lightReload.init(port); //对应服务端的端口，不传递默认是9107
</script>
```