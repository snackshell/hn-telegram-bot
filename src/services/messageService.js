const { logger } = require('../utils/logger');

async function sendToDestinations(bot, messageObject, destinations) {
  const results = [];

  for (const destination of destinations) {
    try {
      if (destination.includes('@')) {
        const [groupName, threadId] = destination.split('@').slice(1);
        
        if (threadId) {
          // Send to topic thread
          await bot.sendMessage(`@${groupName}`, messageObject.text, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            message_thread_id: parseInt(threadId),
            reply_markup: messageObject.reply_markup
          });
          logger.info(`Message sent to group @${groupName} thread ${threadId}`);
        } else {
          // Send to regular group or channel
          await bot.sendMessage(destination, messageObject.text, { 
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: messageObject.reply_markup 
          });
          logger.info(`Message sent to destination ${destination}`);
        }
      }
      
      results.push({ destination, success: true });
    } catch (error) {
      logger.error(`Failed to send to ${destination}:`, error);
      results.push({ destination, success: false, error: error.message });
    }
  }
  
  return results;
}

module.exports = { sendToDestinations };
