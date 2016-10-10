require('dotenv').load({ path: __dirname + '/env' });
let node_env = process.env.NODE_ENV || 'development';
let isProd = node_env === 'production';
let user = process.env.USER;
let port = process.env.PORT;
let domain = process.env.DOMAIN;
let maxPort = 65535;

let getTestPort = function () {
	let ms = user + domain;
	for(let i = 0; i < ms.length; i++){
		port = parseInt(port) + parseInt(ms.charAt(i).charCodeAt());
	}

	if( port > maxPort ) {
		port = Math.ceil(Math.random() * maxPort);
	}

	return port;
};

module.exports = {
	port: isProd ? port : getTestPort(),
	user: user,
	domain: domain,
	node_env: node_env,
	env: process.env,
	isProd: isProd
};