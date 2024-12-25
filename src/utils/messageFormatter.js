function formatStoryMessage(stories) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const header = `🔥 Top Hacker News - ${date}\n\n`;
  
  const formattedStories = stories.map((story, index) => {
    const title = story.title;
    const url = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
    const points = story.score || 0;
    const comments = story.descendants || 0;
    
    return `${index + 1}. <a href="${url}">${title}</a>\n` +
           `📊 ${points} points | 💬 ${comments} comments\n`;
  }).join('\n');
  
  return `${header}${formattedStories}`;
}

module.exports = { formatStoryMessage };
