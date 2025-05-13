import { useState } from 'react';
import axios from 'axios';

const LearningPlanForm = ({ initialData, onSubmit }) => {
    const [plan, setPlan] = useState(initialData || {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Draft'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlan({ ...plan, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(plan);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={plan.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={plan.description} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={plan.startDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>End Date</label>
                <input type="date" name="endDate" value={plan.endDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label>Status</label>
                <select name="status" value={plan.status} onChange={handleInputChange} required>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <button type="submit">Save</button>
        </form>
    );
};

export default LearningPlanForm;
