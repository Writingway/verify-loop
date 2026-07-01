import { execSync } from 'node:child_process';

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  const file = JSON.parse(raw)?.tool_input?.file_path;
  if (file && /\.(ts|js|json|md)$/.test(file)) {
    try {
      execSync(`npx prettier --write "${file}"`, { stdio: 'ignore' });
    } catch {}
  }
});
