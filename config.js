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
    'bored': async () => fetchActivity(),
    'clear': () => { output.innerHTML = ''; return ''; },
    'date': () => new Date().toLocaleString(),
    'echo': (args) => args.join(' '),
    'emacs': () => `A versatile text editor. Try it out!`,
    'exit': () => 'Please close the tab to exit.',
    'github': () => openLink('https://github.com/williamzujkowski'),
    'help': () => {
        return `Available commands:\n
        advice - Get a piece of advice\n
        bored - Get an activity suggestion to combat boredom\n
        clear - Clear the terminal\n
        date - Display the current date and time\n
        echo [text] - Echo the input text\n
        emacs - A versatile text editor. Try it out!\n
        exit - Display a message to close the tab\n
        github - Open GitHub profile\n
        help - Display available commands and descriptions\n
        hostname - Display the current hostname\n
        ipinfo - Display IP information\n
        joke - Display a random programming joke\n
        linkedin - Open LinkedIn profile\n
        quote - Display a random quote with a link to more quotes\n
        sudo [command] - Attempt to run a command as root\n
        userinfo - Display information about the current user\n
        vi - An efficient text editor. Try it out!\n
        vim - An improved version of vi. Try it out!\n
        weather [city] - Fetch and display weather information for a city\n
        whoami - Display the current user`;
    },
    'hostname': () => root_url,
    'ipinfo': () => JSON.stringify(ipData, null, 2),
    'joke': async () => fetchJoke(),
    'linkedin': () => openLink('https://www.linkedin.com/in/williamzujkowski/'),
    'quote': () => {
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        return `${randomComment} <a href="https://quotes.yourdictionary.com/theme/motivational/" target="_blank">More quotes</a>`;
    },
    'sudo': (args) => {
        openLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        return `Permission denied: unable to run the command '${args[0]}' as root.`;
    },
    'userinfo': () => displayUserInfo(),
    'vi': () => `An efficient text editor. Try it out!`,
    'vim': () => `An improved version of vi. Try it out!`,
    'weather': async (args) => handleWeatherCommand(args),
    'whoami': () => current_user
};
