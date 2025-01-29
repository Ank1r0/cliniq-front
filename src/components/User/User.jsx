import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import TextField from '@mui/material/TextField';
import {
    Paper,
    Container,
    Button,
    Switch,
    FormControl,
    InputLabel,
    MenuItem,
    Box,
} from '@mui/material';
import { blue } from '@mui/material/colors';
import axios from 'axios';

export default function User() {
    const paperStyle = {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    };
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [specialisation, setSpecialisation] = useState('');
    const [role, setRole] = useState('');

    const [users, setUsers] = useState([]);

    const setCurrentUser = (newUser) => {
        // const index = users.findIndex(user => user.id === newUser.id)
        // console.log("index: ", index);
        // const usersCopy2 = [...users];
        // if (index !== -1)
        //   usersCopy2[index] = newUser;

        const usersCopy = users.map((user) => {
            if (user.id === newUser.id) {
                user = { ...newUser };
            }
            return user;
        });
        setUsers(usersCopy);
    };

    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        setChecked(!checked);
    };

    const fetchUsers = async () => {
        let response = await fetch(
            `http://localhost:9090/api/user/getAllUsers`
        );
        response = await response.json();
        console.log('response: ', response);
        setUsers(response);
    };

    useEffect(() => {
        if (users.length === 0) fetchUsers();
    }, []);

    const saveUser = async (e, id) => {
        e.preventDefault();
        const currentUser = users.filter((user) => user.id === id)?.[0];

        console.log(currentUser);

        try {
            const { data } = await axios.put(
                `http://localhost:9090/api/user/updateUserById/${id}`,
                currentUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleClick = (e) => {
        e.preventDefault();
        const user = {
            name,
            surname,
            dob,
            specialisation,
            role,
            login,
            password,
        };
        console.log(user);
        fetch('http://localhost:9090/api/user/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(user),
        }).then(() => {
            console.log('New User Added');
        });
    };

    const options = [
        { value: 'Patient', label: 'Patient' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Admin', label: 'Admin' },
    ];

    return (
        <Container>
            <Paper elevation={3} style={paperStyle}>
                <h1 style={{ color: blue }}>
                    <u>Add User</u>
                </h1>
                <form
                    noValidate
                    autoComplete="off"
                    style={{ marginBottom: '10px' }}
                >
                    <TextField
                        id="outlined-basic"
                        label="User Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="User Surname"
                        variant="outlined"
                        fullWidth
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Specialisation"
                        variant="outlined"
                        fullWidth
                        value={specialisation}
                        onChange={(e) => setSpecialisation(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Login"
                        variant="outlined"
                        fullWidth
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Select
                        options={options}
                        onChange={(e) => setRole(e.value)}
                    />
                    <input
                        type="date"
                        onChange={(e) => setDob(e.target.value)}
                        fullWidth
                    />{' '}
                    <br />
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClick}
                    >
                        Submit
                    </Button>
                </form>
            </Paper>
          
        </Container>
    );
}
