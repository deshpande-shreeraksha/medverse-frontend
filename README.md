# Medverse - Frontend

This is the frontend for the Medverse application, a modern platform for booking and managing medical appointments. It is built with React and interacts with the backend API to provide a seamless user experience.

## Features

-   **User Authentication**: Secure sign-up, login, and logout functionality.
-   **Doctor Browsing**: Find doctors and view their specializations.
-   **Appointment Booking**: Schedule appointments with real-time slot availability checking.
-   **User Dashboard**: A central place for users to view and manage their upcoming appointments.
-   **Appointment Management**: Reschedule or cancel upcoming appointments.
-   **Health Records**: View personal medical records and lab test results.
-   **Privilege Card**: Apply for and view a digital privilege card.
-   **Responsive Design**: A clean and intuitive interface that works on both desktop and mobile devices.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or later is recommended)
-   `npm` or `yarn` package manager

### Installation

1.  **Clone the repository** (if you haven't already):
    ```sh
    git clone <your-repository-url>/medverse-frontend.git
    cd medverse-frontend
    ```

2.  **Install NPM packages**:
    This command will install all the necessary dependencies listed in `package.json`.
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command. The application will open automatically in your default browser at `http://localhost:3000`.

```sh
npm start
```

The page will automatically reload when you make edits. You will also see any lint errors or warnings in the console.

## Available Scripts

In the project directory, you can run:

-   `npm start`: Runs the app in development mode.
-   `npm test`: Launches the test runner in interactive watch mode.
-   `npm run build`: Builds the app for production into the `build` folder.
-   `npm run eject`: **Note: this is a one-way operation. Once you `eject`, you can’t go back!** It removes the single build dependency and copies all configuration files and transitive dependencies into your project.

## Folder Structure

Here is an overview of the key directories within the `src` folder:

```
src/
├── components/     # Reusable React components (e.g., Navbar, Footer, Modals)
├── data/           # Static data files (e.g., doctors list)
├── pages/          # Page-level components (e.g., Home, Dashboard, Login)
├── styles/         # Global CSS files and component-specific styles
├── App.js          # Main application component with routing logic
├── AuthContext.js  # React Context for managing user authentication state
└── index.js        # The entry point of the React application
```

## Environment Variables

The application expects the backend API to be running at `http://localhost:5000`. If your backend is running on a different port or host, you can create a `.env` file in the root of the `frontend` directory to override the default settings.

Create a file named `.env` and add the following variable:

```
REACT_APP_API_URL=http://localhost:5000
```

## Key Dependencies

-   **React**: A JavaScript library for building user interfaces.
-   **React Router**: For declarative routing in the application.
-   **Bootstrap & React-Bootstrap**: For styling and responsive UI components.
-   **`fetch` API**: Used for making HTTP requests to the backend.

---

## Project Setup for Maintainers

If you are setting up this repository for the first time from an existing local folder, follow these steps to push the code to a new empty remote repository.

1.  **Navigate to your project directory**:
    Open a terminal or command prompt and go to your frontend folder.

2.  **Initialize a new Git repository**:
    This command creates a new `.git` subdirectory in your project folder. The `-b main` flag sets the default branch name to `main`.
    ```sh
    git init -b main
    ```

3.  **Add all files and commit**:
    This stages all your files and creates the first commit.
    ```sh
    git add .
    git commit -m "Initial commit: Add Medverse frontend application"
    ```

4.  **Link to the remote repository and push**:
    Replace `<your-repository-url>` with the URL of your new empty repository on GitHub, GitLab, etc.
    ```sh
    git remote add origin <your-repository-url>
    git push -u origin main
    ```