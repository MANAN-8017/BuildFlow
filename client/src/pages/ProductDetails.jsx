import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${API.products}/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error(error));
  }, [id]);

  const addToCart = async () => {
    const response = await fetch(API.cart, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id,
        quantity: quantity,
      }),
    });

    if (response.ok) {
      navigate("/cart");
    }
  };

  if (!product) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="product-details">

      <div className="product-details-image">
        📦
      </div>

      <div className="product-details-content">

        <span className="product-category">
          {product.category}
        </span>

        <h1>{product.name}</h1>

        <p>
          {product.description}
        </p>

        <h2>₹{product.price}</h2>

        <div className="quantity">
          <button
            onClick={() =>
              setQuantity(Math.max(1, quantity - 1))
            }
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              setQuantity(quantity + 1)
            }
          >
            +
          </button>
        </div>

        <button
          className="btn-primary add-cart"
          onClick={addToCart}
        >
          🛒 Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductDetails;