// Establish WebSocket connection
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);

    switch (data.action) {
        case 'setGameTime':
            updateCountdown();
            break;
        case 'setTicketLimit':
        case 'generateTickets':
            loadTickets();
            break;
        case 'bookTicket':
            loadTickets();
            break;
        default:
            console.log('Unknown action:', data.action);
    }
};

// Function to update the countdown timer
function updateCountdown() {
    const gameTime = localStorage.getItem('gameTime');
    if (gameTime) {
        const gameDate = new Date(gameTime);
        const now = new Date();
        const timeLeft = gameDate - now;

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            document.getElementById('countdown').innerHTML = `${hours}h ${minutes}m ${seconds}s`;
        } else {
            document.getElementById('countdown').innerHTML = 'Game has started!';
        }
    }
}

// Function to load and display the tickets
function loadTickets() {
    const ticketList = document.getElementById('ticketList');
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    ticketList.innerHTML = ''; // Clear existing tickets

    tickets.forEach((ticket, index) => {
        const ticketBox = document.createElement('div');
        ticketBox.className = 'ticket-box';
        
        const ticketNumber = document.createElement('h3');
        ticketNumber.textContent = `Ticket ${index + 1}`;
        
        ticketBox.appendChild(ticketNumber);

        ticket.numbers.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'ticket-row';
            row.forEach(num => {
                const numBox = document.createElement('div');
                numBox.className = 'num-box';
                numBox.textContent = num || ''; // Display number or empty box
                rowDiv.appendChild(numBox);
            });
            ticketBox.appendChild(rowDiv);
        });

        const buyerInfo = document.createElement('p');
        buyerInfo.textContent = ticket.buyer ? `Booked by: ${ticket.buyer}` : 'Book this ticket';
        ticketBox.appendChild(buyerInfo);

        if (!ticket.buyer) {
            const bookLink = document.createElement('a');
            bookLink.href = `https://wa.me/?text=I%20want%20to%20book%20Ticket%20${index + 1}`;
            bookLink.textContent = 'Book this ticket';
            ticketBox.appendChild(bookLink);
        }

        ticketList.appendChild(ticketBox);
    });
}

// Function to search a ticket by number
function searchTicket() {
    const ticketNumber = document.getElementById('searchTicketNumber').value;
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    if (ticketNumber > 0 && ticketNumber <= tickets.length) {
        const ticket = tickets[ticketNumber - 1];
        alert(`Ticket ${ticketNumber} - ${ticket.buyer ? 'Booked by ' + ticket.buyer : 'Not booked'}`);
    } else {
        alert('Ticket not found!');
    }
}

// Load tickets and start countdown on page load
window.onload = function() {
    loadTickets();
    setInterval(updateCountdown, 1000); // Update countdown every second
};


// user.js

// Initialize board
function initializeBoard() {
    const boardContainer = document.getElementById('board');
    const table = document.createElement('table');
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('td');
            cell.textContent = i * 10 + j + 1;
            cell.id = `cell-${i * 10 + j + 1}`;
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    boardContainer.appendChild(table);
}

// Mark number on board
function markNumber(number) {
    const cell = document.getElementById(`cell-${number}`);
    if (cell) {
        cell.classList.add('marked');
    }
}

// Update called numbers display
function updateCalledNumbers(number) {
    const calledNumbersContainer = document.getElementById('called-numbers');
    const numberElement = document.createElement('span');
    numberElement.textContent = number;
    calledNumbersContainer.appendChild(numberElement);
}

// Example function for handling number call
function onNumberCalled(number) {
    markNumber(number);
    updateCalledNumbers(number);
}

// Initialize board on page load
document.addEventListener('DOMContentLoaded', initializeBoard);

// Function to announce a number
function announceNumber(number) {
    const utterance = new SpeechSynthesisUtterance(number.toString());
    speechSynthesis.speak(utterance);
}

// Example function for handling number call with voice
function onNumberCalled(number) {
    markNumber(number);
    updateCalledNumbers(number);
    announceNumber(number);
}

// Example ticket data
const userTicket = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15]
];

// Function to mark number on ticket
function markTicketNumber(number) {
    for (let row of userTicket) {
        const index = row.indexOf(number);
        if (index !== -1) {
            row[index] = 'X'; // Mark the number
            break;
        }
    }
    // Update ticket display
    updateTicketDisplay();
}

// Function to update ticket display
function updateTicketDisplay() {
    const ticketContainer = document.getElementById('ticket');
    ticketContainer.innerHTML = ''; // Clear current display
    userTicket.forEach(row => {
        const rowDiv = document.createElement('div');
        row.forEach(num => {
            const numElement = document.createElement('span');
            numElement.textContent = num;
            numElement.classList.add(num === 'X' ? 'marked' : 'unmarked');
            rowDiv.appendChild(numElement);
        });
        ticketContainer.appendChild(rowDiv);
    });
}

// Modify onNumberCalled function to include ticket marking
function onNumberCalled(number) {
    markNumber(number);
    updateCalledNumbers(number);
    markTicketNumber(number);
    announceNumber(number);
}

// Hide ticket list when game starts
function startGame() {
    const ticketContainer = document.getElementById('ticket');
    ticketContainer.style.display = 'none'; // Hide the ticket list
    // Show search bar
    const searchBar = document.getElementById('search-bar');
    searchBar.style.display = 'block';
}

// Search ticket function
function searchTicket(ticketNumber) {
    // Filter tickets based on search
    const tickets = document.querySelectorAll('#ticket span');
    tickets.forEach(ticket => {
        if (ticket.textContent.includes(ticketNumber)) {
            ticket.parentElement.style.display = 'block'; // Show matching ticket
        } else {
            ticket.parentElement.style.display = 'none'; // Hide non-matching ticket
        }
    });
}

// Example event listener for search input
document.getElementById('search-input').addEventListener('input', function () {
    searchTicket(this.value);
});
