import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const csvUrl = new URL('./tasks.csv', import.meta.url);
const csvPath = fileURLToPath(csvUrl);

async function run() {
  try {
    const res = await fetch('http://localhost:3333/tasks');

    if (!res.ok) {
      console.error('Falha ao buscar tarefas:', res.status, await res.text());
      process.exit(1);
    }

    const tasks = await res.json();

    if (!Array.isArray(tasks)) {
      console.error('Resposta inválida: esperado um array de tarefas.');
      process.exit(1);
    }

    const escape = (v = '') => `"${String(v).replace(/"/g, '""')}"`;

    const header = 'id, title,description, created_at, completed_at\n';
    const rows = tasks.map((t) => `${escape(t.id)},${escape(t.title)},${escape(t.description)},${escape(t.created_at)},${escape(t.completed_at)}`);
    const csvContent = header + rows.join('\n') + (rows.length ? '\n' : '');

    fs.writeFileSync(csvPath, csvContent, { encoding: 'utf8' }); 
    console.log(`Exportadas ${tasks.length} tarefas para: ${csvPath}`);
  } catch (err) {
    console.error('Erro no processo:', err.message ?? err);
    process.exit(1);
  }
}

run();