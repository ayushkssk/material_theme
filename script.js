// Add these constants at the top of your script.js
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// API Keys and endpoints
const PIXABAY_API_KEY = 'YOUR_PIXABAY_KEY'; // Get from pixabay.com
const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // Get from newsapi.org
const WIKIPEDIA_ENDPOINT = 'https://en.wikipedia.org/w/api.php';

// View state
let currentView = 'block'; // 'block', 'card', or 'picture'

// Constants for search engines and AI tools
const SEARCH_ENGINES = {
    google: 'https://www.google.com/search?q=',
    duck: 'https://duckduckgo.com/?q=',
    bing: 'https://www.bing.com/search?q=',
    brave: 'https://search.brave.com/search?q=',
    youtube: 'https://www.youtube.com/results?search_query='
};

const AI_TOOLS = {
    chatgpt: 'https://chat.openai.com',
    gemini: 'https://gemini.google.com',
    copilot: 'https://copilot.microsoft.com',
    firefly: 'https://firefly.adobe.com'
};

// Trending topics (you can fetch these from an API)
const TRENDING_TOPICS = [
    'AI Technology',
    'Climate Change',
    'Space Exploration',
    'Quantum Computing',
    'Renewable Energy'
];

// Update the time functions
class TimeManager {
    constructor() {
        // Digital clock elements
        this.timeElement = document.querySelector('.time');
        this.dateElement = document.querySelector('.date');
        this.periodElement = document.querySelector('.period');
        this.greetingElement = document.querySelector('.greeting-text');
        
        // Analog clock elements
        this.hourHand = document.querySelector('.hour-hand');
        this.minuteHand = document.querySelector('.minute-hand');
        this.secondHand = document.querySelector('.second-hand');
        
        this.days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize both clocks
        this.initAnalogClock();
        this.startTimeUpdate();
    }

    initAnalogClock() {
        // Add clock markers
        const markers = document.querySelector('.markers');
        for (let i = 0; i < 12; i++) {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.transform = `rotate(${i * 30}deg)`;
            markers.appendChild(marker);
        }
    }

    startTimeUpdate() {
        // Update immediately
        this.updateTime();
        
        // Update every second
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        
        // Update digital clock
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const period = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        // Update digital display
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.timeElement.textContent = timeString;
        this.periodElement.textContent = period;
        this.dateElement.textContent = `${now.getDate()} ${this.days[now.getDay()]}`;
        
        // Update analog clock
        const secondsDeg = (seconds / 60) * 360;
        const minutesDeg = ((minutes + seconds/60) / 60) * 360;
        const hoursDeg = ((hours + minutes/60) / 12) * 360;

        // Apply smooth transitions
        this.secondHand.style.transform = `rotate(${secondsDeg}deg)`;
        this.minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
        this.hourHand.style.transform = `rotate(${hoursDeg}deg)`;
        
        // Update greeting
        this.updateGreeting(now.getHours());
    }

    updateGreeting(hour) {
        let greeting = '';
        if (hour < 12) greeting = 'Good Morning!';
        else if (hour < 17) greeting = 'Good Afternoon!';
        else if (hour < 20) greeting = 'Good Evening!';
        else greeting = 'Good Night!';
        
        if (this.greetingElement) {
            this.greetingElement.textContent = greeting;
        }
    }
}

// Add this new function
async function getWeatherData() {
    try {
        // First get user's location
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=imperial`
        );
        const weatherData = await weatherResponse.json();

        // Update DOM with weather information
        document.querySelector('.weather-info h3').textContent = weatherData.weather[0].main;
        document.querySelector('.humidity span').textContent = `Humidity ${weatherData.main.humidity}%`;
        document.querySelector('.feels-like span').textContent = `Feels ${weatherData.main.feels_like.toFixed(1)}°F`;
        document.querySelector('.location span').textContent = weatherData.name;
        document.querySelector('.temperature').textContent = `${Math.round(weatherData.main.temp)}°F`;

    } catch (error) {
        console.error('Error fetching weather:', error);
        // Show error message to user
        document.querySelector('.weather-info h3').textContent = 'Weather Unavailable';
    }
}

// Add this new function
function getGreeting(hours) {
    if (hours < 12) return 'Good Morning!';
    if (hours < 17) return 'Good Afternoon!';
    if (hours < 20) return 'Good Evening!';
    return 'Good Night!';
}

// Add this to your HTML section right after the time widget
function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greeting = getGreeting(hours);
    
    // Update name and greeting
    document.querySelector('.greeting-name').textContent = 'Ayush Singh';
    document.querySelector('.greeting-text').textContent = greeting;
}

// Update the initializeApp function
function initializeApp() {
    updateTime();
    updateGreeting(); // Add initial greeting
    setInterval(updateTime, 1000);
    setInterval(updateGreeting, 60000); // Update greeting every minute
    getWeatherData();
    setInterval(getWeatherData, 5 * 60 * 1000);
}

// Replace the previous updateTime() call with this
document.addEventListener('DOMContentLoaded', initializeApp); 

// Add this function for the AI Tools menu toggle
function toggleAIMenu() {
    const menu = document.querySelector('.ai-tools-menu');
    const container = document.querySelector('.ai-tools-container');
    
    menu.classList.toggle('active');
    container.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const container = document.querySelector('.ai-tools-container');
    const menu = document.querySelector('.ai-tools-menu');
    
    if (!container.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
        container.classList.remove('active');
    }
});

// Prevent menu from closing when clicking inside
document.querySelector('.ai-tools-menu').addEventListener('click', (e) => {
    e.stopPropagation();
}); 

// Add these functions for search handling
async function handleSearch(query) {
    const searchInput = document.querySelector('.search-bar input');
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    showLoader();
    
    try {
        let results;
        switch(currentView) {
            case 'picture':
                results = await searchImages(query);
                break;
            case 'card':
                results = await searchNews(query);
                break;
            case 'block':
                results = await searchWikipedia(query);
                break;
        }
        
        displayResults(results);
    } catch (error) {
        showError('Search failed. Please try again.');
    } finally {
        hideLoader();
    }
}

// API Search Functions
async function searchImages(query) {
    const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo`
    );
    const data = await response.json();
    return data.hits.map(image => ({
        type: 'image',
        url: image.webformatURL,
        title: image.tags,
        link: image.pageURL
    }));
}

async function searchNews(query) {
    const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}`
    );
    const data = await response.json();
    return data.articles.map(article => ({
        type: 'news',
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage
    }));
}

async function searchWikipedia(query) {
    const params = new URLSearchParams({
        action: 'query',
        list: 'search',
        srsearch: query,
        format: 'json',
        origin: '*'
    });
    
    const response = await fetch(`${WIKIPEDIA_ENDPOINT}?${params}`);
    const data = await response.json();
    return data.query.search.map(result => ({
        type: 'wiki',
        title: result.title,
        snippet: result.snippet,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
    }));
}

// Display Functions
function displayResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    resultsContainer.innerHTML = '';
    
    results.forEach(result => {
        const element = createResultElement(result);
        resultsContainer.appendChild(element);
    });
}

function createResultElement(result) {
    const element = document.createElement('div');
    
    switch(currentView) {
        case 'picture':
            element.className = 'result-picture';
            element.innerHTML = `
                <a href="${result.link}" target="_blank">
                    <img src="${result.url}" alt="${result.title}">
                    <div class="picture-overlay">${result.title}</div>
                </a>
            `;
            break;
            
        case 'card':
            element.className = 'result-card';
            element.innerHTML = `
                <div class="card-image">
                    <img src="${result.image || 'placeholder.jpg'}" alt="${result.title}">
                </div>
                <div class="card-content">
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                    <a href="${result.url}" target="_blank">Read More</a>
                </div>
            `;
            break;
            
        case 'block':
            element.className = 'result-block';
            element.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.snippet}</p>
                <a href="${result.url}" target="_blank">Read on Wikipedia</a>
            `;
            break;
    }
    
    return element;
}

// View Toggle Function
function toggleView(view) {
    currentView = view;
    const resultsContainer = document.querySelector('.search-results');
    resultsContainer.className = `search-results ${view}-view`;
    
    // Perform search again if there's a query
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput.value.trim()) {
        handleSearch(searchInput.value.trim());
    }
} 

// Add this function to handle AI tool button clicks
function handleAIToolClick(event) {
    // Remove active class from all buttons
    document.querySelectorAll('.ai-tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (event.target.classList.contains('ai-tool-btn')) {
        event.target.classList.add('active');
    } else {
        event.target.closest('.ai-tool-btn').classList.add('active');
    }
}

// Add event listeners
document.querySelectorAll('.ai-tool-btn').forEach(btn => {
    btn.addEventListener('click', handleAIToolClick);
}); 

// Search suggestions functionality
function initializeSearchSuggestions() {
    const searchInput = document.querySelector('.search-bar input');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsContainer);

    // Add trending topics section
    const trendingSection = document.createElement('div');
    trendingSection.className = 'trending-section';
    trendingSection.innerHTML = `
        <h3>Trending Topics</h3>
        <div class="trending-topics">
            ${TRENDING_TOPICS.map(topic => `
                <button class="trending-topic" onclick="searchTopic('${topic}')">
                    <i class="fas fa-trending-up"></i> ${topic}
                </button>
            `).join('')}
        </div>
    `;
    suggestionsContainer.appendChild(trendingSection);

    // Show/hide suggestions
    searchInput.addEventListener('focus', () => {
        suggestionsContainer.style.display = 'block';
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    // Handle input changes
    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query) {
            const suggestions = await fetchSearchSuggestions(query);
            updateSuggestions(suggestions, suggestionsContainer);
        }
    });
}

// Fetch search suggestions (example using Wikipedia API)
async function fetchSearchSuggestions(query) {
    try {
        const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${query}&limit=5&origin=*`
        );
        const [, suggestions] = await response.json();
        return suggestions;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

// Update suggestions in the UI
function updateSuggestions(suggestions, container) {
    const suggestionsHtml = suggestions.map(suggestion => `
        <div class="suggestion-item" onclick="searchTopic('${suggestion}')">
            <i class="fas fa-search"></i>
            ${suggestion}
        </div>
    `).join('');

    const suggestionsSection = container.querySelector('.suggestions-section') || document.createElement('div');
    suggestionsSection.className = 'suggestions-section';
    suggestionsSection.innerHTML = suggestionsHtml;
    
    if (!container.contains(suggestionsSection)) {
        container.appendChild(suggestionsSection);
    }
}

// Handle search engine selection
function searchWith(engine, query) {
    const searchQuery = query || document.querySelector('.search-bar input').value.trim();
    if (searchQuery) {
        window.open(SEARCH_ENGINES[engine] + encodeURIComponent(searchQuery), '_blank');
    }
}

// Handle AI tool selection
function openAITool(tool) {
    window.open(AI_TOOLS[tool], '_blank');
}

// Search trending topic
function searchTopic(topic) {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.value = topic;
    searchWith('google', topic);
}

// Add theme switching functionality
class ThemeManager {
    constructor() {
        this.panel = document.querySelector('.theme-panel');
        this.currentTheme = localStorage.getItem('theme') || 'peach';
        this.currentStyle = localStorage.getItem('style') || 'light';
        this.currentDensity = localStorage.getItem('density') || 'comfortable';
        
        this.initializeThemePanel();
        this.loadSavedPreferences();
    }

    initializeThemePanel() {
        // Toggle panel
        document.querySelector('.settings-btn').addEventListener('click', () => {
            this.panel.classList.toggle('active');
        });

        document.querySelector('.close-panel').addEventListener('click', () => {
            this.panel.classList.remove('active');
        });

        // Color theme buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setTheme(btn.dataset.theme));
        });

        // Style mode buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setStyle(btn.dataset.style));
        });

        // Density buttons
        document.querySelectorAll('.density-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setDensity(btn.dataset.density));
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && 
                !e.target.classList.contains('settings-btn')) {
                this.panel.classList.remove('active');
            }
        });
    }

    setTheme(theme) {
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        this.currentTheme = theme;
        this.updateBodyClasses();
        localStorage.setItem('theme', theme);
    }

    setStyle(style) {
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.style === style);
        });
        this.currentStyle = style;
        this.updateBodyClasses();
        localStorage.setItem('style', style);

        if (style === 'auto') {
            this.handleAutoMode();
        }
    }

    setDensity(density) {
        document.querySelectorAll('.density-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.density === density);
        });
        document.body.setAttribute('data-density', density);
        localStorage.setItem('density', density);
    }

    handleAutoMode() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentStyle = prefersDark ? 'dark' : 'light';
        this.updateBodyClasses();
    }

    updateBodyClasses() {
        document.body.className = `theme-${this.currentTheme} ${this.currentStyle}`;
    }

    loadSavedPreferences() {
        this.setTheme(this.currentTheme);
        this.setStyle(this.currentStyle);
        this.setDensity(this.currentDensity);
    }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    
    // Watch for system theme changes if in auto mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeManager.currentStyle === 'auto') {
            themeManager.handleAutoMode();
        }
    });
});

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeThemeSwitcher();
    initializeSearchSuggestions();
    
    // Add click handlers for search engines
    document.querySelectorAll('.engine-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const engine = button.className.toLowerCase();
            searchWith(engine);
        });
    });

    // Add click handlers for AI tools
    document.querySelectorAll('.ai-tool-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const tool = e.target.textContent.toLowerCase().replace(/\s+/g, '');
            if (tool !== 'aitools') {
                openAITool(tool);
            }
        });
    });
});

// Add keyboard shortcuts for theme switching
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 't') {
        const themes = ['peach', 'blue', 'green', 'purple'];
        const currentTheme = document.body.className.replace('theme-', '');
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        const nextThemeBtn = document.querySelector(`[data-theme="${themes[nextIndex]}"]`);
        nextThemeBtn.click();
    }
});

// Add these new classes for the clock and terminal
class AnalogClock {
    constructor() {
        this.hourHand = document.querySelector('.hour-hand');
        this.minuteHand = document.querySelector('.minute-hand');
        this.secondHand = document.querySelector('.second-hand');
        this.init();
    }

    init() {
        // Add clock markers
        const markers = document.querySelector('.markers');
        for (let i = 0; i < 12; i++) {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.transform = `rotate(${i * 30}deg)`;
            markers.appendChild(marker);
        }
        
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours() % 12;

        const secondsDeg = (seconds / 60) * 360;
        const minutesDeg = ((minutes + seconds/60) / 60) * 360;
        const hoursDeg = ((hours + minutes/60) / 12) * 360;

        this.secondHand.style.transform = `rotate(${secondsDeg}deg)`;
        this.minuteHand.style.transform = `rotate(${minutesDeg}deg)`;
        this.hourHand.style.transform = `rotate(${hoursDeg}deg)`;
    }
}

class TerminalSimulator {
    constructor() {
        this.content = document.querySelector('.terminal-content');
        this.terminalBody = document.querySelector('.terminal-body');
        this.activities = [
            { message: 'System initialization complete', type: 'success' },
            { message: 'Checking network connectivity...', type: 'process' },
            { message: 'Updating weather data for Kolkata...', type: 'process' },
            { message: 'Syncing time with NTP servers...', type: 'process' },
            { message: 'Loading user preferences...', type: 'process' },
            { message: 'Monitoring system resources...', type: 'info' },
            { message: 'Checking for updates...', type: 'process' },
            { message: 'Running background tasks...', type: 'info' }
        ];
        
        this.init();
        this.startActivitySimulation();
    }

    init() {
        this.addMessage('Terminal initialized...', 'system');
        this.addMessage('Starting system processes...', 'info');
    }

    startActivitySimulation() {
        let index = 0;
        
        const simulateActivity = () => {
            const activity = this.activities[index % this.activities.length];
            this.addMessage(activity.message, activity.type);
            
            if (activity.type === 'process') {
                setTimeout(() => {
                    this.addMessage('✓ Operation completed successfully', 'success');
                }, 1000);
            }
            
            index++;
            setTimeout(simulateActivity, Math.random() * 3000 + 2000);
        };
        
        simulateActivity();
    }

    addMessage(text, type) {
        const message = document.createElement('div');
        message.className = `terminal-message ${type}`;
        
        const now = new Date();
        const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        message.innerHTML = `
            <span class="terminal-timestamp">[${timestamp}]</span>
            <span class="terminal-type">[${type.toUpperCase()}]</span>
            <span class="terminal-text">${text}</span>
        `;
        
        this.content.appendChild(message);
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
        
        while (this.content.children.length > 15) {
            this.content.removeChild(this.content.firstChild);
        }
    }
}

// Add these styles to match the UI theme
const terminalStyles = `
.terminal-message {
    color: var(--text-color);
    font-family: monospace;
    margin: 5px 0;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
}

.terminal-timestamp {
    color: var(--accent-color);
    margin-right: 8px;
}

.terminal-type {
    color: var(--text-color);
    opacity: 0.7;
    margin-right: 8px;
}

.terminal-message.success .terminal-type {
    color: #27c93f;
}

.terminal-message.error .terminal-type {
    color: #ff5f56;
}

.terminal-message.warning .terminal-type {
    color: #ffbd2e;
}

.terminal-message.info .terminal-type {
    color: var(--accent-color);
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = terminalStyles;
document.head.appendChild(styleSheet);

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const timeManager = new TimeManager();
    const terminal = new TerminalSimulator();
    
    // Add smooth transition for clock hands
    const style = document.createElement('style');
    style.textContent = `
        .hand {
            transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
        }
        .second-hand {
            transition: transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 0.44);
        }
    `;
    document.head.appendChild(style);
});