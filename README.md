# BuildFlow

BuildFlow is a MERN stack web application designed to simplify construction material estimation and procurement. It automates material quantity calculations based on construction dimensions and provides an integrated marketplace for purchasing materials and tracking orders.

---

## Features

- User Authentication (JWT)
- Material Quantity Estimation
- Cost Estimation
- Product Catalog
- Search & Filter
- Shopping Cart
- Online Order Placement
- Order Tracking
- Admin Dashboard
- Product Management

---

## Tech Stack

### Frontend

- React.js
- Vite
- Material UI
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## Project Structure

```
BuildFlow/
├── client/
├── server/
├── README.md
└── .gitignore
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/MANAN-8017/BuildFlow.git
cd BuildFlow
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

## Run the project

From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Team Members

- Your Name
- Project Partner's Name

---

## Project Status

🚧 Under Development

---

## Future Enhancements

- Blueprint Upload
- AI-assisted Material Estimation
- Multiple Vendor Support
- Invoice Generation
- Live Delivery Tracking

---

## License

This project is developed for academic purposes.