module.exports = {
  apps: [
    {
      name: "streamer_app",
      script: "/data/data/com.termux/files/usr/share/streamer/app.js",
      watch: true,
      env: {
        "PORT": 33333,
        "STREAMS": "/data/data/com.termux/files/usr/tmp/streams.json"
      },
      ignore_watch: [
        "node_modules",
        "settings.json",
        "\\.git",
        "*.log"
      ]
    }
  ]
};