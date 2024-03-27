```
npm install

rename .example.env to .env and add your database url
update wrangler.toml and add your accelerate url in [vars]

migrate database with         npx prisma migrate
generate prisma client with   npx prisma generate

npm run dev
```
