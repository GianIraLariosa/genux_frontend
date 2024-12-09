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
    <Row className="justify-content-center">
      <Col style={{ maxWidth: '500px' }}>
        <Card>
          <CardTitle className="card-title">
            <img
              src={UXLogo}
              alt="profile"
              width="75"
            />
            Start your journey now, here at Act2State!
          </CardTitle>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label className="label" htmlFor="firstName">
                  First Name
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="input"
                />
              </FormGroup>
              <FormGroup>
                <Label className="label" htmlFor="lastName">
                  Last Name
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="input"
                />
              </FormGroup>
              <FormGroup>
                <Label className="label" htmlFor="username">
                  Username
                </Label>
                <Input
                  type="text"
                  id="username"
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
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}"
                  title="Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters."
                  className="input"
                />
                <small className="password-hint">
                  Password must be at least 6 characters long, include uppercase and lowercase letters, a number, and a special character.
                </small>
              </FormGroup>
              <div className="link-container">
                <p className="normal-link">
                  Already have an account?
                </p>
                <a href="/#/login" className="link">
                  Login!
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
            {message && <p className="message">{message}</p>}
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
