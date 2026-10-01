
import { showDashboard } from "./components/dashboard.js";
import { showAttendance } from "./components/attendance.js";


// =========================================================
// APP ELEMENT
// =========================================================

const app = document.getElementById("app");


// Check if app exists
if (!app) {

    console.error(
        "ERROR: #app element was not found!"
    );

}


// =========================================================
// NAVIGATION
// =========================================================

const menuItems =
    document.querySelectorAll(".nav-link");


console.log("Menu items:", menuItems.length);


// =========================================================
// LOAD PAGE
// =========================================================

function loadPage(page) {

    console.log("Loading page:", page);


    if (page === "dashboard") {

        showDashboard(app);

    }

    else {

        app.innerHTML = `

            <section class="page-content">

                <h1>
                    ${page}
                </h1>

                <p>
                    This page is not implemented yet.
                </p>

            </section>

        `;

    }

    if (page == "attendance") {

        showAttendance(app);


    }



}


// =========================================================
// SIDEBAR CLICK
// =========================================================

menuItems.forEach(item => {

    item.addEventListener("click", event => {

        // Prevent changing the URL
        event.preventDefault();


        // Remove active class
        menuItems.forEach(menuItem => {

            menuItem.classList.remove("active");

        });


        // Add active class to clicked item
        item.classList.add("active");


        // Get page name
        const page =
            item.dataset.page;


        // Load page
        loadPage(page);

    });

});


// =========================================================
// INITIAL PAGE
// =========================================================

loadPage("dashboard");

