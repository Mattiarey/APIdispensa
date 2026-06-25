import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const logDir = path.resolve(process.cwd(), process.env.DB_LOG_DIR || 'logs');

async function ensureLogDir() {
    try {
        await mkdir(logDir, { recursive: true });
    } catch (e) {
        // Ignorato silenziosamente
    }
}

export async function writeLog(entry) {
    try {
        await ensureLogDir();
        const date = new Date().toISOString().slice(0, 10);
        const file = path.join(logDir, `audit-${date}.log`);
        await appendFile(file, JSON.stringify(entry) + '\n');
    } catch (e) {
        console.error('Scrittura log fallita:', e.message);
    }
}