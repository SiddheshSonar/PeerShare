class Process {
  constructor(id) {
    this.id = id;
    this.logicalClock = 0;
    this.events = [];
  }

  sendMessage(message, targetProcess) {
    // Increment the logical clock before sending a message
    this.logicalClock++;
    const timestampedMessage = {
      sender: this.id,
      timestamp: this.logicalClock,
      message,
    };

    // Send the timestamped message to the target process
    targetProcess.receiveMessage(timestampedMessage);
  }

  receiveMessage(message) {
    // Update the logical clock based on the received timestamp
    this.logicalClock = Math.max(this.logicalClock, message.timestamp) + 1;

    // Record the received event with its timestamp
    const event = `Received ${message.message} from ${message.sender} (timestamp: ${message.timestamp})`;
    this.events.push({ timestamp: this.logicalClock, event });

    console.log(`[Process ${this.id}] ${event}`);
  }
}

export default Process;