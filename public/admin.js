// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

// Function to set game time
function setGameTime() {
    const gameTime = document.getElementById('gameTime').value;
    localStorage.setItem('gameTime', gameTime);
    alert('Game time set!');

    // Send update to user page via WebSocket
    ws.send(JSON.stringify({ action: 'setGameTime', gameTime }));
}

// Function to set ticket limit
function setTicketLimit() {
    const ticketLimit = document.getElementById('ticketLimit').value;
    localStorage.setItem('ticketLimit', ticketLimit);
    generateTickets(ticketLimit); // Generate tickets when limit is set
    alert('Ticket limit set!');

    // Send update to user page via WebSocket
    ws.send(JSON.stringify({ action: 'setTicketLimit', ticketLimit }));
}

// Function to book a ticket
function bookTicket() {
    const ticketNumber = document.getElementById('ticketNumber').value;
    const buyerName = document.getElementById('buyerName').value;

    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    // Update the ticket with the buyer's name
    if (tickets[ticketNumber - 1]) {
        tickets[ticketNumber - 1].buyer = buyerName;
        localStorage.setItem('tickets', JSON.stringify(tickets));
        alert(`Ticket ${ticketNumber} booked for ${buyerName}!`);

        // Send update to user page via WebSocket
        ws.send(JSON.stringify({ action: 'bookTicket', ticketNumber, buyerName }));
    } else {
        alert('Invalid ticket number!');
    }
}

// Function to generate Tambola tickets
function generateTickets(limit) {
    let tickets = [];
    for (let i = 0; i < limit; i++) {
        tickets.push(generateSingleTicket());
    }
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // Optionally send the generated tickets to the user page if needed
    ws.send(JSON.stringify({ action: 'generateTickets', tickets }));
}

// Function to generate a single Tambola ticket
function generateSingleTicket() {
    let ticket = { numbers: [], buyer: null };

    for (let i = 0; i < 3; i++) {
        let row = Array(9).fill(null);
        let numbers = [];

        // Get 5 random numbers in the row
        while (numbers.length < 5) {
            let num = Math.floor(Math.random() * 90) + 1;
            let col = Math.floor((num - 1) / 10);

            if (!row[col] && !numbers.includes(num)) {
                row[col] = num;
                numbers.push(num);
            }
        }

        ticket.numbers.push(row);
    }

    return ticket;
}


// admin.js

// Function to start the game
function startGame() {
    // Send a signal to all clients to start the game
    sendToClients('startGame');
}

// Function to call a number
function callNumber() {
    // Prompt for a number (or integrate with a better system)
    const number = prompt("Enter a number to call (1-90):");
    if (number && number >= 1 && number <= 90) {
        // Send the number to all clients
        sendToClients('callNumber', number);
    } else {
        alert("Invalid number. Please enter a number between 1 and 90.");
    }
}

// Function to reset the game
function resetGame() {
    // Send a signal to all clients to reset the game
    sendToClients('resetGame');
}

// Function to send messages to all clients
function sendToClients(action, data) {
    // Example WebSocket setup (replace with your actual setup)
    const socket = new WebSocket('ws://your-websocket-server');
    socket.onopen = function() {
        socket.send(JSON.stringify({ action, data }));
    };
}

// Event listeners for buttons
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('call-number').addEventListener('click', callNumber);
document.getElementById('reset-game').addEventListener('click', resetGame);
