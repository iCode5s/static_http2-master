module.exports = {
    root: process.cwd(),
    httphost: "127.0.0.1",
    port: 6363,
    compress: /\.(html|js|css|md)/,
    cache: {
        maxAge: 600,
        expires: true,
        cacheControl: true,
        lastModified: true,
        etag: true,
    }
}
