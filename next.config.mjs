const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors https://my.geotab.com https://*.my.geotab.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
