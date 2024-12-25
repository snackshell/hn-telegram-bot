const { logger } = require('../utils/logger');

async function sendToDestinations(bot, message, destinations) {
  const results = [];
  
  for (const destination of destinations) {
    try {
      if (destination.includes('@')) {
        const [groupName, threadId] = destination.split('@').slice(1);
        
        if (threadId) {
          // Send to topic thread
          await bot.sendMessage(`@${groupName}`, message, {
            parse_mode: 'HTML',
            message_thread_id: parseInt(threadId)
          });
          logger.info(`Message sent to group @${groupName} thread ${threadId}`);
        } else {
          // Send to regular group or channel
          await bot.sendMessage(destination, message, { parse_mode: 'HTML' });
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
