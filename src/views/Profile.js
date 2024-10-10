import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from '../Usercontext';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import user1 from '../assets/images/users/user1.jpg';

const Profile = () => {
  const { user_id } = useContext(UserContext); // Get the userId from URL params
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [requestStatus, setreqStatus] = useState(0);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost/metro%20events/get_user.php`, {
          params: {
            user_id: user_id,
          }
        });
        setUser(response.data);
      } catch (error) {
        setError('Error fetching user data');
      }
    };

    // Fetch events for the user
    const formData = new FormData();
    const fetchEvents = async () => {
      formData.append('user_id', user_id);
      try {
        const response = await axios.post('http://localhost/metro%20events/joined_events.php', formData);
        console.log(response);
        setEvents(response.data);
      } catch (error) {
        setError('Error fetching events');
      }
    };

    const checkUserExists = async () => {
      formData.append('user_id', user_id);
      try {
        const response = await axios.post('http://localhost/metro%20events/check_if_requested.php', formData);
        setUserExists(response.data.userExists);
      } catch (error) {
        setError('Error checking user existence');
      }
    };

    const checkStatus = async () => {
      const formdata = new FormData();
      formdata.append('user_id', user_id);

      try {
          const response = await axios.post('http://localhost/metro%20events/check_request_status.php', formdata);
          setreqStatus(response.data.status);
      } catch (error) {
          setError('Error checking request status');
      }
  };

    fetchUser();
    fetchEvents();
    checkUserExists();
    checkStatus();
  }, [requestStatus]);

  const handleRequestAdmin = async () => {
    // Handle request to be admin
    const formdata = new FormData();
    formdata.append('user_id', user_id);
    formdata.append('approved', 0);
    try {
        const addRequestResponse = await axios.post('http://localhost/metro%20events/add_admin_request.php', formdata);
        console.log(addRequestResponse);

        // Update userExists state after adding the request
        setUserExists(true);
        setreqStatus(0);
    } catch (error) {
        setError('Error requesting admin');
    }
};


  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '200vh' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h4 style={{ fontWeight: 'bold' }}>Personal Profile</h4>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardImg alt="profile" className="rounded-circle" src={user1} style={{ width: '150px', height: '150px', marginTop: '3%'}} />
          </div>
          <CardBody>
            <CardTitle tag="h5">{user.user_name}</CardTitle>
            <CardSubtitle>{user.first_name}</CardSubtitle>
            <CardSubtitle>{user.last_name}</CardSubtitle>
            <CardText style={{ textAlign: 'justify', margin: '3%'}}>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </CardText>
            {requestStatus === 0 && (
              <Button color="secondary" disabled>
                Request Sent
              </Button>
            )}
            {requestStatus === 1 && (
              <Button color="success" disabled>
                Approved
              </Button>
            )}
            {requestStatus === 2 && (
              <Button color="danger" disabled>
                Denied
              </Button>
            )}
            {!userExists && requestStatus === null && (
              <Button color="primary" style={{ color: 'white' }} onClick={handleRequestAdmin}>
                Request to be Organizer
              </Button>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
