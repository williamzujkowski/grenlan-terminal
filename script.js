// Summary:
// This script creates a terminal emulator in a web page that supports various commands,
// fetches and displays IP information, user information, a programming joke, and a historical event from today's date.

// Terminal elements
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('input');
const logElement = document.getElementById('log'); // Log element for debugging
const banner = document.getElementById('banner');

// Placeholder for IP and history data
let ipData = null;
let historyData = null;
let userInfo = {};
let current_user = 'guest'; // Initialize with 'guest', will be updated after fetching user data
const root_url = 'grenlan.com';
let promptText = `${current_user}@${root_url}:~$`; // Initialize, will be updated

// Log message to console and log element
function logMessage(message) {
    console.log(message);
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logElement.appendChild(logEntry);
}

// Additional functions for dynamic values

// Function to calculate uptime since last boot (April 8th of this year)
function calculateUptime() {
    const lastBootDate = new Date(new Date().getFullYear(), 3, 8); // April 8th of this year
    const now = new Date();
    const diff = now - lastBootDate;
    
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const diffInMinutes = Math.floor((diff / (1000 * 60)) % 60);
    const diffInSeconds = Math.floor((diff / 1000) % 60);
    
    return `${diffInDays} days, ${diffInHours} hours, ${diffInMinutes} minutes, ${diffInSeconds} seconds`;
}

// Function to get random number of users logged in (1 to 41)
function getRandomUsers() {
    return Math.floor(Math.random() * 41) + 1;
}

// Function to generate random memory usage
function getRandomMemoryUsage() {
    const totalMemory = 1899; // in MB
    const usedMemory = Math.floor(Math.random() * totalMemory);
    const freeMemory = totalMemory - usedMemory;
    return {
        used: usedMemory,
        free: freeMemory,
        total: totalMemory
    };
}

// Function to generate random swap usage
function getRandomSwapUsage() {
    const totalSwap = 99; // in MB
    const usedSwap = Math.floor(Math.random() * totalSwap);
    const freeSwap = totalSwap - usedSwap;
    return {
        used: usedSwap,
        free: freeSwap,
        total: totalSwap
    };
}

// Function to generate random running processes
function getRandomRunningProcesses() {
    return Math.floor(Math.random() * 200) + 50; // between 50 and 250
}

// Function to generate random load averages
function getRandomLoadAverages() {
    const load1 = (Math.random() * 1).toFixed(2);
    const load5 = (Math.random() * 1).toFixed(2);
    const load15 = (Math.random() * 1).toFixed(2);
    return `${load1}, ${load5}, ${load15} (1min, 5mins, 15mins)`;
}

// Function to dynamically update server statistics
function updateServerStatistics() {
    const memoryUsage = getRandomMemoryUsage();
    const swapUsage = getRandomSwapUsage();
    const runningProcesses = getRandomRunningProcesses();
    const loadAverages = getRandomLoadAverages();
    
    return `
        <div class="banner-section">
            <h2>SERVER STATISTICS</h2>
            <p>Disk Usage......: 5194M Used, 23347M Free, 29779M Total</p>
            <p>Memory Usage....: ${memoryUsage.used}M Used, ${memoryUsage.free}M Free, ${memoryUsage.total}M Total</p>
            <p>Swap Usage......: ${swapUsage.used}M Used, ${swapUsage.free}M Free, ${swapUsage.total}M Total</p>
            <p>Running Process.: ${runningProcesses}</p>
            <p>Load Averages...: ${loadAverages}</p>
        </div>
    `;
}

// Display login banner with dynamic server statistics and uptime
function displayLoginBanner() {
    const location = `${userInfo.location.city}, ${userInfo.location.state}, ${userInfo.location.country}`;
    const timestamp = new Date().toLocaleString();
    const uptime = calculateUptime();
    const usersLoggedIn = getRandomUsers();
    const serverStatistics = updateServerStatistics();

    const bannerHTML = `
        <div class="banner-section">
            <h2>SERVER INFORMATION</h2>
            <p>Hostname........: ${root_url}</p>
            <p>IP Address......: ${ipData.ip}</p>
            <p>Release.........: Debian GNU/Linux 11 (bullseye)</p>
            <p>Kernel..........: Linux 6.1.21-v8+</p>
            <p>CPU.............: Cortex-A72</p>
        </div>
        ${serverStatistics}
        <div class="banner-section">
            <h2>ACCESS & AVAILABILITY</h2>
            <p>Uptime..........: ${uptime}</p>
            <p>Last Boot.......: April 8, ${new Date().getFullYear()}</p>
            <p>Last Login......: ${location} at ${timestamp}</p>
            <p>Users Logged on.: ${usersLoggedIn} users (${userInfo.login.username})</p>
        </div>
    `;
    banner.innerHTML = bannerHTML;
}

// Event listener for handling command input
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const [command, ...args] = input.value.trim().split(' ');
        processCommand(command.toLowerCase(), args);
        input.value = '';
    }
});

// Ensure the input is focused when the window or body is clicked
window.addEventListener('focus', () => { input.focus(); });
document.body.addEventListener('click', () => { input.focus(); });

// Process and execute commands
async function processCommand(command, args) {
    if (commands.hasOwnProperty(command)) {
        try {
            const result = commands[command](args);
            if (result instanceof Promise) {
                result.then((res) => displayOutput(command, res));
            } else {
                displayOutput(command, result);
            }
        } catch (error) {
            logMessage(`Error executing command '${command}': ${error.message}`);
            displayOutput(command, `Error: ${error.message}`);
        }
    } else {
        logMessage(`Command not found: ${command}`);
        displayOutput(command, 'Command not found');
    }
}

// Display command output in the terminal
function displayOutput(command, result) {
    const lines = result.split('\n');
    const firstLine = lines[0];
    const rest = lines.slice(1).join('\n');

    const outputDiv = document.createElement('div');
    outputDiv.classList.add('line');

    const promptSpan = document.createElement('span');
    promptSpan.classList.add('prompt');
    promptSpan.textContent = promptText;

    const contentSpan = document.createElement('pre');
    contentSpan.classList.add('content');
    contentSpan.textContent = firstLine;

    outputDiv.appendChild(promptSpan);
    outputDiv.appendChild(contentSpan);
    output.appendChild(outputDiv);

    if (rest) {
        const restContent = document.createElement('pre');
        restContent.classList.add('content');
        restContent.textContent = rest;
        output.appendChild(restContent);
    }

    terminal.scrollTop = terminal.scrollHeight;
    setTimeout(() => { input.focus(); }, 500); // Adjusted to 500ms for smoother scrolling
}

// Open a URL in a new tab
function openLink(url) {
    window.open(url, '_blank');
}

// Fetch a random programming joke
async function fetchJoke() {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
        const joke = await response.json();
        return joke.joke;
    } catch (error) {
        logMessage(`Error fetching joke: ${error.message}`);
        return 'Error fetching joke.';
    }
}

// Fetch a random piece of advice
async function fetchAdvice() {
    try {
        const response = await fetch('https://api.adviceslip.com/advice');
        const advice = await response.json();
        return advice.slip.advice;
    } catch (error) {
        logMessage(`Error fetching advice: ${error.message}`);
        return 'Error fetching advice.';
    }
}

// Fetch historical events for today's date
async function fetchHistory() {
    try {
        const response = await fetch('https://history.muffinlabs.com/date');
        const history = await response.json();
        historyData = history.data.Events;
        return getRandomHistoryEvent(historyData);
    } catch (error) {
        logMessage(`Error fetching history data: ${error.message}`);
        return 'Error fetching history data.';
    }
}

// Get a random historical event
function getRandomHistoryEvent(events) {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    return `${randomEvent.year} - ${randomEvent.text}`;
}

// Fetch random user data
async function fetchUserData() {
    try {
        const response = await fetch('https://randomuser.me/api/?format=PRETTYJson&nat=us,gb,de,fr,mx,ca,nl');
        const user = await response.json();
        userInfo = user.results[0];
        return userInfo;
    } catch (error) {
        logMessage(`Error fetching user data: ${error.message}`);
        return 'Error fetching user data.';
    }
}

// Display user information
function displayUserInfo() {
    if (userInfo) {
        return `
            Name: ${userInfo.name.first} ${userInfo.name.last}
            Gender: ${userInfo.gender}
            Email: ${userInfo.email}
            Location: ${userInfo.location.street.number} ${userInfo.location.street.name}, ${userInfo.location.city}, ${userInfo.location.state}, ${userInfo.location.country}
            Phone: ${userInfo.phone}
            Cell: ${userInfo.cell}
            Nationality: ${userInfo.nat}
        `;
    } else {
        return 'User information not available.';
    }
}

// Initialize the terminal with IP information, a joke, and a historical event
async function initializeTerminal() {
    try {
        const [ipResponse, joke, historyEvent, user] = await Promise.all([
            fetch('https://ipinfo.io?token=d3cd76a02bee5d'),
            fetchJoke(),
            fetchHistory(),
            fetchUserData()
        ]);

        ipData = await ipResponse.json();
        userInfo = user;  // Ensure userInfo is set
        current_user = userInfo.login.username; // Update current user with the username of the user
        currentDirectory = `~`; // Set the current directory to the user's home directory
        promptText = `${current_user}@${root_url}:${currentDirectory}$`; // Update promptText with the current user

        displayLoginBanner();

        const location = `${userInfo.location.city}, ${userInfo.location.state}, ${userInfo.location.country}`;
        const timestamp = new Date().toLocaleString();

        output.innerHTML += `
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">[${timestamp}] login detected from ${location}.</pre></div>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Welcome, ${userInfo.name.first} ${userInfo.name.last}!</pre></div>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Joke: ${joke}</pre></div>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Today in History: ${historyEvent}</pre></div>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Type 'help' to see list of available commands.</pre></div>
        `;

        terminal.scrollTop = terminal.scrollHeight;
    } catch (error) {
        logMessage(`Error initializing terminal: ${error.message}`);
        output.innerHTML += '<div class="error">Error fetching IP, joke, history, or user information.</div>';
    }

    input.focus();
    document.getElementById('prompt').textContent = promptText;
}

// Fetch data and initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', initializeTerminal);

// Command definitions
const commands = {
    'advice': async () => fetchAdvice(),
    'clear': () => { output.innerHTML = ''; return ''; },
    'date': () => new Date().toLocaleString(),
    'echo': (args) => args.join(' '),
    'emacs': () => `A versatile text editor. Try it out!`,
    'exit': () => 'Please close the tab to exit.',
    'github': () => openLink('https://github.com/williamzujkowski'),
    'help': () => {
        return `Available commands:\n
System Commands:
    clear - Clear the terminal
    date - Display the current date and time
    echo [text] - Echo the input text
    exit - Display a message to close the tab
    help - Display available commands and descriptions
    hostname - Display the current hostname

User Commands:
    userinfo - Display information about the current user
    whoami - Display the current user

Text Editors:
    emacs - A versatile text editor. Try it out!
    vi - An efficient text editor. Try it out!
    vim - An improved version of vi. Try it out!

Web Links:
    github - Open GitHub profile
    linkedin - Open LinkedIn profile

Fun Commands:
    advice - Get a piece of advice
    joke - Display a random programming joke
    quote - Display a random quote with a link to more quotes
    fact - Display a random fun fact
    motivate - Display a random motivational quote
    chucknorris - Display a random Chuck Norris joke
    catfact - Display a random cat fact
    dogfact - Display a random dog fact
    riddle - Display a random riddle
    trivia - Display a random trivia question
    insult - Display a random humorous insult

Network Commands:
    ipinfo - Display IP information
    weather [city] - Fetch and display weather information for the current location or specified city
`;
    },
    'hostname': () => root_url,
    'ipinfo': () => JSON.stringify(ipData, null, 2),
    'joke': async () => fetchJoke(),
    'linkedin': () => openLink('https://www.linkedin.com/in/williamzujkowski/'),
    'quote': async () => fetchQuote(),
    'fact': async () => fetchFact(),
    'motivate': async () => fetchMotivation(),
    'chucknorris': async () => fetchChuckNorris(),
    'catfact': async () => fetchCatFact(),
    'dogfact': async () => fetchDogFact(),
    'riddle': async () => fetchRiddle(),
    'trivia': async () => fetchTrivia(),
    'insult': async () => fetchInsult(),
    'sudo': (args) => {
        openLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        return `Permission denied: unable to run the command '${args[0]}' as root.`;
    },
    'userinfo': () => displayUserInfo(),
    'vi': () => `An efficient text editor. Try it out!`,
    'vim': () => `An improved version of vi. Try it out!`,
    'weather': async (args) => handleWeatherCommand(args),
    'whoami': () => current_user,
};

// Functions to fetch data for fun commands

async function fetchFact() {
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const fact = await response.json();
        return fact.text;
    } catch (error) {
        logMessage(`Error fetching fact: ${error.message}`);
        return 'Error fetching fact.';
    }
}

async function fetchMotivation() {
    try {
        const response = await fetch('https://type.fit/api/quotes');
        const quotes = await response.json();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return `${randomQuote.text} - ${randomQuote.author}`;
    } catch (error) {
        logMessage(`Error fetching motivational quote: ${error.message}`);
        return 'Error fetching motivational quote.';
    }
}

async function fetchChuckNorris() {
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random');
        const joke = await response.json();
        return joke.value;
    } catch (error) {
        logMessage(`Error fetching Chuck Norris joke: ${error.message}`);
        return 'Error fetching Chuck Norris joke.';
    }
}

async function fetchCatFact() {
    try {
        const response = await fetch('https://catfact.ninja/fact');
        const fact = await response.json();
        return fact.fact;
    } catch (error) {
        logMessage(`Error fetching cat fact: ${error.message}`);
        return 'Error fetching cat fact.';
    }
}

async function fetchDogFact() {
    try {
        const response = await fetch('https://dog-api.kinduff.com/api/facts');
        const fact = await response.json();
        return fact.facts[0];
    } catch (error) {
        logMessage(`Error fetching dog fact: ${error.message}`);
        return 'Error fetching dog fact.';
    }
}

async function fetchRiddle() {
    try {
        const response = await fetch('https://riddles-api.vercel.app/random');
        const riddle = await response.json();
        return `${riddle.riddle}\n\nAnswer: ${riddle.answer}`;
    } catch (error) {
        logMessage(`Error fetching riddle: ${error.message}`);
        return 'Error fetching riddle.';
    }
}

async function fetchTrivia() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
        const trivia = await response.json();
        const question = trivia.results[0];
        return `${question.question}\n\nChoices: ${question.incorrect_answers.join(', ')}, ${question.correct_answer}`;
    } catch (error) {
        logMessage(`Error fetching trivia: ${error.message}`);
        return 'Error fetching trivia.';
    }
}

async function fetchInsult() {
    try {
        const response = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json');
        const insult = await response.json();
        return insult.insult;
    } catch (error) {
        logMessage(`Error fetching insult: ${error.message}`);
        return 'Error fetching insult.';
    }
}

async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const quote = await response.json();
        return `${quote.content} - ${quote.author}\n<a href="https://quotes.yourdictionary.com/theme/motivational/" target="_blank">More quotes</a>`;
    } catch (error) {
        logMessage(`Error fetching quote: ${error.message}`);
        return 'Error fetching quote.';
    }
}

// Function to fetch weather information for a given city or the current location
async function handleWeatherCommand(args) {
    let city = args.join(' ');
    if (!city && userInfo.location) {
        city = userInfo.location.city;
    }
    if (!city) {
        return 'Usage: weather [city]. Example: weather Brussels';
    }

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3`);
        const text = await response.text();
        return text;
    } catch (error) {
        logMessage(`Error fetching weather data for ${city}: ${error.message}`);
        return `Could not fetch weather data for ${city}.`;
    }
}

// Function to handle tab switching
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tabContent => {
        tabContent.classList.remove('active');
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(tabButton => {
        tabButton.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tabName}')"]`).classList.add('active');
}
