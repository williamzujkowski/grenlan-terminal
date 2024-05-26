// Configuration file for terminal emulator

// Placeholder for user information
let userInfo = {};

// User and URL information
let current_user = 'guest'; // Initialize with 'guest', will be updated after fetching user data
const root_url = 'grenlan.com';
let promptText = `${current_user}@${root_url}:~$`; // Initialize, will be updated

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
