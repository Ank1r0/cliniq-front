import { useParams, useNavigate, Navigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useIsAuthHook } from '../hooks/useIsAuthHook';
import { Button, Paper, TextField, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CurrentUserContext } from '../context/currentUserContext';
import TransferList from './TransferList/TransferList';
import { times, dataMlsc } from '../constants/timeline';

const Appointment = () => {
    const params = useParams();
    const { token, userLogin } = useIsAuthHook();
    const value = useContext(CurrentUserContext);

    const navigator = useNavigate();

    useEffect(() => {
        if (userLogin && value.fetchCurrentUser()) value.fetchCurrentUser();
    }, [userLogin]);

    const [appData, setAppData] = useState(null);

    function displayUsers(array) {
        const container = document.getElementById('arrayContainer');
        const list = document.createElement('ul');

        array.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });

        container.appendChild(list);
    }

    const addNewDoc = (e) => {
        console.log('Add new doctor clicked');
    };
    const remDoc = async (user) => {
        const appId = params?.id;

        try {
            const { data } = await axios.patch(
                `http://localhost:9090/api/user/updateUserWithAppoById/${user.id}/removeAppo/${appId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
        console.log('Remove doctor clicked');
    };

    const delAppo = async (e) => {
        console.log('value: ', value?.currentUser);
        const userId = value?.currentUser?.id;
        const appId = params?.id;
        console.log('Delete appointment clicked');

        if (!userId && !appId) {
            return;
        }
        try {
            const { data } = await axios
                .delete(
                    `http://localhost:9090/api/user/deleteAppoFromUserById/${userId}/appo/${appId}`,
                    {}
                )
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log('Delete is success');
        } catch (err) {
            console.log(err);
        } finally {
            navigator('/appointments');
        }
    };

    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:9090/api/appointment/getAppointmentById/${params?.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppData(data);
            console.log('Data: ', data);
        } catch (err) {
            navigator('/404');
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const saveDoctorsBtnHandler = async (doctors) => {
        const appId = params?.id;

        const timeValues = times.map((time) => Object.values(time)?.[0]);

        let newTime = '';
        let isNoTime = false;

        const updatedDoctors = doctors.map((doctor) => {
            const doctorTimess = doctor?.calendarList
                .filter((item) => {
                    console.log('+item.date', +item.date);
                    console.log('appData.createdDate', +appData.createdDate);

                    return +item.date === +appData.createdDate;
                })
                ?.map((time) => time.visit);

            console.log('doctorTimess', doctorTimess);

            for (let item1 = 0; item1 < timeValues.length; item1++) {
                let time = doctorTimess.indexOf(timeValues[item1]);
                console.log('doctorTimess: ', doctorTimess);
                const lastIndex = doctorTimess.length - 1;

                console.log('time', time);
                console.log('lastIndex', lastIndex);

                if (
                    doctorTimess?.length && doctorTimess?.length > 1
                        ? time === lastIndex
                        : false
                ) {
                    // throw new Error('No time');
                    console.log('No time');
                    newTime = '';
                    isNoTime = true;
                    return;
                }

                // якщо час уже записаний в цього лікаря продовжуємо цикл підбору
                if (time !== -1) {
                    continue;
                } else {
                    if (newTime !== timeValues[item1]) {
                        newTime = timeValues[item1];
                        doctor?.calendarList.push({
                            date: appData?.createdDate,
                            visit: newTime,
                            appointmentId: params?.id,
                        });
                        break;
                    }
                }
            }

            return doctor;
        });

        if (isNoTime) {
            alert('No free time');
            return;
        }

        doctors.forEach(async (item) => {
            let res = updatedDoctors.find((doctor) => {
                return doctor.id === item.id;
            });

            try {
                const { data } = await axios.patch(
                    `http://localhost:9090/api/user/updateUserWithAppoById/${item.id}/appo/${appId}`,
                    res,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                window.location.reload();

                console.log('Data: ', data);
            } catch (err) {
                console.log(err);
            }
        });
    };

    return (
        <PageLayout>
            <Paper
                elevation={6}
                style={{
                    margin: '10px',
                    padding: '15px',
                    textAlign: 'left',
                }}
                key={params.id}
            >
                <form noValidate autoComplete="off">
                    <h2>Appointment number: {params?.id}</h2>

                    <div>
                        {/* Video Call Code: */}
                        <TextField
                            id="outlined-basic"
                            label={
                                appData?.videoCallCode?.length > 0
                                    ? ''
                                    : 'Video Call Code'
                            }
                            variant="outlined"
                            fullWidth
                            disabled
                            value={
                                !!appData?.videoCallCode
                                    ? appData.videoCallCode
                                    : ''
                            }
                        />
                    </div>
                    <br></br>

                    <h3>List of doctors:</h3>
                    {appData != null
                        ? appData.assignedUsers.map((user) => (
                              <Box
                                  key={user.id}
                                  sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                  <TextField
                                      value={user.name}
                                      label="Name"
                                      disabled
                                      sx={{ m: 2 }}
                                  />
                                  <TextField
                                      value={user.surname}
                                      label="Surname"
                                      disabled
                                      sx={{ m: 2 }}
                                  />
                                  <TextField
                                      value={user.role}
                                      label="Role"
                                      disabled
                                      sx={{ m: 2 }}
                                  />
                                  {user.role === 'Doctor' && (
                                      <DeleteIcon
                                          onClick={() => remDoc(user)}
                                      />
                                  )}
                              </Box>
                          ))
                        : null}
                    <br></br>
                    {/* <Button onClick={addNewDoc}>Add doctor</Button> */}
                    <TransferList
                        saveDoctorsCallback={saveDoctorsBtnHandler}
                        users={appData?.assignedUsers}
                        createdDate={appData?.createdDate}
                    />
                    <Paper>
                        <h3>Additional information about appointment:</h3>
                        <br></br>
                        {appData?.medicalRecord
                            ? appData.medicalRecord.aboutAppo
                            : null}
                    </Paper>
                    <br></br>
                </form>
                <Button onClick={delAppo}>Delete Appointment</Button>
            </Paper>
        </PageLayout>
    );
};

export default Appointment;
