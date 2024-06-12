//step to produce ts be project

1. npm init -y
2. npm i typescript --save-dev
3. npx tsc --init
4. npm i @types/node --save-dev
5. npm i express && npm i @types/express --save-dev
6. npm i ts-node nodemon --save-dev
7. create src folder and index.ts file
8. type this script below in index.ts
   import express from 'express';
   const app = express();
   app.get('/', (req, res) => {
   res.send('Working');
   });
   app.listen(3000, ()=> console.log('App running on port 3000!'));

9. create nodemon.json file on root folder and type this script below
   {
   "watch": ["src"],
   "ext": ".js,.ts",
   "exec": "npx ts-node ./src/index.ts"
   }

10. add this to package.json
    "scripts": {
    ...,
    "start": "npx nodemon"
    },

//steps to install prisma orm

1. npm i prisma @prisma/client
2. npx prisma init
3. change in schema.prisma
   datasource db {
   provider = "mysql" --based on what dbms u use
   ...
   }
4. edit .env
   dbms://username:password@localhost:port/databasename
