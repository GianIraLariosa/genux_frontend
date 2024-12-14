import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Collapse, Nav, NavItem, Navbar, Tooltip } from "reactstrap";
import { UserContext } from '../../src/Usercontext';
import UXLogo from "../assets/images/logos/Act2StateBorder.png";
import 'react-tooltip/dist/react-tooltip.css'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { setUser_id, setOrg_id } = useContext(UserContext);
  const { user_id } = useContext(UserContext);
  const navigate = useNavigate();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

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
      <Nav className="me-auto d-flex align-items-center" navbar>
        <NavItem className="d-flex align-items-center">
          <Link to="/user" className="nav-link p-0" onClick={handleLogin}>
            <img
              src={UXLogo}
              alt="profile"
              className="rounded-circle"
              width="35"
              style={{
                cursor: "pointer", // Add pointer cursor to indicate clickability
              }}
            />
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/login"
            className="nav-link d-flex align-items-center"
            onClick={handlelogout}
            style={{
              height: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Logout
          </Link>
        </NavItem>
      </Nav>
      <Nav id="faq-nav-item" className="ms-auto d-flex align-items-center" navbar>
        <NavItem>
          <Link
            to="/faq"
            className="nav-link d-flex align-items-center"
            style={{
              height: "100%",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <i className="bi bi-question-circle fs-2"></i>
            <Tooltip
              placement="bottom"
              isOpen={tooltipOpen}
              target="faq-nav-item"
              toggle={toggleTooltip}
            >
              Frequently Asked Questions
            </Tooltip>
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;
