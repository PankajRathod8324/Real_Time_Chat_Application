const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)

socket.emit('join', name);

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
});


// Load the sound file
const notificationSound = new Audio('/audio.mp3');


function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

    // Play the notification sound
    playNotificationSound();

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv);

    // Play the notification sound for incoming messages
    if (type === 'incoming') {
        playNotificationSound();
    }
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

// Function to play the notification sound
function playNotificationSound() {
    notificationSound.play();
}

// Receive system messages for user join/leave
socket.on('system', (msg) => {
    appendSystemMessage(msg);
    scrollToBottom();
});



function appendSystemMessage(msg) {
    let systemDiv = document.createElement('div');
    systemDiv.classList.add('system', 'message');

    let markup = `
        <p>${msg}</p>
    `;
    systemDiv.innerHTML = markup;
    messageArea.appendChild(systemDiv);
}


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}


