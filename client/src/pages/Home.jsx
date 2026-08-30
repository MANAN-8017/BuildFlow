import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Smart Construction Procurement</div>

          <h1>
            Build Smarter.
            <br />
            <span>Estimate Better.</span>
          </h1>

          <p className="hero-description">
            BuildFlow simplifies construction material estimation,
            product selection, procurement, cart management, and
            order tracking — all in one platform.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary" > Browse Materials </Link>
            <Link to="/estimation" className="btn btn-secondary" > Create Estimation </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>100+</strong>
              <span>Materials</span>
            </div>
            <div>
              <strong>Easy</strong>
              <span>Estimation</span>
            </div>
            <div>
              <strong>Fast</strong>
              <span>Procurement</span>
            </div>
          </div>
        </div>
        <div className="hero-logo">
          <div className="logo-circle">
            <img src="/BuildFlow.png" alt="BuildFlow"/>
          </div>

          <div className="floating-card card-top">
            <span>Estimation</span>
            <strong>Ready</strong>
          </div>

          <div className="floating-card card-bottom">
            <span>Orders</span>
            <strong>Tracked</strong>
          </div>
        </div>
      </section>

      <section className="quick-section">

        <div className="section-heading">
          <span>QUICK ACCESS</span>
          <h2>Everything you need to build</h2>
          <p>
            Manage your entire construction material workflow
            from one place.
          </p>
        </div>

        <div className="quick-grid">
          <Link to="/products" className="quick-card">
            <div className="quick-icon">01</div>
            <div>
              <h3>Materials</h3>
              <p>
                Browse and select construction materials
                for your project.
              </p>
            </div>
            <span className="arrow">→</span>
          </Link>
          <Link to="/estimation" className="quick-card">
            <div className="quick-icon">02</div>
            <div>
              <h3>Estimation</h3>
              <p>
                Calculate the materials and quantities
                required for your project.
              </p>
            </div>
            <span className="arrow">→</span>
          </Link>
          <Link to="/cart" className="quick-card">
            <div className="quick-icon">03</div>
            <div>
              <h3>Shopping Cart</h3>
              <p>
                Review selected materials before
                placing your order.
              </p>
            </div>
            <span className="arrow">→</span>
          </Link>
          <Link to="/orders" className="quick-card">
            <div className="quick-icon">04</div>
            <div>
              <h3>Orders</h3>
              <p>
                Track and manage your construction
                material orders.
              </p>
            </div>
            <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span>WHY BUILDFLOW</span>
          <h2>Construction procurement, simplified.</h2>
          <p>
            From initial estimation to final order,
            BuildFlow keeps everything organized.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <h3>Smart Estimation</h3>
            <p>
              Estimate required construction materials
              and quantities before starting procurement.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <h3>Material Management</h3>
            <p>
              Browse construction materials and view
              product details, pricing, and availability.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-number"> 03 </div>
            <h3>Easy Procurement</h3>
            <p>
              Add required materials to your cart and
              proceed through a streamlined checkout process.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-number">04</div>
            <h3>Order Tracking</h3>
            <p>
              Keep track of previous orders and access
              detailed order information whenever needed.
            </p>
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <div className="workflow-content">
          <div className="section-heading left">
            <span>HOW IT WORKS</span>
            <h2>
              From estimation
              <br />
              to procurement.
            </h2>
            <p>
              BuildFlow connects every important step of
              your construction material workflow.
            </p>
          </div>
          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <div>
                <h3>Estimate</h3>
                <p>
                  Determine the materials and quantities
                  required for your project.
                </p>
              </div>
            </div>
            <div className="workflow-line" />
            <div className="workflow-step">
              <div className="step-number">02</div>
              <div>
                <h3>Select</h3>
                <p>
                  Browse available construction materials
                  and select the products you need.
                </p>
              </div>
            </div>
            <div className="workflow-line" />
            <div className="workflow-step">
              <div className="step-number"> 03 </div>
              <div>
                <h3>Order</h3>
                <p>
                  Add materials to your cart and complete
                  the checkout process.
                </p>
              </div>
            </div>
            <div className="workflow-line" />
            <div className="workflow-step">
              <div className="step-number"> 04 </div>
              <div>
                <h3>Track</h3>
                <p>
                  Monitor your orders and view detailed
                  order information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <img src="/BuildFlow.png" alt="BuildFlow" className="cta-logo" />
        <h2> Ready to build smarter? </h2>
        <p>
          Start estimating and managing your construction
          materials with BuildFlow.
        </p>
        <div className="cta-actions">
          <Link to="/estimation" className="btn btn-primary" > Start Estimation </Link>
          <Link to="/products" className="btn btn-secondary" > Explore Materials </Link>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-brand">
          <img src="/BuildFlow.png" alt="BuildFlow"/>
          <div>
            <strong>BuildFlow</strong>
            <span> Smart Construction Material Platform </span>
          </div>
        </div>
        <div className="footer-links">
          <Link to="/products"> Products </Link>
          <Link to="/estimation"> Estimation </Link>
          <Link to="/cart"> Cart </Link>
          <Link to="/orders"> Orders </Link>
        </div>
        <p className="copyright"> © 2026 BuildFlow. All rights reserved. </p>
      </footer>
    </div>
  );
}
export default Home;