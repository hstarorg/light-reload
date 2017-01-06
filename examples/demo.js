const lightReload = require('./../');

lightReload.init()
	.then(server => {
		console.log('妥了~');

		setInterval(() => {
			lightReload.reload();
		}, 5000);
	})
	.catch(reason => console.log('出错啦！', reason));
