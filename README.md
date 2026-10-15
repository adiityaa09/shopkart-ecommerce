🛍️ ShopKar – MERN Stack E-Commerce Platform

ShopKar is a full-stack e-commerce platform built using the MERN stack (MongoDB, Express.js, React.js, and Node.js). The project provides a seamless shopping experience where users can browse products, add items to their cart, manage their wishlist, and make payments through the Razorpay payment gateway.

This project helped me gain hands-on experience in full-stack web development by integrating frontend and backend services, implementing REST APIs, managing application state, handling authentication, and integrating third-party payment services.

✨ Features

🛒 Product Browsing: Browse and explore products fetched dynamically from the backend.

🛍️ Add to Cart: Add products to the shopping cart and manage selected items.

❤️ Wishlist: Save favorite products for future purchases.

💳 Online Payments: Integrated the Razorpay API for payment processing.

🔗 Frontend–Backend Integration: Connected the React frontend with the Node.js and Express.js backend using APIs.

🗄️ Database Management: Used MongoDB to store and manage application data.

🔐 Authentication: Implemented user authentication and authorization workflows.

⚡ REST API Integration: Created and consumed APIs to handle product data and application functionality.

📱 Interactive UI: Built a responsive and user-friendly shopping interface.

🛠️ Tech Stack

Frontend

React.js

JavaScript

HTML5

CSS3 / Tailwind CSS

Axios

Backend

Node.js

Express.js

REST APIs

JWT Authentication

bcrypt for password hashing

Database

MongoDB

Mongoose

Payment Integration

Razorpay API

Development Tools

Git and GitHub

Postman

npm

🏗️ Application Architecture

ShopKar follows a client-server architecture in which the React frontend communicates with the Express.js backend through REST APIs. The backend processes requests, interacts with MongoDB, and returns responses to the frontend.

The Razorpay integration enables payment processing through its payment gateway.

Workflow:

Users browse products through the React frontend.

The frontend requests product data from the backend using Axios.

Express.js handles API requests and communicates with MongoDB.

Users add products to their cart or wishlist.

During checkout, the application integrates with Razorpay to process payments.

The backend manages application logic and returns responses to the frontend.

📚 Key Concepts Learned

Through this project, I gained practical experience with:

Full-stack development using the MERN stack.

Building RESTful APIs with Node.js and Express.js.

Connecting React applications to backend services.

MongoDB database design and CRUD operations using Mongoose.

User authentication, JWT, and password hashing.

Managing cart and wishlist functionality.

Integrating third-party APIs such as Razorpay.

Handling asynchronous operations using JavaScript.

API testing and debugging using Postman.

Organizing frontend and backend code into maintainable structures.

Using Git and GitHub for version control.

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Node.js and npm

MongoDB or a MongoDB Atlas account

Git

Installation

1. Clone the repository

git clone <your-repository-url>
cd ShopKar

2. Install backend dependencies

cd backend
npm install

3. Configure environment variables

Create a .env file in the backend directory and configure the required variables according to your implementation.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

4. Start the backend server

npm run dev

Use the appropriate script defined in your backend's package.json if it differs.

5. Install frontend dependencies

Open a new terminal and navigate to the frontend directory:

cd frontend
npm install

6. Start the frontend

npm run dev

Open the local URL displayed by Vite in your browser.

Note: Adjust the directory names, environment variables, and commands to match your actual project structure.

🔒 Security Notes

Store sensitive credentials in environment variables.

Never commit your .env file or expose your Razorpay secret key.

Verify payment signatures on the backend before treating a payment as successful.

Use HTTPS and appropriate authentication and authorization checks in production.

🎯 Project Objective

The primary goal of ShopKar was to apply theoretical knowledge to a practical full-stack application and understand how the frontend, backend, database, and third-party services work together to build a functional e-commerce platform.

👨‍💻 Author

Developed as a hands-on full-stack development project to strengthen my MERN stack skills and explore real-world e-commerce functionality.

Tech Stack: MongoDB | Express.js | React.js | Node.js | Razorpay
