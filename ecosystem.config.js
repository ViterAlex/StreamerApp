module.exports = {
  apps: [
    {
      name: "streamer_app",
      script: "/data/data/com.termux/files/usr/share/streamer/app.js",
      log_date_format: "YYYY-MM-DD HH:mm:ss,SSS",
      watch: false,
      env: {
        "PORT": 33333
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