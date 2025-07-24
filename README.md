# ZooProcess v10 the front part

### Install dependencies

```bash
npm install --legacy-peer-deps
```

# configuration

- rename .env.example to .env.local
- adapt the value to your environment
- generate your secret key AUTH_SECRET with

```bash
openssl rand -base64 32 | tr -d '='
```

### Run the development server

```bash
npm run dev
```

# Issues

https://github.com/vercel/next.js/issues/58295

`x-forwarded-host` header with value `localhost:3001` does not match `origin` header with value `imev:3001` from a forwarded Server Actions request. Aborting the action.

serverActions: { allowedOrigins: ["xxxx.com", "localhost:3001"], }

# Connect to the interface

localhost:3001/auth/login
http://zooprocess.imev-mer.fr:3001/auth/login

seb@seb.com
seb1234

# docker

docker build -t zooprocessv10-docker .

# simply Dockerfile

FROM node:18

WORKDIR /app
COPY package\*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD npm run dev

docker build -t zooprocess-front .
docker run -p 3000:3001 zooprocess-front

http://niko.obs-vlfr.fr:3001

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).

## Code Formatting

This project uses Prettier for code formatting with a configuration that enforces a consistent style across the codebase.

### Configuration

- 2-space indentation
- Single quotes for strings
- Semicolons at the end of statements
- 100 character line length
- Trailing commas in objects and arrays (ES5 style)

### Commands

- `npm run format`: Format all files according to the Prettier configuration
- `npm run format:check`: Check if files are formatted correctly without making changes

### Editor Integration

For the best development experience, install the Prettier extension for your editor:

- VS Code: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- WebStorm/IntelliJ IDEA: Enable Prettier in Settings > Languages & Frameworks > JavaScript > Prettier

### Pre-commit Hook (Optional)

For teams, it's recommended to set up a pre-commit hook using Husky and lint-staged to automatically format files before committing.
