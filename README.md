# EventSphere

This project is a Full-Stack Application connected to a **MySQL Database**.

## Project Structure

*   **client/**: Frontend (React + Vite)
*   **server/**: Backend (Node.js + Express + Sequelize + MySQL)

## Database Configuration

The project is currently configured to connect to a local MySQL instance:
*   **Database Name:** `eventsphere_db`
*   **User:** `root`
*   **Password:** `` (empty)
*   **Host:** `localhost`

To change these credentials, edit `server/index.js` or ask to set up a `.env` file.

## How to Run

1.  **Start Backend:**
    ```bash
    cd server
    node init_db.js  # Run once to create the database
    node index.js    # Start the server
    ```
    *(Server runs on http://localhost:3000)*

2.  **Start Frontend:**
    Open a new terminal:
    ```bash
    cd client
    npm run dev
    ```
    *(Client runs on http://localhost:5173)*

## Troubleshooting

*   **"Access denied for user 'root'":** Check if your MySQL root password is truly empty. If not, update `server/index.js` line ~15.
*   **"Unknown database":** Ensure you ran `node init_db.js` first.
