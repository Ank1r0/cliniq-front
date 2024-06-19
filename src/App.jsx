import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import React from 'react';

import Homepage from './pages/Homepage';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import AppointmentPage from './pages/AppointmentPage';
import Appointment from './components/Appointment';
import MedicalRecords from './pages/MedicalRecords';
import { Settings } from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/Register/Register';
import About from './pages/About';
import Missing from './pages/Missing';

import Records1 from './pages/MedicalRecords/Records1';
import Records2 from './pages/MedicalRecords/Records2';
import Records3 from './pages/MedicalRecords/Records3';

import { useIsAuthHook } from './hooks/useIsAuthHook';
import { CurrentUserContext } from './context/currentUserContext';

function App() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const { userLogin } = useIsAuthHook();

    const fetchCurrentUser = async () => {
        let response = await fetch(
            `http://localhost:9090/api/user/getUserByLogin/${userLogin}`
        );
        response = await response.json();
        setCurrentUser(response);
    };

    useEffect(() => {
       if (userLogin?.length) {
            fetchCurrentUser();
        }
    }, [userLogin]);

    return (
        <CurrentUserContext.Provider value={{ currentUser, fetchCurrentUser }}>
            <div className="App">
                <Router>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/myprofile" element={<MyProfile />} />
                        <Route
                            path="/appointments/*"
                            element={<AppointmentPage />}
                        >
                            <Route path=":id" element={<Appointment />} />
                        </Route>
                        <Route
                            path="/appointments/:id"
                            element={<Appointment />}
                        />
                        <Route
                            path="/medicalrecords/*"
                            element={<MedicalRecords />}
                        >
                            <Route path=":id" element={<Records1 />} />
                        </Route>
                        <Route
                            path="/medicalrecords/:id"
                            element={<Records1 />}
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/adminpanel" element={<AdminPanel />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route
                            path="/locked"
                            element={
                                <div
                                    style={{
                                        minHeight: '100vh',
                                    }}
                                >
                                    Locked page
                                </div>
                            }
                        />
                        <Route path="*" element={<Missing />} />
                    </Routes>
                </Router>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
