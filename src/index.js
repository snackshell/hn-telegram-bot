const TelegramBot = require('node-telegram-bot-api');
const { config } = require('./config/config');
const { fetchTopStories } = require('./services/hnService');
const { formatStoryMessage } = require('./utils/messageFormatter');
const { logger } = require('./utils/logger');
const { sendToDestinations } = require('./services/messageService');
const { scheduleDaily } = require('./utils/scheduler');

// Initialize bot with simple polling
const bot = new TelegramBot(config.token, { polling: true });

// Command handlers
bot.onText(/\/getnews/, async (msg) => {
  try {
    const stories = await fetchTopStories();
    const messageObject = formatStoryMessage(stories);
    
    await bot.sendMessage(msg.chat.id, messageObject.text, { 
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: messageObject.reply_markup
    });
  } catch (error) {
    logger.error('Error handling /getnews command:', error);
    await bot.sendMessage(msg.chat.id, '⚠️ Failed to fetch stories. Please try again later.');
  }
});

// Daily task function
const dailyUpdateTask = async () => {
  try {
    const stories = await fetchTopStories();
    const message = formatStoryMessage(stories);
    await sendToDestinations(bot, message, config.destinations);
  } catch (error) {
    logger.error('Error in scheduled task:', error);
  }
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
