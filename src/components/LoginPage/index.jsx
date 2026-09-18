import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import Login from "../../assets/images/png/Login.png";
import Watermark from "../../assets/images/watermark.jpeg";
import { AppContext } from "../../services/AppContext";
import Logo from "../../assets/images/png/vajra.png";
import MahaLogo from "../../assets/images/png/maha.png";

import LocationSetupDialog from "../LocationSetup/LocationSetupDialog";

const LoginPage = () => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  
  const { token, setToken, setUserRole, username, setUsername } = useContext(AppContext);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:51270";

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getListofLoginRoles`);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setValidationMessages(["Failed to fetch roles. Please try again later."]);
    }
  };

  // Location setup for new LDAP users
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);








  const fetchLoginDetails = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/authenticate`, {
        username,
        password,
      });
      console.log("Login Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleLocationSetupComplete = (newJwt) => {
    sessionStorage.setItem("token", newJwt);
    setToken(newJwt);
    setShowLocationSetup(false);
    setPendingToken(null);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const messages = [];
    if (!username) messages.push("Please enter the username.");
    if (!password) messages.push("Please enter the password.");

    setValidationMessages(messages);
    if (messages.length > 0) return;

    try {
      const data = await fetchLoginDetails(username, password);
      if (!data || !data.jwt) {
        setValidationMessages(["Invalid credentials. Please try again."]);
      } else if (data.needsLocationSetup === true) {
        // NEW LDAP user – show mandatory location dialog (do not navigate yet)
        setPendingToken(data.jwt);
        setShowLocationSetup(true);
      } else {
        // Existing user – normal flow
        sessionStorage.setItem("token", data.jwt);
        setToken(data.jwt);
        navigate("/");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Please try again.";
      setValidationMessages([errorMessage]);
    }
  };


  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const styles = {
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${Login})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      zIndex: -1,
    },
    wrapper: {
      width: "85%",
      maxWidth: "320px",
      padding: "20px",
      margin: "auto",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      position: "absolute",
      top: "40%",
      left: "80%",
      transform: "translate(-50%, -50%)",
      zIndex: 1,
    },
    watermark: {
      position: "absolute",
      top: 10,
      left: 0,
      width: "100%",
      height: "90%",
      backgroundImage: `url(${Watermark})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      opacity: 0.2,
      zIndex: -1,
      paddingTop: 1,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    welcomeContainer: {
      marginBottom: "15px",
      textAlign: "center",
    },
    welcomeTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#007BFF",
      margin: "0 0 5px 0",
    },
    inputBox: {
      textAlign: "left",
    },
    label: {
      display: "block",
      marginBottom: "2px",
      fontSize: "14px",
      color: "#333",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      color: "#333",
      boxSizing: "border-box",
      outline: "none",
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    showPasswordButton: {
      position: "absolute",
      right: "8px",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      color: "#666",
      outline: "none",
    },
    button: {
      padding: "10px",
      fontSize: "14px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "#0056b3",
      },
    },
    logoContainer: {
      position: "absolute",
      top: "15px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 15px",
      zIndex: 2,
    },
    Logo: {
      width: "100px",
      height: "auto",
    },
    MahaLogo: {
      width: "100px",
      height: "auto",
    },
    quoteContainer: {
      position: "fixed",
      bottom: "15px",
      left: "15px",
      textAlign: "center",
      fontSize: "20px",
      fontStyle: "italic",
      fontWeight: "bold",
      color: "orange",
      padding: "6px 10px",
      borderRadius: "6px",
    },
    validationContainer: {
      textAlign: "center",
      marginBottom: "10px",
    },
    validationMessage: {
      color: "red",
      fontSize: "12px",
      marginBottom: "4px",
    },
    successMessage: {
      color: "green",
      fontSize: "12px",
      marginBottom: "4px",
    },
    divider: {
      border: "none",
      borderTop: "1px solid #e0e0e0",
      margin: "10px 0",
    },
  };

  if (token) return <Navigate to="/" />;

  return (
    <div>
      <div style={styles.logoContainer}>
        <img src={Logo} alt="Logo" style={styles.Logo} />
        <img src={MahaLogo} alt="MahaLogo" style={styles.MahaLogo} />
      </div>
      <div style={styles.background}></div>
      
      {/* Login Form */}
      <div style={styles.wrapper}>
        <div style={styles.watermark}></div>
        
        {/* Welcome Section */}
        <div style={styles.welcomeContainer}>
          <h2 style={styles.welcomeTitle}>Welcome Back!</h2>
          <hr style={styles.divider} />
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {validationMessages.length > 0 && (
            <div style={styles.validationContainer}>
              {validationMessages.map((message, index) => (
                <div key={index} style={styles.validationMessage}>
                  {message}
                </div>
              ))}
            </div>
          )}
          
          <div style={styles.inputBox}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your username"
            />
          </div>
          
          <div style={styles.inputBox}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: "30px" }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.showPasswordButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙊" : "👀"}
              </button>
            </div>
          </div>
          
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>

      <p style={{ marginTop: "130px", marginLeft: "430px", fontWeight: "900", fontSize: "35px", color: "rgba(128,128,128,0.3)", backgroundColor: "transparent" }}>
        IoT Based
      </p>
      <p style={{ marginLeft: "250px", fontWeight: "900", fontSize: "35px", color: "rgba(128,128,128,0.3)", backgroundColor: "transparent" }}>
        Remote Battery Monitoring System
      </p>
      <p style={{ marginLeft: "250px", fontWeight: "900", fontSize: "35px", color: "rgba(128,128,128,0.3)", backgroundColor: "transparent" }}>
        Battery Charger Monitoring System
      </p>

      {/* Mandatory location setup for NEW LDAP users */}
      <LocationSetupDialog
        open={showLocationSetup}
        token={pendingToken}
        onComplete={handleLocationSetupComplete}
      />
    </div>
  );
};

export default LoginPage;
