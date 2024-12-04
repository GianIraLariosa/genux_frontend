import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  Button, Form,
  FormGroup,
  Label,
  Input } from 'reactstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UXLogo from "../assets/images/logos/Act2State.png";
const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const axiosPostData = async() => {
    const postData = {
      firstName: firstName,
      lastname: lastName,
      username: username,
      password: password,
    }

    try{
      await axios.post('https://genux-backend-9f3x.onrender.com/registration', postData)
        .then(res => setMessage(<p>{res.data}</p>));
    } catch (error) {
      setMessage('Error');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName) {
      setMessage('Firstname is empty');
      return;
    }
    if (!lastName) {
      setMessage('Lastname is empty');
      return;
    }
    if (!username) {
      setMessage('Username is empty');
      return;
    }
    if (!password) {
      setMessage('Password is empty');
      return;
    }
  
    setMessage('');
    await axiosPostData();
  };

  return (
    <Row style={{ justifyContent: 'center' }}>
      <Col style={{ maxWidth: '800px' }}>
        <Card>
        <CardTitle
            tag="h2"
            className="p-3 mb-0"
            style={{ textAlign: "center", color: "#008DDA", borderBottom: "1px solid #41C9E2" }}
          >
          <img
                src={UXLogo}
                alt="profile"
                className="rounded-circle"
                width="75"
              ></img>
            Start your journey now, here at Act2State!
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ ...inputStyle }}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ ...inputStyle }}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: '#008DDA', display: 'block' }} for="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ ...inputStyle }}
                />
              </FormGroup>
              <FormGroup>
                <Label style={{ color: "#008DDA", display: "block" }} for="password">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8} // Enforce a minimum length
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}"
                  title="Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters."
                  style={{ ...inputStyle }}
                />
                <small style={{ color: "gray", fontSize: "0.8rem" }}>
                  Password must be at least 6 characters long, include uppercase and lowercase letters, a number, and a special character.
                </small>
              </FormGroup>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ display: 'inline', textDecoration: 'none', color: '#000000', marginRight: '5px' }}>Already have an account?</p>
                <a href="/#/login" style={{ textDecoration: 'none', color: '#41C9E2' }}>Login!</a>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button
                  className="mt-2"
                  style={{ ...buttonStyle}}
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
            {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const inputStyle = {
  width: "100%",
  padding: "5px",
  borderRadius: "4px",
  border: "1px solid #41C9E2",
};

const buttonStyle = {
  backgroundColor: "#41C9E2",
  padding: "8px 20px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
};

export default Registration;
