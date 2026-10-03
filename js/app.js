import { showDashboard } from "./components/dashboard.js";
import { showAttendance } from "./components/attendance.js";
import { showProfile } from "./components/profile.js";
import { showStudents } from "./components/students.js";
import { showSubjects } from "./components/subject.js";
import { showClasses } from "./components/classes.js";
import { showHomework } from "./components/homwork.js";
import { showExams } from "./components/exams.js";
import { logout, getCurrentTeacher } from "./data.js";


/* =========================================================
   TEACHER DATA
========================================================= */

const teacher = getCurrentTeacher();

let firstName = "";
let secondName = "";

if (teacher && teacher.fullName) {

    const splitedName = teacher.fullName.trim().split(" ");

    firstName = splitedName[0] || "";
    secondName = splitedName[1] || "";

}


/* =========================================================
   MAIN APP
========================================================= */

const app = document.getElementById("app");

if (!app) {

    console.error("ERROR: #app element was not found!");

}


/* =========================================================
   NAVIGATION
========================================================= */

const menuItems = document.querySelectorAll(".nav-link");

console.log("Menu items:", menuItems.length);


function loadPage(page) {

    console.log("Loading page:", page);


    if (page === "dashboard") {

        showDashboard(app);

    }

    else if (page === "attendance") {

        showAttendance(app);

    }

    else if (page === "students") {

        showStudents(app);

    }

    else if (page === "subjects") {

        showSubjects(app);

    }

    else if (page === "classes") {

        showClasses(app);

    }

    else if (page === "homework") {

        showHomework(app);

    }

    else if (page === "exams") {

        showExams(app);

    }

    else if (page === "profile") {

        showProfile(app);

    }

    else if (page === "logout") {

        logout();

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

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

const mobileMenuBtn =
    document.getElementById("mobile-menu-btn");

const sidebar =
    document.querySelector(".sidebar");

const sidebarOverlay =
    document.getElementById("sidebar-overlay");


function openMobileMenu() {

    if (!sidebar || !sidebarOverlay || !mobileMenuBtn) {
        return;
    }

    sidebar.classList.add("mobile-open");

    sidebarOverlay.classList.add("active");

    mobileMenuBtn.innerHTML = "×";

    mobileMenuBtn.setAttribute(
        "aria-expanded",
        "true"
    );

    mobileMenuBtn.setAttribute(
        "aria-label",
        "Close menu"
    );

}


function closeMobileMenu() {

    if (!sidebar || !sidebarOverlay || !mobileMenuBtn) {
        return;
    }

    sidebar.classList.remove("mobile-open");

    sidebarOverlay.classList.remove("active");

    mobileMenuBtn.innerHTML = "☰";

    mobileMenuBtn.setAttribute(
        "aria-expanded",
        "false"
    );

    mobileMenuBtn.setAttribute(
        "aria-label",
        "Open menu"
    );

}


function toggleMobileMenu() {

    if (!sidebar) {
        return;
    }

    const isOpen =
        sidebar.classList.contains("mobile-open");

    if (isOpen) {

        closeMobileMenu();

    }

    else {

        openMobileMenu();

    }

}


/* =========================================================
   MOBILE MENU EVENTS
========================================================= */

if (mobileMenuBtn) {

    mobileMenuBtn.addEventListener(
        "click",
        toggleMobileMenu
    );

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileMenu
    );

}


/* =========================================================
   NAVIGATION EVENTS
========================================================= */

menuItems.forEach(item => {

    item.addEventListener("click", event => {

        event.preventDefault();


        menuItems.forEach(menuItem => {

            menuItem.classList.remove("active");

        });


        item.classList.add("active");


        const page =
            item.dataset.page;


        if (!page) {
            return;
        }


        loadPage(page);


        /*
         * Close mobile sidebar
         * after selecting a page.
         */
        closeMobileMenu();

    });

});


/* =========================================================
   LOGOUT
========================================================= */

const logoutButton =
    document.querySelector(
        ".sidebar-logout .logout-btn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            closeMobileMenu();

            logout();

        }
    );

}

else {

    console.error(
        "ERROR: Logout button was not found!"
    );

}


/* =========================================================
   PROFILE BUTTON
========================================================= */

const profileButton =
    document.querySelector(".user-profile");


if (profileButton) {

    profileButton.addEventListener(
        "click",
        () => {

            showProfile(app);

            /*
             * Remove active state from sidebar
             * because profile is opened from header.
             */
            menuItems.forEach(item => {

                item.classList.remove("active");

            });

            closeMobileMenu();

        }
    );

}


/* =========================================================
   HEADER TEACHER NAME
========================================================= */

const profileName =
    document.getElementById("profileName");


if (profileName && teacher) {

    profileName.textContent =
        teacher.fullName || "";

}


/* =========================================================
   HEADER AVATAR
========================================================= */

const avatar =
    document.getElementById("avatar");


if (
    avatar &&
    firstName &&
    secondName
) {

    avatar.textContent =
        `${firstName[0]}${secondName[0]}`;

}

else if (avatar && firstName) {

    avatar.textContent =
        firstName[0];

}


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
         * If user goes back to desktop,
         * close the mobile sidebar.
         */
        if (window.innerWidth > 768) {

            closeMobileMenu();

        }

    }
);


/* =========================================================
   INITIAL PAGE
========================================================= */

loadPage("dashboard");