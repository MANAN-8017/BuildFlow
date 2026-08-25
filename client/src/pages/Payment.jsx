import "./Pages.css";
import  Sidebar from "../components/Sidebar.jsx";

function PaymentPage() {
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
            <h1>Payment</h1>
            <p>Complete your order payment securely</p>
          </div>

          <div className="profile">
            <div className="avatar">M</div>
            <span>Admin</span>
          </div>
        </header>

        <section className="payment-layout">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">💳</div>
              <div>
                <h2>Payment Details</h2>
                <p>Enter the details required for payment</p>
              </div>
            </div>

            <div className="form-group">
              <label>Order ID</label>
              <input type="text" placeholder="Enter order ID" />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="₹ 0.00" />
            </div>

            <div className="payment-method">
              <h3>Payment Method</h3>

              <div className="payment-option">
                <span>💳</span>
                <div>
                  <strong>Razorpay</strong>
                  <p>UPI, Cards, Net Banking & Wallets</p>
                </div>
              </div>
            </div>

            <button className="btn-primary full-btn">
              Proceed to Payment
            </button>
          </div>

          <div className="payment-summary">
            <h2>Payment Summary</h2>

            <div className="summary-row">
              <span>Order Amount</span>
              <strong>₹0.00</strong>
            </div>

            <div className="summary-row">
              <span>Processing Fee</span>
              <strong>₹0.00</strong>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>₹0.00</strong>
            </div>

            <p className="secure">
              🔒 Your payment information is securely processed.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PaymentPage;