class Process {
  constructor(id) {
    this.id = id;
    this.logicalClock = 0;
    this.events = [];
  }

  sendMessage(message, targetProcess) {
    this.logicalClock++;
    const timestampedMessage = {
      sender: this.id,
      timestamp: this.logicalClock,
      message,
    };
    
    targetProcess.receiveMessage(timestampedMessage);
  }

  receiveMessage(message) {
    this.logicalClock = Math.max(this.logicalClock, message.timestamp) + 1;
    
    const event = `Received ${message.message} from ${message.sender} (timestamp: ${message.timestamp})`;
    this.events.push({ timestamp: this.logicalClock, event });

    console.log(`[Process ${this.id}] ${event}`);
  }
}

export default Process;