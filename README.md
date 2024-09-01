# HolidRoute

This project is a web application that allows users to enter their route preferences, and based on their location, it
finds nearby places using the Geoapify API. The relevant places are filtered using g4f to match the user's preferences
and are displayed on a map. Users can also explore different transportation options.

### About this Project

This application was developed during TulaHack 2024, case 7 ("Маршрут Выходного Дня" от ТЕЛЕ2) 


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)

## Features

- Enter route preferences to find relevant nearby places.
- Display places on an interactive map.
- Filter places using g4f to fit user preferences.
- Explore different transportation options.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Python (FastAPI)
- **APIs:** Geoapify, g4f
- **Map Integration:** ymaps (used in the React component)

## Prerequisites

Make sure you have the following installed on your local machine:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **Python** (v3.8 or later)
- **pip** (v20.x or later)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/katanabana/HolidRoute.git
   cd HolidRoute
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd client
   npm install
   ```

3. **Install dependencies for the backend:**

   ```bash
   cd ../server
   pip install -r requirements.txt
   ```

## Running the Application

To run the application on your local machine, you'll need to start both the frontend and backend servers in separate
terminals.

1. **Start the frontend:**

   Open the first terminal and run:

   ```bash
   cd client
   npm start
   ```

   This will start the React development server, usually at `https://localhost:3000`.

2. **Start the backend:**

   Open the second terminal and run:

   ```bash
   cd server
   python main.py
   ```

   This will start the Python backend server, usually at `https://localhost:5000`.

Now, you can access the application by opening your browser and navigating to `http://localhost:3000`.

## Environment Variables

This project requires certain environment variables to be set in both the frontend and backend to function properly.
Below are the details on how to set them up.

### server/.env

```plaintext
# Your or public Geoapify API key.
GEOAPIFY_API_KEY=d548c5ed24604be6a9dd0d989631f783

# The port on which the backend server will run.
PORT=5000

# The host on which the backend server will listen.
HOST=localhost

# Path to the SSL key file (for HTTPS).
SSL_KEY=key.pem

# Path to the SSL certificate file (for HTTPS).
SSL_CERT=cert.pem
```

### client/.env

```plaintext
# The URL of the backend server.
REACT_APP_API_URL=https://localhost:5000

# Enforce HTTPS for precise location detection.
HTTPS=true

# Path to the SSL certificate file (for HTTPS).
SSL_CRT_FILE=cert.pem

# Path to the SSL key file (for HTTPS).
SSL_KEY_FILE=key.pem
```





