// fibonacciWorker.js

const calculateFibonacci = (number) => {
    if (number <= 1) {
      return number;
    }
    return calculateFibonacci(number - 1) + calculateFibonacci(number - 2);
  };
  
  self.addEventListener('message', (event) => {
    const { number } = event.data;
    const result = calculateFibonacci(number);
    self.postMessage(result);
  });
  