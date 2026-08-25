import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Pages.css";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API.products)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="store-page">

      <div className="store-header">
        <div>
          <h1>Construction Materials</h1>
          <p>Everything you need for your construction project</p>
        </div>

        <Link to="/cart" className="cart-button">
          🛒 Cart
        </Link>
      </div>

      <div className="product-grid">

        {products.map((product) => (
          <div className="product-card" key={product._id}>

            <div className="product-image">
              📦
            </div>

            <div className="product-content">

              <span className="product-category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <p className="product-description">
                {product.description}
              </p>

              <div className="product-bottom">

                <strong>
                  ₹{product.price}
                </strong>

                <Link
                  to={`/products/${product._id}`}
                  className="btn-primary"
                >
                  View Product
                </Link>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Products;