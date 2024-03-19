const calculateFibonacci = (number) => {
    if (number <= 1) {
      return number;
    }
    return calculateFibonacci(number - 1) + calculateFibonacci(number - 2);
  };

  export default calculateFibonacci;
  
  