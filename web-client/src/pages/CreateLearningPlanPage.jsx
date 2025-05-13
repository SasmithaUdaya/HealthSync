import LearningPlanForm from '../components/LearningPlanForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateLearningPlanPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (newPlan) => {
        try {
            await axios.post('/api/learningplans', newPlan);
            alert('Learning plan created successfully');
            navigate('/learningplans');
        } catch (error) {
            alert('Error creating learning plan');
            console.error('Error creating learning plan', error);
        }
    };

    return (
        <div>
            <h1>Create Learning Plan</h1>
            <LearningPlanForm onSubmit={handleSubmit} />
        </div>
    );
};

export default CreateLearningPlanPage;
