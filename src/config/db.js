/*

In questo file si gestisce la connessione al database

*/
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import { getRequestContext } from './requestContext.js';

dotenv.config();

const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// genera il percorso della cartella dei log a seconda del sistema operativo (cambia tra \ e /) partendo dalla cwd
// in questo linguaggio tutto quello dopo || è un default
const logDir = path.resolve(process.cwd(), process.env.DB_LOG_DIR || 'logs');

function currentLogFile() {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return path.join(logDir, `db-${date}.log`);
}

async function ensureLogDir() {
    try {
        await mkdir(logDir, { recursive: true });
    } catch (e) {
        // ignore
    }
}

async function writeLog(entry) {
    try {
        await ensureLogDir();
        const file = currentLogFile();
        await appendFile(file, JSON.stringify(entry) + '\n');
    } catch (e) {
        // Non blocchiamo l'applicazione se il log fallisce
        console.error('DB log failed:', e.message);
    }
}

function escapeParam(p) {
    if (p === null || p === undefined) return 'NULL';
    if (typeof p === 'number' || typeof p === 'bigint') return String(p);
    if (typeof p === 'boolean') return p ? '1' : '0';
    // date
    if (p instanceof Date) return `'${p.toISOString()}'`;
    // buffer
    if (Buffer.isBuffer(p)) return `X'${p.toString('hex')}'`;
    // string - escape single quotes
    const s = String(p).replace(/'/g, "''");
    return `'${s}'`;
}

function formatQuery(sql, params) {
    try {
        if (!params) return sql;
        // positional params as array
        if (Array.isArray(params)) {
            let i = 0;
            return sql.replace(/\?/g, () => {
                if (i >= params.length) return '?';
                const out = escapeParam(params[i]);
                i++;
                return out;
            });
        }
        // object params - append as JSON for now
        if (typeof params === 'object') {
            return sql + ' /* params: ' + JSON.stringify(params) + ' */';
        }
        return sql;
    } catch (e) {
        return sql;
    }
}

function sanitizeHeaders(headers) {
    if (!headers) return null;
    const out = {};
    const sensitive = new Set(['authorization', 'cookie', 'set-cookie', 'x-api-key', 'x-client-secret', 'proxy-authorization']);
    for (const key of Object.keys(headers)) {
        try {
            if (sensitive.has(key.toLowerCase())) {
                // skip sensitive headers entirely
                continue;
            }
            out[key] = headers[key];
        } catch (e) {
            // fallback
            out[key] = '[UNAVAILABLE]';
        }
    }
    return out;
}

/**
 * Questo blocco di codice verrà eseguito ogni volta che si richiama la pool e scrive nel log le informazioni importanti
 */
const db = new Proxy(pool, {
    get(target, prop, receiver) {
        if (prop === 'query' || prop === 'execute') {
            return async function (sql, params) {
                const start = Date.now();
                try {
                    const res = await target[prop](sql, params);
                    const duration = Date.now() - start;
                    // log in background, non awaitare
                    const ctx = getRequestContext();
                    const fullQuery = formatQuery(sql, params);
                    writeLog({
                        timestamp: new Date().toISOString(),
                        method: prop,
                        full_query: fullQuery,
                        params: params,
                        who: ctx.user || null,
                        path: ctx.path || null,
                        ip: ctx.ip || null,
                        http_method: ctx.method || null,
                        headers: sanitizeHeaders(ctx.headers) || null,
                        duration_ms: duration,
                        success: true
                    }).catch(() => {});
                    return res;
                } catch (err) {
                    const duration = Date.now() - start;
                    const ctx = getRequestContext();
                    const fullQuery = formatQuery(sql, params);
                    writeLog({
                        timestamp: new Date().toISOString(),
                        method: prop,
                        full_query: fullQuery,
                        params: params,
                        who: ctx.user || null,
                        path: ctx.path || null,
                        ip: ctx.ip || null,
                        http_method: ctx.method || null,
                        headers: sanitizeHeaders(ctx.headers) || null,
                        duration_ms: duration,
                        success: false,
                        error: err.message
                    }).catch(() => {});
                    throw err;
                }
            };
        }
        return Reflect.get(target, prop, receiver);
    }
});

export { db };