import { Box, Button, TextField } from '@mui/material';
import PageLayout from '../../layout/PageLayout';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { set } from 'date-fns';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import { Paper } from '@mui/material';
import axios from 'axios';
import { DateField } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { parse, format } from 'date-fns';

export const Settings = () => {
    const paperStyle = {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    };
    const [userData, setUserData] = useState();

    const { userLogin } = useIsAuthHook();

    const fetchCurrentUser = async () => {
        if (!userLogin) {
            return;
        }
        let response = await fetch(
            `http://localhost:9090/api/user/getUserByLogin/${userLogin}`
        );
        response = await response.json();
        setUserData(response);
    };

    useEffect(() => {
        if (!userData) return;

        console.log('userData: ', userData);

        setName(userData.name);
        setSurname(userData.surname);
        setLogin(userData.login);
        if (userData.dob) {
            let dateIn = userData.dob;
            let d = new Date(parseInt(dateIn, 10));
            let ds = d.toString('MM/dd/yyyy');
            console.log(ds);
            setDob(ds);
            console.log('dob', userData.dob);
        } else {
            setDob('');
        }
    }, [userData]);

    useEffect(() => {
        if (userLogin?.length) {
            fetchCurrentUser();
        }
    }, [userLogin]);

    const saveUser = async (e) => {
        const currentUserId = userData.id;
        const newData = userData;

        newData.name = name;
        newData.surname = surname;
        newData.login = login;

        const d = new Date(dob.toString());
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        newData.dob = formatDate(`${month}/${day}/${year}`);

        try {
            const { data } = await axios.put(
                `http://localhost:9090/api/user/updateUserById/${currentUserId}`,
                newData,
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

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [login, setLogin] = useState('');
    const [dob, setDob] = useState('');
    //const [password,setPassword] = useState('')

    useEffect(() => {}, []);

    function handleChangeName(e) {
        setName(e.target.value);
    }
    function handleChangeSurname(e) {
        setSurname(e.target.value);
    }
    function handleChangeLogin(e) {
        setLogin(e.target.value);
    }
    function handleChangeDob(e) {
        console.log('e.target.value: ', e.target.value);
        setDob(e.target.value);
    }

    const formatDate = (dateString) => {
        console.log('dateString: ', dateString);
        const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
        return format(parsedDate, 'yyyy-MM-dd');
    };

    const formatDateReverse = (dateString) => {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
        return format(parsedDate, 'MM/dd/yyyy');
    };

    return (
        <PageLayout>
            <Paper elevation={3} style={paperStyle}>
                {userData && (
                    <Paper
                        elevation={6}
                        style={{
                            margin: '10px',
                            padding: '15px',
                            textAlign: 'left',
                        }}
                    >
                        <TextField
                            value={name}
                            onChange={handleChangeName}
                            fullWidth={true}
                            label="Name"
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            value={surname}
                            onChange={handleChangeSurname}
                            fullWidth={true}
                            label="Surname"
                            sx={{ mb: 1 }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                label={
                                    dob
                                        ? 'Date of birth'
                                        : 'Please enter date of birth'
                                }
                                value={dob ? dayjs(dob) : null}
                                fullWidth={true}
                                onChange={(newValue) => {
                                    console.log('newValue: ', newValue);
                                    setDob(newValue);
                                }}
                                sx={{ mb: 1 }}
                            />
                        </LocalizationProvider>

                        <TextField
                            value={login}
                            onChange={handleChangeLogin}
                            fullWidth={true}
                            label="Login"
                            sx={{ mb: 1 }}
                        />
                        <TextField
                            value={'Password cannot be changed'}
                            fullWidth={true}
                            disabled={true}
                            sx={{ mb: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={saveUser}
                            sx={{ mt: 1 }}
                        >
                            Submit
                        </Button>
                    </Paper>
                )}
            </Paper>
        </PageLayout>
    );
};
