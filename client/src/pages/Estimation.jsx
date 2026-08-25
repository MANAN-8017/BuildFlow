import "./Pages.css";
import Sidebar from "../components/Sidebar.jsx";

function EstimationCreate() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <span>🏗️</span>
          <h2>BuildFlow</h2>
        </div>

        <Sidebar />
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Material Estimation</h1>
            <p>Estimate the materials required for your project</p>
          </div>

          <div className="profile">
            <div className="avatar">M</div>
            <span>Admin</span>
          </div>
        </header>

        <section className="form-container">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">📐</div>
              <div>
                <h2>Estimation Details</h2>
                <p>Enter project and material requirements</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Residential Building"
                />
              </div>

              <div className="form-group">
                <label>Material</label>
                <select>
                  <option>Select material</option>
                  <option>Cement</option>
                  <option>Steel</option>
                  <option>Bricks</option>
                  <option>Sand</option>
                </select>
              </div>

              <div className="form-group">
                <label>Required Quantity</label>
                <input type="number" placeholder="Enter quantity" />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <select>
                  <option>Select unit</option>
                  <option>Kg</option>
                  <option>Ton</option>
                  <option>Bag</option>
                  <option>Piece</option>
                  <option>Cubic Meter</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Price</label>
                <input type="number" placeholder="₹ 0.00" />
              </div>
            </div>

            <div className="estimate-result">
              <span>Estimated Total</span>
              <strong>₹ 0.00</strong>
            </div>

            <div className="form-actions">
              <button className="btn-secondary">Cancel</button>
              <button className="btn-primary">Create Estimation</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EstimationCreate;