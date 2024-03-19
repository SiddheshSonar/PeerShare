import React, { useState, useEffect } from 'react';
import { useWorker, WORKER_STATUS } from "@koale/useworker";
import { useToasts } from "react-toast-notifications";
import { ToastProvider } from "react-toast-notifications";
import calculateFibonacci from './fibCalc';

let turn = 0;
function infiniteLoop() {
  const lgoo = document.querySelector(".App-logo");
  turn += 8;
  lgoo.style.transform = `rotate(${turn % 360}deg)`;
}

const App = () => {
  const { addToast } = useToasts();
  const [fibonacci, setFibonacci] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [
    fibonacciWorker,
    { status: workerStatus, kill: killWorker }
  ] = useWorker(
    calculateFibonacci
  )

//   const [
//     fibonacciWorker,
//     { status: workerStatus, kill: killWorker }
//   ] = useWorker(

//     new Worker(new URL("./fibonacciWorker.js", import.meta.url), {
//         type: "module",
//         }),
//         {
//         autoTerminate: true,
//         }   
//     );

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleCalculateWithWorker = () => {
    setLoading(true);
    const n = parseInt(input);
    if (!isNaN(n)) {
      fibonacciWorker(n).then(result => {
        console.log("Fibonacci with Worker:", result)
        setFibonacci(result);
        setLoading(false);
        addToast("Finished: Fibonacci calculation using worker.", { appearance: "success" });
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
        addToast("Error: Fibonacci calculation using worker.", { appearance: "error" });
      });
    }
  };

  useEffect(() => {
    const loopInterval = setInterval(infiniteLoop, 100);
    return () => clearInterval(loopInterval);
  }, []);

  return (
    <div>
      <h2>Fibonacci Calculator</h2>
      <label>Enter a number:</label>
      <input type="text" value={input} onChange={handleChange} />
      <button
        type="button"
        disabled={workerStatus === WORKER_STATUS.RUNNING}
        onClick={() => {
          const n = parseInt(input);
          if (!isNaN(n)) {
            setLoading(true);
            const result = calculateFibonacci(n);
            setFibonacci(result);
            setLoading(false);
            addToast("Finished: Fibonacci calculation without worker.", { appearance: "success" });
          }
        }}
      >
        Calculate without Worker
      </button>
      <button
        type="button"
        disabled={workerStatus === WORKER_STATUS.RUNNING}
        onClick={handleCalculateWithWorker}
      >
        {workerStatus === WORKER_STATUS.RUNNING ? "Calculating..." : "Calculate with Worker"}
      </button>
      <p>Fibonacci: {loading ? "Loading" : fibonacci}</p>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}>
        <img 
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/84cd937a-a7c5-4c5f-8c5c-66d44b69666d/d1yea3k-83e755c6-53f4-4497-9560-293cef7cd341.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg0Y2Q5MzdhLWE3YzUtNGM1Zi04YzVjLTY2ZDQ0YjY5NjY2ZFwvZDF5ZWEzay04M2U3NTVjNi01M2Y0LTQ0OTctOTU2MC0yOTNjZWY3Y2QzNDEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Zxv-vZmS_ejkDtOApfL9iS_8TDvEhFgz0bDWMUXUScg" 
          alt="circle"
          width="400px" 
          className='App-logo'
        />
      </div>
    </div>
  );
};

export default App;
