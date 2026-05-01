module.exports = {
  apps: [{
    name: "nilam-bot",
    script: "nilam_bot.py",
    interpreter: "python3",
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: "logs/bot-error.log",
    out_file: "logs/bot-out.log",
    time: true
  }]
}
