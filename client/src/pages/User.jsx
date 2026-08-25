import "./Pages.css";
import Sidebar from "../components/Sidebar.jsx";

function UserCreate() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Create User</h1>
            <p>Add a new user to your BuildFlow system</p>
          </div>

          <div className="profile">
            <div className="avatar">M</div>
            <span>Admin</span>
          </div>
        </header>

        <section className="form-container">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">👤</div>

              <div>
                <h2>User Information</h2>
                <p>Enter the user's account details</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-secondary">
                Cancel
              </button>

              <button className="btn-primary">
                Create User
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserCreate;