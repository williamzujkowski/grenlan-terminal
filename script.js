// Summary:
// This script creates a terminal emulator in a web page that supports various commands,
// fetches and displays IP information, user information, a programming joke, and a historical event from today's date.

// Terminal elements
const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('input');
const logElement = document.getElementById('log'); // Log element for debugging

// Placeholder for IP and history data
let ipData = null;
let historyData = null;

// Log message to console and log element
function logMessage(message) {
  console.log(message);
  const logEntry = document.createElement('div');
  logEntry.textContent = message;
  logElement.appendChild(logEntry);
}

// Event listener for handling command input
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const [command, ...args] = input.value.trim().split(' ');
    processCommand(command, args);
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

  output.appendChild(document.createElement('br'));
  terminal.scrollTop = terminal.scrollHeight;
  setTimeout(() => { input.focus(); }, 2000);
}

// Open a URL in a new tab
function openLink(url) {
  window.open(url, '_blank');
}

// Fetch weather information for a given city
async function handleWeatherCommand(args) {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather Brussels';
  }

  try {
    const response = await fetch(`https://wttr.in/${city}?ATm`);
    const text = await response.text();
    return text;
  } catch (error) {
    logMessage(`Error fetching weather data for ${city}: ${error.message}`);
    return `Could not fetch weather data for ${city}.`;
  }
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

// Fetch a random activity suggestion to combat boredom
async function fetchActivity() {
  try {
    const response = await fetch('https://www.boredapi.com/api/activity/');
    const activity = await response.json();
    return activity.activity;
  } catch (error) {
    logMessage(`Error fetching activity: ${error.message}`);
    return 'Error fetching activity suggestion.';
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
    promptText = `${current_user}@${root_url}:~$`; // Update promptText with the current user
    const { city, region, country } = ipData;
    const timestamp = new Date().toLocaleString();
    output.innerHTML += `
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">[${timestamp}] login detected from ${city}, ${region}, ${country}.</pre></div><br/>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Welcome, ${userInfo.name.first} ${userInfo.name.last}!</pre></div><br/>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Joke: ${joke}</pre></div><br/>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Today in History: ${historyEvent}</pre></div><br/>
        <div class="line"><span class="prompt">${promptText}</span><pre class="content">Type 'help' to see list of available commands.</pre></div><br/>
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
