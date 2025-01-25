# MAVS API

![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

## Purpose

This repository contains the backend for the **Mavs** project. It serves as an API for the frontend application, handling operations such as creating likes and comments for Marvel superheroes, user creation, and session management. The goal of this backend is to provide a robust foundation for the frontend functionalities of the **Mavs** application.

## Features

- **Create Users**: Enables user registration for the application.
- **Create Comments**: Allows users to leave comments on superhero profiles.
- **Authentication**: Provides secure session management for users to interact with the app.

## Usage

1. **Clone the Repository**:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install Dependencies**:
   Use `npm` to install the required dependencies:

   ```bash
   npm install
   ```

3. **Environment Variables**:

   - Refer to the `.env.example` file for the required environment variables.
   - Copy `.env.example` and rename it to `.env`. Update the variables according to your configuration.

4. **Run the Application Locally**:

   - Start the server using:
     ```bash
     npm start
     ```

5. **Run Tests**:
   - This project includes a 100% test coverage suite. To run tests, execute:
     ```bash
     npm test
     ```

## Technologies

This backend repository uses the following technologies:

- **Node.js**: JavaScript runtime environment.
- **Express**: Framework for building web applications and APIs.
- **MongoDB**: NoSQL database for storing application data.
- **DDD Architecture**: Domain-Driven Design for maintaining a clean and modular architecture.

## Contribution

Contributions are welcome! While there is no specific contribution guideline at the moment, feel free to fork the repository, create a branch, and submit a pull request with your changes.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
