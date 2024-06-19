import PageLayout from '../layout/PageLayout';

const About = () => {
    return (
        <PageLayout>
            <div className="About">
                <h2>About</h2>
                <p style={{ marginTop: '1rem' }}>
                    This blog app is a project from the React tutorial
                </p>
            </div>
        </PageLayout>
    );
};

export default About;
