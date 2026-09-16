import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const pythonCandidates = process.platform === 'win32'
  ? [resolve(root, '.venv/Scripts/python.exe'), resolve(root, 'venv/Scripts/python.exe'), 'python']
  : [resolve(root, '.venv/bin/python'), resolve(root, 'venv/bin/python'), 'python3', 'python'];
const python = pythonCandidates.find((candidate) => candidate === 'python' || candidate === 'python3' || existsSync(candidate));

const result = spawnSync(python, [resolve(root, 'backendLms/manage.py'), 'test'], {
  cwd: resolve(root, 'backendLms'),
  env: { ...process.env, DJANGO_DEBUG: 'True' },
  stdio: 'inherit',
});

if (result.error) {
  console.error(`Unable to run Django tests: ${result.error.message}`);
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}