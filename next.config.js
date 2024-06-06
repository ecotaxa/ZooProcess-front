/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // serverActions: { allowedOrigins: ["imev:3001", "192.168.1.159:3001", "localhost:3001"], },
    experimental: {
        serverActions: {
            allowedOrigins: ["imev:3001", "192.168.1.159:3001", "localhost:3001", "zooprocess.imev-mer.fr:3001", "localhost:8000" ],
        },
    },
    output: "standalone"
}

module.exports = nextConfig

// module.exports = {
//     experimental: {
//         serverActions: {
//             allowedOrigins: ["demo.example.com:3000"],
//         },
//     },
// }
