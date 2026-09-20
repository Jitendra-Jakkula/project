import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Keep track of the problems you're solving.
          </p>
        </div>

        <Link to="/add" className="primary-button">
          + Add Problem
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span>Total Problems</span>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>Solved</span>
          <strong>0</strong>
        </div>

        <div className="stat-card">
          <span>Revisit</span>
          <strong>0</strong>
        </div>
      </div>

      <section className="recent-section">
        <h2>Recent Problems</h2>

        <div className="empty-state">
          <h3>No problems yet</h3>

          <p>
            Start building your coding problem notebook.
          </p>

          <Link to="/add" className="primary-button">
            Add Your First Problem
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;