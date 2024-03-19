import axios from 'axios';
import Process from './process.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const clients = [];

function sendMessageToServer(sender, message) {
  sender.sendMessage(message, {
    receiveMessage: (timestampedMessage) => {
      axios.post('http://localhost:3000/message', timestampedMessage)
        .then(() => {
          console.log(`[${sender.id}] Sent ${message} (timestamp: ${timestampedMessage.timestamp})`);
          promptUser();
        })
        .catch((error) => {
          console.error(`[${sender.id}] Error sending message: ${error}`);
          promptUser();
        });
    }
  });
}

function createClient() {
  const clientId = `client${clients.length + 1}`;
  const client = new Process(clientId);
  clients.push(client);
  console.log(`Created client with ID: ${clientId}`);
  promptUser(); // Prompt again after creating client
}

function sendMessage() {
  rl.question('Client ID:', (clientId) => {
    if (clients.find(c => c.id === clientId)) {
      rl.question('Message: ', (message) => {
        const client = clients.find(c => c.id === clientId);
        sendMessageToServer(client, message);
      });
    } else {
      console.log(`Client with ID ${clientId} not found.`);
      promptUser(); // Prompt again after error
    }
  });
}

function displayMenu() {
  console.log('1. Create a new client');
  console.log('2. Send a message');
  console.log('3. Exit');
}

function promptUser() {
  displayMenu();
  rl.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        createClient();
        break;
      case '2':
        sendMessage();
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Invalid choice');
        promptUser();
    }
  });
}

promptUser();
