const axios = require('axios');
const { logger } = require('../utils/logger');

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const MAX_STORIES = 10;

async function fetchTopStories() {
  try {
    const { data: storyIds } = await axios.get(`${HN_API_BASE}/topstories.json`);
    const topStoryIds = storyIds.slice(0, MAX_STORIES);
    
    const stories = await Promise.all(
      topStoryIds.map(id => 
        axios.get(`${HN_API_BASE}/item/${id}.json`)
          .then(response => response.data)
      )
    );
    
    return stories;
  } catch (error) {
    logger.error('Error fetching stories:', error);
    throw error;
  }
}

module.exports = { fetchTopStories };
