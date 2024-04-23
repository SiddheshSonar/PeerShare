import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from "./store";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const token = localStorage.getItem("token");

root.render(
    <Provider store={store}>
        <div
        style={{
            width: "100%",
            height: "100vh",
            backgroundColor: "#f0f2f5"
        }}
        >
            {/* <App /> */}
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/share" element={<App />} />
                </Routes>
            </Router>
        </div>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
