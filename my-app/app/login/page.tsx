"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  name: string;
  email: string;
}

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check login state on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsSubmitting(false);
      const authenticatedUser = {
        name: isSignUp ? name : email.split("@")[0],
        email: email,
      };

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(authenticatedUser));

      // Redirect back to home
      window.location.href = "/";
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    const authenticatedUser = {
      name: "Google User",
      email: "googleuser@example.com",
    };

    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(authenticatedUser));

    // Redirect back to home
    window.location.href = "/";
  };

  const getFirstName = (fullName: string) => {
    if (!fullName) return "";
    return fullName.trim().split(" ")[0];
  };

  return (
    <>
      <nav className="navbar">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="navbar-logo" style={{ cursor: "pointer" }}>Resume Booster</span>
        </Link>
        <div className="navbar-right">
          {user ? (
            <Link href="/history" className="navbar-link">
              History
            </Link>
          ) : (
            <Link href="/login" className="navbar-link">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="main-container">
        <div className="form-container" style={{ maxWidth: "400px", marginTop: "2rem" }}>
          {!isSignUp ? (
            /* Login State */
            <>
              <div className="header-section" style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>
                  Sign in to save your results
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label" style={{ display: "none" }}>
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="input-text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Continue with Email"}
                </button>
              </form>

              <div className="divider">
                <span className="divider-text">or</span>
              </div>

              <button onClick={handleGoogleSignIn} className="btn-google">
                Continue with Google
              </button>

              <p className="auth-subtext">
                Don't have an account?
                <span onClick={() => setIsSignUp(true)} className="toggle-link">
                  Sign up
                </span>
              </p>
            </>
          ) : (
            /* Signup State */
            <>
              <div className="header-section" style={{ marginBottom: "2rem" }}>
                <h1 className="page-title" style={{ fontSize: "2rem" }}>
                  Create your account
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                  <label htmlFor="signup-name" className="form-label" style={{ display: "none" }}>
                    Your Name
                  </label>
                  <input
                    id="signup-name"
                    type="text"
                    className="input-text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="signup-email" className="form-label" style={{ display: "none" }}>
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    className="input-text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Create Account"}
                </button>
              </form>

              <p className="auth-subtext">
                Already have an account?
                <span onClick={() => setIsSignUp(false)} className="toggle-link">
                  Log in
                </span>
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
