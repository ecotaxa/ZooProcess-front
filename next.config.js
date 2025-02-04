/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://nextjs.org/docs/pages/api-reference/next-config-js/reactStrictMode
    // reactStrictMode: false,
    reactStrictMode: true,
    // serverActions: { allowedOrigins: ["imev:3001", "192.168.1.159:3001", "localhost:3001"], },
    experimental: {
        serverActions: {
            allowedOrigins: ["imev:3001", "192.168.1.159:3001", "localhost:3001", "zooprocess.imev-mer.fr:3001", "zooprocess.imev-mer.fr:8000","localhost:8000" ],
        },
        forceSwcTransforms: true, // use SWC despite the presence of a .babelrc. SWC is up to 17x faster than Babel when compiling individual files. https://nextjs.org/docs/messages/swc-disabled
    },
    output: "standalone",

    // cache options
    // cacheHandler: require.resolve('./cache-handler.js'),
    // cacheMaxMemorySize: 0, // disable default in-memory caching
}

module.exports = nextConfig

// module.exports = {
//     experimental: {
//         serverActions: {
//             allowedOrigins: ["demo.example.com:3000"],
//         },
//     },
// }
