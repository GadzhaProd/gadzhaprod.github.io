// Проставляет версию каждому локальному ассету в index.html: ?v=<хеш содержимого>.
// Файл изменился — адрес изменился — браузер скачает новую версию, а не отдаст старую из кэша.
// Запускается на GitHub Actions перед выкладкой; локальный index.html при этом не трогается.
// Вручную: node scripts/stamp-assets.mjs

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const page = resolve(root, 'index.html');

const html = readFileSync(page, 'utf8');
const changed = [];

const stamped = html.replace(
  /(\b(?:href|src)=")(assets\/[^"?#]+)(\?[^"#]*)?(#[^"]*)?"/g,
  (whole, attr, path, _query, hash = '') => {
    let version;
    try {
      version = createHash('sha256').update(readFileSync(resolve(root, path))).digest('hex').slice(0, 8);
    } catch {
      console.warn(`пропущен ${path}: файла нет на диске`);
      return whole;
    }
    changed.push(`${path} -> v=${version}`);
    return `${attr}${path}?v=${version}${hash}"`;
  },
);

if (stamped !== html) writeFileSync(page, stamped);
console.log(changed.length ? changed.join('\n') : 'ассетов не найдено');
