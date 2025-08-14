import { randomUUID } from 'node:crypto';
import { BuildRoutePath } from './utils/build-route-path.js';
import { error } from 'node:console';

export const Routes = [
    {
        method: 'GET',
        path: BuildRoutePath('/tasks'),
        handler: (req, res, database) => {
            const { search } = req.query;

            const tasks = database.select('tasks', {
                title: search,
                description: search
            });
            
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: BuildRoutePath('/tasks'),
        handler: (req, res, database) => {
            if (req.body && typeof req.body === 'object') {
                const { title, description } = req.body;

                if (!title || !description) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Título e descrição são obrigatórios.' }));
                }

                const [day, month, year] = new Date().toLocaleDateString('pt-BR').split('/').map(Number);

                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: `${day}/${month}/${year}`,
                    updated_at: `${day}/${month}/${year}`
                };

                database.insert('tasks', task);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Tarefa criada com sucesso.', task }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Título e descrição são obrigatórios.' }));
            }
        }
    },
    {
        method: 'PUT',
        path: BuildRoutePath('/tasks/:id'),
        handler: (req, res, database) => {
            const { id } = req.params;
            if (!req.body || typeof req.body !== 'object') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Corpo da requisição inválido.' }));
}
            const { title, description } = req.body;

            database.update('tasks', id, { title, description });

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: BuildRoutePath('/tasks/:id'),
        handler: (req, res, database) => {
            const { id } = req.params;

            database.delete('tasks', id);

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: BuildRoutePath('/tasks/:id/complete'),
        handler: (req, res, database) => {
            const { id } = req.params;

            const [task] = database.select('tasks', { id });

            if (!task) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Tarefa não encontrada.' }));
            }

            const isTaskCompleted = !!task.completed_at;

            let completed_at = null;
            if (!isTaskCompleted) {
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                completed_at = `${day}/${month}/${year}`;
            }

            const now = new Date();
            const updated_day = String(now.getDate()).padStart(2, '0');
            const updated_month = String(now.getMonth() + 1).padStart(2, '0');
            const updated_year = now.getFullYear();
            const updated_at = `${updated_day}/${updated_month}/${updated_year}`;

            const updatedTask = { ...task, completed_at, updated_at };

            database.update('tasks', id, updatedTask);

            return res.writeHead(204).end();
        }
    }
];   