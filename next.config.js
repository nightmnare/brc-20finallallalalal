/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["bitmap-img.magiceden.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.coinranking.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/unisat/:slug*",
        destination: "https://api.unisat.io/query-v4/brc20/:slug*",
      },
      {
        source: "/coinranking/:slug*",
        destination: "https://coinranking.com/api/:slug*", // api-coinranking
      },
      {
        source: "/api-coinranking/:slug*",
        destination: "https://api.coinranking.com/:slug*",
      },
      {
        source: "/blocks/:slug*",
        destination: "https://blockchain.info/:slug*",
      },
      {
        source: "/ipfs/:slug*",
        destination: "https://ipfs.io/ipfs/:slug*",
      },
      {
        source: "/1inch/:slug*",
        destination: "https://api.1inch.io/v5.0/:slug*",
      },
      {
        source: "/ordinalswallet/:slug*",
        destination: "https://turbo.ordinalswallet.com/:slug*",
      },
      {
        source: "/magiceden/:slug*",
        destination: "https://api-mainnet.magiceden.dev/:slug*"
      },
      {
        source: "/geniidata/:slug*",
        destination: "https://www.geniidata.com/:slug*"
      },
      {
        source: "/geniidata-api/:slug*",
        destination: "https://api.geniidata.com/api/:slug*"
      }
    ];
  },
};

module.exports = nextConfig;
