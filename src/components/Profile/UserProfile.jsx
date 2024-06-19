import { Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import './UserProfile';

export default function Profile() {
    const paperStyle = {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    };
    const [users, setUsers] = useState([]);
    const [targetUserId, setTargetUserId] = useState('');
    const [userData, setUserData] = useState();

    const { token, decodedToken, userLogin } = useIsAuthHook();

    const fetchCurrentUser = async () => {
        if (!userLogin) {
            return;
        }
        let response = await fetch(
            `http://localhost:9090/api/user/getUserByLogin/${userLogin}`
        );
        response = await response.json();
        console.log('response: ', response);
        setUserData(response);
    };

    useEffect(() => {
        if (userLogin) fetchCurrentUser();
    }, [userLogin]);

    //   console.log(userLogin)
    //   try {
    //     const { data } = await axios.get(
    //       `http://localhost:9090/api/user/getUserByLogin/${userLogin}`,
    //       {}, {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    //     setUserData(data);
    //     console.log(data)
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // useEffect(() => {
    //   setTargetUserId(1);
    //   getInfo();

    //   // const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxMjIyMjA2MSwiZXhwIjoxNzEyMjIzNTAxfQ.hnNhDPOUbbHiQwWdBJ2m3xTl4Q0gJ-5n6RFhEiI6gak' };
    //   // fetch('http://localhost:9090/User/getAllUsers', { headers })
    //   //     .then(response => response.json())
    //   //     .then(data => console.log(data));

    //   // fetch("http://localhost:9090/User/getAllUsers")
    //   //   .then((response) => response.json())
    //   //   .then((data) => setUsers(data));

    // }, []);

    return (
        <div>
            <Paper elevation={3} style={paperStyle}>
                {userData && (
                    <Paper
                        elevation={6}
                        style={{
                            margin: '10px',
                            padding: '15px',
                            textAlign: 'left',
                        }}
                        key={userData.id}
                    >
                        Id:{userData.id}
                        <br />
                        Name:{userData.name}
                        <br />
                        Dob:{userData.dob || '-'}
                        <br />
                        Surname:{userData.surname}
                        <br />
                        {/* Specialisation:
                        {userData.specialisation}
                        <br /> */}
                        Role:{userData.role}
                    </Paper>
                )}
            </Paper>
        </div>
    );
}
