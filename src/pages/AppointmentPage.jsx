import AppointmentsList from '../components/appointments/AppointmentsList';
import PageLayout from '../layout/PageLayout';

const AppointmentPage = () => {
    return (
        <PageLayout>
            <h3>Appointments</h3>
            <AppointmentsList />
        </PageLayout>
    );
};

export default AppointmentPage;
