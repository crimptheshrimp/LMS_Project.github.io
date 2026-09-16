import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targets = {
  html: {
    endpoint: 'https://validator.w3.org/nu/?out=json',
    files: ['public/index.html', 'LOGO_PREVIEW.html', 'SPEC_COMPARISON.html'],
  },
  css: {
    endpoint: 'https://jigsaw.w3.org/css-validator/validator?output=json&profile=css3',
    files: ['src/App.css', 'src/index.css'],
  },
};

const kind = process.argv[2];
if (!targets[kind]) {
  console.error('Usage: node scripts/validate-standards.mjs <html|css>');
  process.exit(1);
}

let failed = false;

for (const relativePath of targets[kind].files) {
  const filePath = resolve(root, relativePath);
  const source = await readFile(filePath, 'utf8');
  const content = kind === 'html' ? source.replaceAll('%PUBLIC_URL%', '.') : source;
  const isHtml = kind === 'html';
  const body = isHtml
    ? content
    : new URLSearchParams({ text: content });
  const response = await fetch(targets[kind].endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': isHtml ? 'text/html; charset=utf-8' : 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    console.error(`${relativePath}: validator request failed (${response.status})`);
    failed = true;
    continue;
  }

  const result = await response.text();
  if (kind === 'html') {
    const report = JSON.parse(result);
    const errors = report.messages.filter((message) => message.type === 'error');
    if (errors.length) {
      console.error(`${relativePath}: ${errors.length} W3C error(s)`);
      for (const error of errors) {
        console.error(`  ${error.lastLine ?? '?'}:${error.lastColumn ?? '?'} ${error.message}`);
      }
      failed = true;
    } else {
      console.log(`${relativePath}: W3C valid`);
    }
  } else if (result.includes('validity="true"') || result.includes('valid="true"')) {
    console.log(`${relativePath}: Jigsaw valid`);
  } else {
    console.error(`${relativePath}: Jigsaw reported CSS errors`);
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;