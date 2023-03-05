const { createProxyMiddleware } = require('http-proxy-middleware');

// Approach to proxying requests changed, as it was not working from the package.json file
module.exports = function(app) {
    app.use(
        '/users',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );
}