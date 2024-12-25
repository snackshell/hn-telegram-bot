const TelegramBot = require('node-telegram-bot-api');
const { config } = require('./config/config');
const { fetchTopStories } = require('./services/hnService');
const { formatStoryMessage } = require('./utils/messageFormatter');
const { logger } = require('./utils/logger');
const { sendToDestinations } = require('./services/messageService');
const { scheduleDaily } = require('./utils/scheduler');

// Initialize bot
const bot = new TelegramBot(config.botToken, { polling: true });

// Command handlers
bot.onText(/\/start/, async (msg) => {
  const welcomeMessage = 
    "Welcome to HN News Bot! 📰\n\n" +
    "I'll send top Hacker News stories to configured destinations daily.\n\n" +
    "Commands:\n" +
    "/getnews - Get top stories now\n" +
    "/help - Show this help message";
  
  await bot.sendMessage(msg.chat.id, welcomeMessage);
});

bot.onText(/\/help/, async (msg) => {
  const helpMessage = 
    "🤖 <b>HN News Bot Commands</b>\n\n" +
    "/getnews - Fetch latest top Hacker News stories\n" +
    "/help - Show this help message\n\n" +
    "ℹ️ The bot automatically sends updates:\n" +
    "• Daily at 8:00 AM EAT (Ethiopia/Addis Ababa time)\n" +
    "• To configured Telegram channels and groups\n" +
    "• Including topic threads in groups";
    
  await bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'HTML' });
});

bot.onText(/\/getnews/, async (msg) => {
  try {
    const stories = await fetchTopStories();
    const message = formatStoryMessage(stories);
    
    // Send to the requesting chat
    await bot.sendMessage(msg.chat.id, message, { parse_mode: 'HTML' });
    
    // Send to all configured destinations
    await sendToDestinations(bot, message, config.destinations);
  } catch (error) {
    logger.error('Error handling /getnews command:', error);
    await bot.sendMessage(msg.chat.id, '⚠️ Failed to fetch stories. Please try again later.');
  }
});

// Daily task function
const dailyUpdateTask = async () => {
  const stories = await fetchTopStories();
  const message = formatStoryMessage(stories);
  await sendToDestinations(bot, message, config.destinations);
};

// Start the bot
const startBot = async () => {
  try {
    logger.info('Bot is starting...');
    scheduleDaily(dailyUpdateTask);
    logger.info('Bot is running and scheduled tasks are set up for 8:00 AM EAT');
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
