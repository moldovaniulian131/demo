const base = require('./config/serverless/base');

const functions = {
	'5eac57326f5a6e001229c662': {
		handler: 'src/routers/index.serverlessHandler',
		warmup: true,
		timeout: 30,
		events: [
			{
				http: {
					path: '/{any+}',
					method: 'ANY',
					cors: {
						origin: '${self:custom.allowedOrigins}',
						headers: '${self:custom.allowedHeaders}',
					},
				},
			},
		],
	},
};

module.exports = Object.assign({}, base, { functions });
