function calculateFactorial(number) {
    let result = 1;
    for (let i = 2; i <= number; i++) {
      result *= i;
    }
    return result;
  }
  
  // Export the function to be used by the main thread
modules.exports = calculateFactorial;