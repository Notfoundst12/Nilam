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
  }, {
    name: "ai-factory",
    script: "ai_book_generator.py",
    interpreter: "python3",
    instances: 1,
    exec_mode: "fork",
    cron_restart: "0 */6 * * *", // Runs every 6 hours automatically
    autorestart: false, // Don't run continuously, just run when cron triggers
    error_file: "logs/ai-error.log",
    out_file: "logs/ai-out.log",
    time: true
  }]
}