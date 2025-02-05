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



# configuration
+ rename .env.example to .env.local
+ adapt the value to your environment
+ generate your secret key AUTH_SECRET with 
```bash
openssl rand -base64 32 | tr -d '='
```







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




# DOC Fraction
Jean-Olivier IRISSON
Réponse d’amanda sur « fraction »
sur zooprocess  FracID = d1 ou d2 Franc min = tamis min et Fracmax = tamis max
motoda = acq_sub_part
dans notre jargon de tous le jours on parle aussi pas mal de split pour d1/d2 et de fractionnement pour la motoda
d1/d2 est une création de 2 sous échantillons comptabilisant la totalité du prélèvement
la motoda, elle nous permet d'obtenir une fraction de l'échantillon
une fraction = "un bout de", donc oui on peut dire que c'est identique car la d1 est un bout de... mais c'est vrai que en formation moi j'essai quand même de bien expliquer la diff
Donc c’est finalement un peu flou aussi.
En anglais, je dirais « size fraction(ing) » pour d1/d2 et « subsampl(ing) » pour la motoda ou la pipette.
Pour le BODC (vocabulaire contrôlé) : http://vocab.nerc.ac.uk/collection/P01/current/SSAMPC01/