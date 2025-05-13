const LearningPlanCard = ({ plan, onEdit, onDelete }) => {
    return (
        <div className="learning-plan-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <p>Start Date: {plan.startDate}</p>
            <p>End Date: {plan.endDate}</p>
            <p>Status: {plan.status}</p>
            <div>
                <button onClick={() => onEdit(plan.id)}>Edit</button>
                <button onClick={() => onDelete(plan.id)}>Delete</button>
            </div>
        </div>
    );
};

export default LearningPlanCard;
