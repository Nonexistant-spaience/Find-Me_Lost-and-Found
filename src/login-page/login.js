import React, { useState, useEffect } from "react";
import "./Login.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [formActive, setFormActive] = useState(false);

    const { login, demoAccount } = useAuth();
    const navigate = useNavigate();

    // Animation timing effect
    useEffect(() => {
        setFormActive(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/home");
        } catch (error) {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setEmail(demoAccount.email);
        setPassword(demoAccount.password);
        setError("");
        setLoading(true);

        try {
            await login(demoAccount.email, demoAccount.password);
            navigate("/home");
        } catch (error) {
            setError("Demo login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`modern-login-container ${
                props.theme === "dark" ? "dark" : ""
            }`}
        >
            <div className="login-image-section">
                <div className="overlay">
                    <div className="login-image-content">
                        <h2>Lost Something?</h2>
                        <p>
                            Find your items with our community-driven platform FInd Me
                        </p>
                    </div>
                </div>
            </div>

            <div className={`login-form-section ${formActive ? "active" : ""}`}>
                <div className="login-form-container">
                    <div className="login-header">
                        <div className="logo">
                            <span className="logo-icon">FM</span>
                        </div>
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to Find Me</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={loading}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="remember-forgot">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${
                                loading ? "loading" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        <div className="divider">
                            <span>or</span>
                        </div>

                        <button
                            type="button"
                            className="demo-button"
                            onClick={handleDemoLogin}
                            disabled={loading}
                        >
                            Try Demo Account
                        </button>
                    </form>

                    <div className="demo-info">
                        <p>Demo Email: {demoAccount.email}</p>
                        <p>Demo Password: {demoAccount.password}
                        <div className="login-footer">
                            <p>
                              Need help? <a href="#">Contact Support</a>
                            </p>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}
