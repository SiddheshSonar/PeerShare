import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { default as Visibility } from '@mui/icons-material/Visibility';
import { default as VisibilityOff } from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';

interface LoginInfo {
    email: string;
    password: string;
}

interface SignupInfo {
    name: string;
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const [loginInfo, setLoginInfo] = useState<LoginInfo>({ email: '', password: '' });
    const [signupInfo, setSignupInfo] = useState<SignupInfo>({
        name: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [signIn, setSignIn] = useState(true);
    const [btnName, setBtnName] = useState('Log In');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleClickShowLoginPassword = () => setShowLoginPassword((show) => !show);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(signupInfo)
        if (!signupInfo.name || !signupInfo.email || !signupInfo.password) {
            toast.error('Please fill all the fields');
            // toggleSignIn(false);
            return;
        }
        if (signupInfo.password !== confirmPassword) {
            toast.error('Passwords do not match');
            // toggleSignIn(false);
            return;
        }
        console.log("signing up");
        // post request to the server
        await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupInfo),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.error) {
                toast.error(data.error);
                return;
            }
            toast.success(data.message);
            setSignIn(true);
            setSignupInfo({ name: '', email: '', password: '' });
        })
        .catch((err) => {
            console.log(err);
            toast.error('An error occurred');
        });
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loginInfo);
        setBtnName('Logging In...');
        if (!loginInfo.email || !loginInfo.password) {
            toast.error('Please fill all the fields');
            setBtnName('Log In');
            // toggleSignIn(true);
            return;
        }
        console.log("logging in");
        // post request to the server
        await fetch('http://localhost:5000/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginInfo),
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.status === 0) {
                toast.error(data.message);
                setBtnName('Log In');
                return;
            }
            toast.success(data.message);
            localStorage.setItem('token', data.data.uid);
            localStorage.setItem('user', JSON.stringify(data.data));
            window.location.href = '/share';
        })
        .catch((err) => {
            console.log(err);
            // toast.error('An error occurred');
            setBtnName('Log In');
        });
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Inter, sans-serif",
        }}>
            <div
            style={{
                // a box for the login form and signup form
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                gap: "20px",
                width: "40%",
                height: "fit-content",
                padding: "50px",
                backgroundColor: "#fff",
                borderRadius: "20px",
                boxShadow: "0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",
            }} 
            >
                <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                    gap: "10px",
                }} 
                >
                    {/* title */}
                    <div
                    style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                    >
                        Welcome to PeerShare!
                    </div>
                    <div
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#9b69f1",
                    }} 
                    >
                        {signIn ? "Log In" : "Sign Up"}
                    </div>
                </div>
                <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "100%",
                    gap: "10px",
                    padding: "10px",
                }} 
                >
                    {
                        signIn ? (
                        <form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                width: "100%",
                            }}
                            onSubmit={handleLogin}
                            >
                                <TextField
                                label="Email"
                                variant="outlined"
                                value={loginInfo.email}
                                onChange={(e) => setLoginInfo({ ...loginInfo, email: e.target.value })}
                                />
                                <TextField
                                label="Password"
                                variant="outlined"
                                type={showLoginPassword ? "text" : "password"}
                                value={loginInfo.password}
                                onChange={(e) => setLoginInfo({ ...loginInfo, password: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                        onClick={handleClickShowLoginPassword}
                                        >
                                            {showLoginPassword ? <VisibilityOff /> : <Visibility /> }
                                        </IconButton>
                                    )
                                }}
                                />
                                <button
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: "#7c3aed",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                }}
                                >
                                    {btnName}
                                </button>
                                <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                >
                                    <div
                                    style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        opacity: 0.8,
                                    }}
                                    onClick={() => setSignIn(false)}
                                    >
                                        New to PeerShare? Sign Up
                                    </div>
                                    {/* <div
                                    style={{
                                        color: "#000",
                                        cursor: "pointer",
                                    }}
                                    >
                                        Forgot Password?
                                    </div> */}
                                </div>
                            </form>
                        ) : (
                            <form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                width: "100%",
                            }}
                            onSubmit={handleSignup}
                            >
                                <TextField
                                label="Name"
                                variant="outlined"
                                value={signupInfo.name}
                                onChange={(e) => setSignupInfo({ ...signupInfo, name: e.target.value })}
                                />
                                <TextField
                                label="Email"
                                variant="outlined"
                                value={signupInfo.email}
                                onChange={(e) => setSignupInfo({ ...signupInfo, email: e.target.value })}
                                />
                                <TextField
                                label="Password"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                value={signupInfo.password}
                                onChange={(e) => setSignupInfo({ ...signupInfo, password: e.target.value })}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                        onClick={handleClickShowPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility /> }
                                        </IconButton>
                                    )
                                }}
                                />
                                <TextField
                                label="Confirm Password"
                                variant="outlined"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                        onClick={handleClickShowConfirmPassword}
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility /> }
                                        </IconButton>
                                    )
                                }}
                                />
                                <button
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    backgroundColor: "#7c3aed",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                }}
                                >
                                    Sign Up
                                </button>
                                <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                                >
                                    <div
                                    style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        opacity: 0.8,
                                    }}
                                    onClick={() => setSignIn(true)}
                                    >
                                        Already have an account? Log In
                                    </div>
                                </div>
                            </form>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Login;