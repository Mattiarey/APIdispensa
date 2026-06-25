import { writeLog } from './logger.js';
import { getRequestContext } from './requestContext.js';

export const httpLogger = (req, res, next) => {
    const start = Date.now();

    // L'evento 'finish' scatta alla fine del ciclo di vita della richiesta,
    // quando il controller ha già inviato il res.status() e il token è stato verificato.
    res.on('finish', () => {
        const duration = Date.now() - start;
        const ctx = getRequestContext() || {};

        writeLog({
            type: "HTTP",
            timestamp: new Date().toISOString(),
            ip: ctx.ip || req.ip,
            who: ctx.user || null,
            action: req.method,
            path: req.originalUrl || req.path,
            http_status: res.statusCode, // Qui catturiamo il 404, 403, 200, ecc.
            duration_ms: duration,
            user_agent: req.headers['user-agent'] || null
        }).catch(() => {});
    });

    next();
};