import LearningPlanForm from '../components/LearningPlanForm';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const EditLearningPlanPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);

    useEffect(() => {
        axios.get(`/api/learningplans/${id}`)
            .then(response => setPlan(response.data))
            .catch(error => console.error("Error fetching plan", error));
    }, [id]);

    const handleSubmit = async (updatedPlan) => {
        try {
            await axios.put(`/api/learningplans/${id}`, updatedPlan);
            alert('Learning plan updated successfully');
            navigate('/learningplans');
        } catch (error) {
            alert('Error updating learning plan');
            console.error('Error updating learning plan', error);
        }
    };

    if (!plan) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit Learning Plan</h1>
            <LearningPlanForm initialData={plan} onSubmit={handleSubmit} />
        </div>
    );
};

export default EditLearningPlanPage;
