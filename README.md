# Evolvia

Evolvia is a lightweight, client-side educational management platform designed for teachers to organize and streamline daily academic workflows. Built entirely with native web technologies—**HTML5, CSS3, and Vanilla JavaScript (ES6+)**—the application provides educators with an intuitive dashboard to manage classes, subjects, students, study materials, and homework assignments without relying on heavy frontend or backend frameworks.

The platform also integrates an external weather forecast API widget directly into the dashboard environment, keeping educators informed of current and upcoming conditions alongside their daily schedule.

---

## Live Demo & Repository

- **Live Application:** [https://remamahmoud66.github.io/team5/](https://remamahmoud66.github.io/team5/)
- **GitHub Repository:** [https://github.com/remamahmoud66/team5](https://github.com/remamahmoud66/team5)

---

## Project Overview & Core Features

Evolvia acts as an all-in-one workspace for educators, simplifying classroom administration directly in the browser:

* **Teacher Dashboard:** A central control panel providing quick access to academic metrics, scheduled tasks, and live daily context.
* **Class & Subject Management:** Tools to structure courses, organize different grade levels, and categorize curriculum subjects.
* **Student Tracking:** Lists and records to keep track of enrolled students across different classes.
* **Study Materials & Resources:** Centralized repository for uploading, organizing, and referencing learning materials and lesson notes.
* **Homework & Assignment Management:** Create, track, and manage student assignments, due dates, and submissions.
* **Live Weather Integration:** Embedded meteorological widget to monitor weather conditions relevant to outdoor activities, school commutes, and planning.

---

## Technology Stack

The project relies strictly on native browser capabilities with no third-party libraries, build steps, or backend runtime environments:

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic structure for dashboard layouts, modals, and management tables |
| **CSS3** | Responsive dashboard styling, layout cards, typography, and theme styling |
| **Vanilla JavaScript (ES6+)** | Core business logic, dynamic DOM updates, data filtering, and modular code architecture |
| **Open-Meteo Forecast API** | Real-time external weather forecast data integration |
| **localStorage** | Persistent client-side storage for academic records (classes, students, homework) across sessions |
| **sessionStorage** | Transient session state management scoped to active browser navigation |

---

## Technical Approach: Why Vanilla JavaScript?

Evolvia demonstrates how a full-featured educational dashboard can be implemented cleanly and efficiently using native web standards.

By avoiding heavy frameworks (such as React, Vue, or Angular) and complex build pipelines, the project achieves:
- **Instant Execution:** Zero build/transpilation step; runs directly in modern browsers.
- **High Performance:** Minimal resource footprint and fast rendering speeds without virtual DOM overhead.
- **Transparent Architecture:** Direct platform control using native Web APIs.

### JavaScript Concepts Used

- **ES6+ Modules (`import` / `export`):** Modular separation of concerns across management components and utilities.
- **Fetch API & Asynchronous Code (`async` / `await`):** Non-blocking external HTTP data handling.
- **Native DOM Manipulation:** Dynamic creation, removal, and rendering of dashboard cards, student rows, and status indicators.
- **Event-Driven Architecture:** Event listeners handling user actions such as form submissions, filtering, and assignment toggling.
- **Client-Side State Persistence:** Synchronizing records seamlessly using `localStorage` and `sessionStorage`.

---

## External API Integration

Evolvia integrates a live weather widget into the dashboard via the Open-Meteo weather service.

### API Details

- **Provider:** [Open-Meteo Forecast API](https://open-meteo.com/)
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **HTTP Method:** `GET`
- **Requested Data:** Current weather parameters and hourly forecast metrics for subsequent hours.

### Application Flow

```text
Teacher loads Dashboard
          ↓
JavaScript triggers Fetch API Request (GET)
          ↓
Open-Meteo API Endpoint
          ↓
JSON Response received
          ↓
JavaScript extracts weather codes & temperatures
          ↓
DOM updates with temperature & condition icons (e.g., sunny, rainy, cold)
```

### Data Processing & UI State

* **Successful Response:** The application parses the JSON payload, computes the active weather status, and injects temperature figures alongside contextual weather icons (e.g., sunny, overcast, cold) into the dashboard widget.
* **Error Handling & Fallback:** If network connectivity drops or the API returns an error status, the application prevents interface breakage. Numerical indicators safely revert to `--`, clearing out stale data without halting the rest of the dashboard.

---

## Browser Storage Implementation

Evolvia handles data persistence directly on the client side:

- **`localStorage`:** Stores teacher data—including classes, enrolled students, subjects, materials, and homework entries—persisting records across browser reloads.
- **`sessionStorage`:** Handles short-term session preferences and active UI view states for the current browser session.

---

## Getting Started & Local Setup

Because the application uses native JavaScript modules (`<script type="module">`), loading the project directly using the `file://` protocol (double-clicking `index.html`) will trigger browser CORS restrictions on local module imports. 

The application must be served over a local HTTP server.

### Recommended Local Setup (VS Code Live Server)

1. Clone the repository:
   ```bash
   git clone https://github.com/remamahmoud66/team5.git
   ```
2. Open the project folder in **Visual Studio Code**.
3. Ensure the **Live Server** extension (by Ritwick Dey) is installed.
4. Right-click on `index.html` and select **"Open with Live Server"**.
5. The dashboard will launch in your browser at `http://127.0.0.1:5500/index.html`.

---

## Project Structure

```text
team5/
├── index.html          # Main dashboard structure and application entry point
├── css/
│   └── style.css       # Core layout styling, responsive grids, and components
├── js/
│   ├── main.js         # Central application controller (type="module")
│   ├── api.js          # Open-Meteo Fetch request and data parser
│   └── storage.js      # Web Storage API utilities (localStorage/sessionStorage)
└── README.md           # Project documentation
```