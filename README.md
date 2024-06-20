# Next.js & NextUI Template

This is a template for creating applications using Next.js 13 (app directory) and NextUI (v2).

## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use


### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).



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
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev


docker build -t zooprocess-front .
docker run -p 3000:3001 zooprocess-front

http://niko.obs-vlfr.fr:3001


