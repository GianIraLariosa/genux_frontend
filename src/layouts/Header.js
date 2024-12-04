import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Collapse, Nav, NavItem, Navbar } from "reactstrap";
import { UserContext } from '../../src/Usercontext';
import UXLogo from "../assets/images/logos/Act2StateBorder.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { setUser_id, setOrg_id } = useContext(UserContext);
  const { user_id } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        "http://localhost/metro%20events/verify.php",
        {
          params: {
            user_id,
          },
        }
      );

      if (response.data.message) {
        const { message, user } = response.data;
        if (message === "organizer") {
          navigate(`/organizer`);
          setOrg_id(user.organizer_id);
          setUser_id(user.user_id);
        } else if (message === "admin") {
          navigate(`/admin`);
          setUser_id(user.user_id);
        } else if (message === "user") {
          navigate(`/user`);
          setUser_id(user.user_id);
        }
      } else if (response.data.error) {
        setMessage(response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  const handlelogout = () => {
    setUser_id(null);
  }

  const toggle = () => setIsOpen((prevState) => !prevState);
  const showMobilemenu = () =>
    document.getElementById("sidebarArea").classList.toggle("showSidebar");

  return (
    <Navbar color="primary" expand="md">
      <div className="d-flex align-items-center">
        <Button
          color="primary"
          className="d-lg-none"
          onClick={showMobilemenu}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
      
      <Collapse navbar isOpen={isOpen}>
        <Nav className="me-auto" navbar>
          <NavItem>
          <Link to="/user" className="nav-link" onClick={handleLogin}>
            <img
              src={UXLogo}
              alt="profile"
              className="rounded-circle"
              width="35"
              style={{
                //border: "2px solid white", // Add a white border
                cursor: "pointer"          // Add pointer cursor to indicate clickability
              }}
            />
          </Link>
          </NavItem>
          <NavItem>
            <Link to= '/login' className="nav-link d-flex align-items-center" onClick={handlelogout} style={{
              height: "100%",       // Ensure the parent container height is utilized
              justifyContent: "center", // Center the text horizontally
              textAlign: "center",  // Ensure proper centering for text
            }}>
              Logout
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
