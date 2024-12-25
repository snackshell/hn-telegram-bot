# HN News Telegram Bot

A Telegram bot that sends daily top stories from Hacker News to configured Telegram channels and groups.

## Features

- 📰 Fetches top stories from Hacker News
- ⏰ Sends daily updates at 8:00 AM EAT (Ethiopia/Addis Ababa time)
- 💬 Supports multiple Telegram channels and group topics
- 🤖 Responds to commands like `/getnews` and `/help`

## Commands

- `/start` - Welcome message and bot introduction
- `/getnews` - Get latest top Hacker News stories
- `/help` - Show available commands and information

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_DESTINATIONS=@channel1,@group1@topic1,@channel2
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## Environment Variables

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from [@BotFather](https://t.me/BotFather)
- `TELEGRAM_DESTINATIONS`: Comma-separated list of destinations
  - For channels/groups: `@channelname`
  - For topic threads: `@groupname@topicid`

## Project Structure

```
├── src/
│   ├── config/
│   │   └── config.js          # Configuration setup
│   ├── services/
│   │   ├── hnService.js       # Hacker News API integration
│   │   └── messageService.js  # Telegram message handling
│   ├── utils/
│   │   ├── logger.js         # Logging utility
│   │   ├── messageFormatter.js # Message formatting
│   │   └── scheduler.js      # Scheduling utility
│   └── index.js              # Main bot file
├── .env
├── .gitignore
├── package.json
└── README.md
```

## License

MIT
