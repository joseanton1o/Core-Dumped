const { createProxyMiddleware } = require('http-proxy-middleware');

// Approach to proxying requests changed, as it was not working from the package.json file
// found this here: https://stackoverflow.com/questions/52605997/when-specified-proxy-in-package-json-must-be-a-string/67335451#67335451
module.exports = function(app) {
    app.use(
        '/users',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
        })
    );
}