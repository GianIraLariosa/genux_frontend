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
import backgroundIMG from "../assets/images/bg/seaside2.jpg";
import { OrbitProgress } from 'react-loading-indicators';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const axiosPostData = async() => {
    const postData = {
      firstName: firstName,
      lastname: lastName,
      username: username,
      password: password,
    }

    try{
      setLoading(true);
      await axios.post('https://genux-backend-9f3x.onrender.com/registration', postData)
        .then(res => 
          // setMessage(<p>{res.data}</p>)
          navigate('/login')
        );
    } catch (error) {
      setMessage('Error');
    } finally {
      setLoading(false);
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

  const Loading = () => <OrbitProgress style={{ fontSize: "7px" }} color={"#7FA1C3"} />;

  const buttonContent = loading ? (
    <Loading />
  ) : (
    "Register"
  );

  return (
    <Row className="justify-content-center align-items-center vh-100">
      <Col xs={12} style={{ display: 'flex', padding: '0' }}>
        {/* Left CardBody with Background Image */}
        <Card className="card-image"
          style={{
            backgroundImage: `url(${backgroundIMG})`,
            minHeight: '600px'

          }}
        >
          <CardBody
          ></CardBody>
        </Card>

        {/* Right CardBody with the Login Form */}
        <Card className="card-input" style={{ minHeight: '600px' }}>
          <CardBody className="card-body" style={{padding: '15%'}}>
            <CardTitle className="card-title">
              <h2 style={{ marginTop: '20px' }}>Start your journey now!</h2>
            </CardTitle>
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
                  className="input"
                />
                <small className="password-hint">
                  Password must be at least 6 characters long, include uppercase and lowercase letters, a number, and a special character.
                </small>
              </FormGroup>

              <div className="text-center">
                <Button
                  className="submit-button mt-2"
                  type="submit"
                >
                  {buttonContent}
                </Button>
              </div>

              <div className="link-container">
                <p className="normal-link">
                  Already have an account?
                </p>
                <a href="/#/login" className="link">
                  Login!
                </a>
              </div>

            </Form>
            {message && <p className="message">{message}</p>}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Registration;
