# Descrição do Projeto — Desafio Fundamentos Node.js (Rocketseat)

Este repositório contém uma pequena API de tarefas implementada em Node.js puro (sem frameworks), acompanhada de utilitários e um script para exportar tarefas para CSV.

## O que implementei

- Servidor HTTP usando `node:http` (`src/server.js`).
- Middleware para ler e parsear o corpo JSON das requisições (`src/middlewares/json.js`).
- Roteamento simples baseado em expressões regulares e utilitário para construir rotas com parâmetros (`src/routes.js`, `src/utils/build-route-path.js`).
- Extração de query params (`src/utils/extract-query-params.js`).
- Banco de dados simples baseado em arquivo JSON (`src/database.js`, `src/db.json`) com métodos: `select`, `insert`, `update`, `delete` e persistência em disco.
- Endpoints REST para gerenciar tarefas (`GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`, `PATCH /tasks/:id/complete`).
- Script `streams/import-csv.js` para exportar as tarefas do endpoint `/tasks` para `streams/tasks.csv`.

## Como funciona (resumo técnico)

- O servidor escuta na porta `3333` e passa cada requisição pelo middleware `json` para popular `req.body`.
- As rotas são definidas em `src/routes.js` com `method`, `path` (regex gerada por `BuildRoutePath`) e `handler` que recebe `(req, res, database)`.
- `Database` carrega `src/db.json` na inicialização (ou cria o arquivo se não existir) e persiste alterações com `fs.writeFile`.
- O script `streams/import-csv.js` faz uma requisição `fetch('http://localhost:3333/tasks')`, transforma o JSON em CSV (tratando aspas) e grava em `streams/tasks.csv` usando `fs.writeFileSync`.

## Competências e conceitos aplicados

- Node.js native APIs:
  - `http` para servidor (entendimento do ciclo de requisição/resposta).
  - `fs` / `fs/promises` para leitura/escrita de arquivos e persistência.
  - `url` e `path` para resolução de caminhos e compatibilidade com módulos ES.
  - `crypto.randomUUID()` para geração de IDs únicos.

- Processamento de requisições e middlewares:
  - Implementação de um middleware de parsing de JSON via leitura de stream.
  - Uso de `req`/`res` sem frameworks, manipulando headers, status e corpo manualmente.

- Roteamento e Expressões Regulares:
  - Criação de rotas com parâmetros dinâmicos e captura de query string.
  - Construção de regex para casar rotas com `BuildRoutePath` e extração de `req.params` e `req.query`.

- Persistência simples e modelagem:
  - CRUD básico em arquivo JSON com sincronização para disco (`persist`).
  - Filtragem/Busca básica em `select` com busca por título/descrição.

- Tratamento de erros e validações:
  - Validações de entrada em `POST`/`PUT` (title/description obrigatórios).
  - Retorno de códigos HTTP apropriados (200/201/204/400/404).

- Streams e integração:
  - Script que consome API via `fetch` e escreve CSV (manipulação de strings, escaping para CSV).

## Possíveis melhorias

- Tratar melhor datas (usar ISO 8601 internamente e formatar na camada de apresentação).
- Adicionar testes unitários e de integração.
- Melhorar tratamento de erros e mensagens consistentes.
- Implementar filtros/paginação no `GET /tasks`.
- Usar uma biblioteca para manipulação de CSV (ex.: `csv-stringify`/`csv-parse`) se necessário.

## Como testar

1. Inicie o servidor:

```powershell
npm run dev
```

2. Crie tarefas via POST (ex.: usar `curl` ou Postman) e veja `src/db.json` sendo atualizado.

3. Exporte para CSV executando o script (com o servidor rodando):

```powershell
node streams/import-csv.js
```

o arquivo `streams/tasks.csv` será criado/atualizado com as tarefas.

---

Arquivo gerado automaticamente com base no código presente no repositório.
