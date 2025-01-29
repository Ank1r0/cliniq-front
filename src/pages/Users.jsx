
import User from '../components/User/User';
import PageLayout from '../layout/PageLayout';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';
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
const Users = () => {
    const { token, decodedToken, userLogin } = useIsAuthHook();
    console.log(userLogin);

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
        <PageLayout>
            {
                <div>
                    <Paper elevation={3} style={paperStyle}>
                    <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '15px', // Add spacing between switch and the rest of the content
                    }}
                >
                    <Switch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{
                            'aria-label': 'controlled',
                        }}
                    />
                    <span style={{ marginLeft: '10px' }}>
                        {checked === false ? 'Turn on edit' : 'Turn off edit'}
                    </span>
                </div>
                
                {users.map((user) => (
                    <Paper
                        elevation={6}
                        style={{
                            margin: '10px',
                            padding: '15px',
                            textAlign: 'left',
                        }}
                        key={user.id}
                    >
                        <form onSubmit={(e) => saveUser(e, user.id)}>
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                disabled={true}
                                label="Id:"
                                variant="outlined"
                                value={user.id}
                                fullWidth
                            />
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                // onChange={(e) => setCurrentUser({key: "name", value: e.target.value})}
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        name: e.target.value,
                                    })
                                }
                                disabled={!checked}
                                label="Name:"
                                variant="outlined"
                                value={user.name}
                                fullWidth
                            />
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        dob: e.target.value,
                                    })
                                }
                                disabled={!checked}
                                label="Dob:"
                                variant="outlined"
                                value={new Date(user.dob).toLocaleString()}
                                fullWidth
                            />
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        login: e.target.value,
                                    })
                                }
                                disabled={!checked}
                                label="Login:"
                                variant="outlined"
                                value={user.login}
                                fullWidth
                            />
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        surname: e.target.value,
                                    })
                                }
                                disabled={!checked}
                                label="Surname:"
                                variant="outlined"
                                value={user.surname}
                                fullWidth
                            />
                            <TextField
                                id="outlined-basic"
                                margin="dense"
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        specialisation: e.target.value,
                                    })
                                }
                                disabled={!checked}
                                label="Specialisation:"
                                variant="outlined"
                                value={user.specialisation}
                                fullWidth
                            />
                            <TextField
                                select
                                size="large"
                                disabled={!checked}
                                margin="dense"
                                value={user.role}
                                onChange={(e) =>
                                    setCurrentUser({
                                        ...user,
                                        role: e.target.value,
                                    })
                                }
                                fullWidth
                                label="Role: "
                                defaultValue=""
                            >
                                {options?.length &&
                                    options.map((option) => {
                                        return (
                                            <MenuItem value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        );
                                    })}
                            </TextField>

                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                Save
                            </Button>
                        </form>
                    </Paper>
                ))}
            </Paper>
                </div>
            }
            {/* : <Navigate to="/" />} */}
        </PageLayout>
    );
}

export default Users


