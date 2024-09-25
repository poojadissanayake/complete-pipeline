const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('review');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('Feedback message', input.value);
        input.value = '';
    }
});