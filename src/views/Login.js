import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { UserContext } from "../Usercontext";
import UXLogo from "../assets/images/logos/Act2State.png";
import backgroundIMG from "../assets/images/bg/seaside2.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser_id, user_id } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const postData = {
      username: username,
      password: password
    }

    try {
      const { data: user } = await axios.post('https://genux-backend-9f3x.onrender.com/login', postData);
      setUser_id(user.id);
      console.log(user_id);
      navigate("/user");
    } catch (error) {
        setMessage("Invalid username or password.");
    }
};


  return (
    <Row className="justify-content-center align-items-center vh-100">
      <Col xs={12} style={{ display: 'flex', padding: '0' }}>
        {/* Left CardBody with Background Image */}
        <Card className="card-image"
          style={{
            backgroundImage: `url(${backgroundIMG})`,
          }}
        >
          <CardBody
          ></CardBody>
        </Card>

        {/* Right CardBody with the Login Form */}
        <Card className="card-input">
          <CardBody className="card-body">
            <CardTitle className="card-title text-center">
              <h2 style={{ marginTop: '20px' }}>Welcome to Act2State!</h2>
            </CardTitle>
            <Form onSubmit={handleLogin}>
              <FormGroup>
                <Label className="label" htmlFor="username">
                  Username
                </Label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input"
                />
              </FormGroup>
              <FormGroup>
                <Label className="label" htmlFor="password">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </FormGroup>

              <div className="link-container">
                <p className="normal-link">Don't have an account?</p>
                <a href="/register" className="link">
                  Register Now!
                </a>
              </div>

              <div className="text-center">
                <Button
                  className="submit-button mt-2"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
              
            </Form>
            <p className="message">{message}</p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};


export default Login;
