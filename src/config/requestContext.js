import { AsyncLocalStorage } from 'async_hooks';

const als = new AsyncLocalStorage();

export function contextMiddleware(req, res, next) {
    const ctx = {
        user: (req.user && req.user.id) || req.headers['x-user-id'] || null,
        ip: req.ip || req.connection?.remoteAddress || null,
        path: req.originalUrl || req.url,
        method: req.method || null,
        headers: req.headers || {}
    };
    als.run(ctx, () => next());
}

export function getRequestContext() {
    return als.getStore() || {};
}

export default { contextMiddleware, getRequestContext };
