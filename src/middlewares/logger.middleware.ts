export function loggerMiddleware(req, res, next) {
    console.log('Request masuk');
    next();
}