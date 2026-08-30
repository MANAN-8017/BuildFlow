import "../styles/global.css";
import "./Payment.css";
function Payment() {

  const startPayment = () => {
    const options = {
      key: "rzp_test_TR8B2ARZDElYTB",
      amount: 55000,
      currency: "INR",
      name: "BuildFlow",
      description: "Construction Material Order",
      order_id: "order_TUfpCG0UKcaLiF",
      handler: function (response) {
        console.log("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);
        console.log("Signature:", response.razorpay_signature);
        console.log(response);
      },
      prefill: {
        name: "Manan Patel",
        email: "manan@example.com",
        contact: "9016948101"
      },
      theme: {
        color: "#000000"
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  return (
    <button onClick={startPayment}> Pay Anything </button>
  );
}
export default Payment;