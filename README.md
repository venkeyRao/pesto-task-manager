# Task Manager

## Introduction

Task Manager is a simple task management application that allows users to create, update, and delete tasks. Users can view a list of tasks and filter them by status.

This project was created to showcase my full-stack coding and application architecture skills. For a detailed assessment and scoring of the project, please refer to Detailed-Report.pdf.

## Features

- **User Authentication**: Register, login, and logout.
- **Task Management**: Create, update, delete, and view tasks.
- **Task Filtering**: Filter tasks by their status.

### Back-End Technologies

- **Nest.js**: A framework built with Node.js and TypeScript.
- **MongoDB**: A NoSQL database, hosted in a Docker container.
- **Prisma ORM**: Object Relational Mapping tool to manage database schema and transactions.
- **JWT**: JSON Web Tokens for authentication and authorization.
- **UnitTests**: Each Module is tested using built-in Jest. Refer to .spec.ts files in each module.

### Front-End Technologies

- **React.js**
- **Axios**
- **Bootstrap**
- **React Router**

## Download and Setup Guide

## Overview

This guide provides detailed instructions on how to download, install, and run the Pesto Task Manager application, which includes both backend and frontend components.

## Prerequisites

- Docker Desktop
- Node.js
- npm (Node Package Manager)

## Backend Setup

### Getting Started

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Start MongoDB and Prisma Services using Docker**:

   ```bash
   docker-compose up
   ```

3. **Install Dependencies**:

   ```bash
   npm install
   ```

### Running the Backend

- **Development Mode**:

  ```bash
  npm run start
  ```

- **Watch Mode**:

  ```bash
  npm run start:dev
  ```

### Testing the Backend

- **Unit tests**:

  ```bash
  npm run test
  ```

- **Test coverage**:

  ```bash
  npm run test:cov
  ```

### Accessing the API

Open your browser and navigate to:
[https://127.0.0.1:3333/v1](https://localhost:3333/v1)

### Postman Collection

The Postman collection can be found in \`PESTO.postman_collection.json\`.

## Frontend Setup

### Installation

1. **Navigate to the Frontend Directory**:

   ```bash
   cd frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   ```

### Accessing the Application

Open your browser and navigate to:
[https://127.0.0.1:5173](https://127.0.0.1:5173)
