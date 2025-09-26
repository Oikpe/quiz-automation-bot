// Quiz Bot Loader - Paste this in browser console
(function() {
    console.log('🚀 Loading Quiz Bot...');
    
    // Your GitHub username and repo name
    const GITHUB_USER = 'Oikpe';
    const REPO_NAME = 'quiz-automation-bot';
    
    // Multiple CDN URLs for failover
    const scriptUrls = [
        `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${REPO_NAME}/quiz-bot.js`,
        `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/quiz-bot.js`
    ];
    
    // Anti-detection
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    
    // Load script function
    async function loadScript() {
        for (const url of scriptUrls) {
            try {
                console.log(`Trying to load from: ${url}`);
                
                const response = await fetch(url, { 
                    cache: 'no-cache',
                    method: 'GET'
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const scriptContent = await response.text();
                
                // Execute the script
                eval(scriptContent);
                
                console.log('✅ Quiz Bot loaded successfully!');
                return true;
                
            } catch (error) {
                console.warn(`❌ Failed to load from ${url}:`, error.message);
            }
        }
        
        throw new Error('All script URLs failed');
    }
    
    // Load the bot
    loadScript().catch(error => {
        console.error('🚫 Quiz Bot loading completely failed:', error);
        alert('Failed to load Quiz Bot. Check your internet connection and try again.');
    });
})();
