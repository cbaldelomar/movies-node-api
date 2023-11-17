# movies-node-api
REST API using Node.js and Typescript with:
- Express
- MySql
- Sequelize

## Add typescript

### Config

1. Install `typescript` local

```bash
npm install typescript -D
```

2. Add to `package.json` scripts

```json
"tsc": "tsc"
```

3. Init `tsconfig.json`

```bash
npm run tsc -- --init
```

### Auto compile and watch

1. Install `ts-node-dev`

```bash
npm install ts-node-dev -D
```

2. Add to `package.json` scripts

```json
"dev": "ts-node-dev src/app.ts"
```

_Change `src/app.ts` with your app entry point._

Now you can use `npm run dev` to compile and run your app.