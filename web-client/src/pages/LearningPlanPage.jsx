import { useState, useEffect } from 'react';
import axios from 'axios';
import LearningPlanCard from '../components/LearningPlanCard';
import { Link } from 'react-router-dom';

const LearningPlanPage = () => {
    const [plans, setPlans] = useState([]);

    useEffect(() => {
        axios.get('/api/learningplans')
            .then(response => setPlans(response.data))
            .catch(error => console.error("Error fetching learning plans", error));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await axios.delete(`/api/learningplans/${id}`);
                setPlans(plans.filter(plan => plan.id !== id));
                alert('Learning plan deleted successfully');
            } catch (error) {
                console.error("Error deleting plan", error);
            }
        }
    };

    return (
        <div>
            <h1>Learning Plans</h1>
            <Link to="/create-learning-plan">Create New Plan</Link>
            <div className="learning-plans">
                {plans.map(plan => (
                    <LearningPlanCard key={plan.id} plan={plan} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
};

export default LearningPlanPage;
