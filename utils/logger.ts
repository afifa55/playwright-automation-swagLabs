import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(__dirname, '..', 'logs', 'test-run.log');

function testName(): string {
  try {
    return test.info().title;
  } catch {
    return 'global';
  }
}

function write(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
  const line = `${new Date().toISOString()} [${level}] [${testName()}] ${message}`;
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.appendFileSync(logFile, line + '\n');
  const out = level === 'ERROR' ? console.error : level === 'WARN' ? console.warn : console.log;
  out(line);
}

export const logger = {
  info: (message: string) => write('INFO', message),
  warn: (message: string) => write('WARN', message),
  error: (message: string) => write('ERROR', message),
};
