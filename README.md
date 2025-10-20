# Projects & Publications Web Application

A full-stack web application for browsing, searching, and filtering projects and publications data with relationships.

## Tech Stack

- Backend: Python 3.10+ with Flask and Flask-CORS
- Frontend: React with Vite and React Router
- Data Processing: Python Pandas

## Prerequisites

- macOS with Homebrew installed
- Python 3.10+ installed via Homebrew
- Node.js 18+ and npm installed via Homebrew
- Git installed

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Backend Setup & Data Preprocessing

1. Create and activate a Python virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install Python dependencies:

   ```bash
   pip install flask flask-cors pandas numpy
   ```

3. Run the data preprocessing script to generate `data.json`:

   ```bash
   python backend/process_data.py
   ```

### 3. Start the Flask API Server

With the virtual environment active, run:

```bash
flask --app backend/server run
```

The API will be available at `http://127.0.0.1:5000`.

### 4. Frontend Setup & Development Server

1. Open a new terminal window.
2. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

3. Install npm dependencies:

   ```bash
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

## Usage

1. Ensure both backend and frontend are running.
2. Visit `http://localhost:5173` in your browser.
3. Use the search box, filters, and date-range inputs to find projects or publications.
4. Click on a project or publication to view its detail page with associated items.

## Assumptions

- CSV files (`sample_projects.csv`, `sample_publications.csv`, `publicationprojectlink.csv`) contain the complete dataset.
- NaN values are converted to `null` in `data.json`.
- Link table accurately represents project-publication relationships.
- Basic filtering (search, type/status, date range) fulfills requirements; advanced search features not implemented.
- UI styling is minimal to prioritize functionality.
