import { showDashboard } from "./components/dashboard.js";
import { showAttendance } from "./components/attendance.js";
import { showProfile } from "./components/profile.js";
import {logout , getCurrentTeacher} from "./data.js";

const teacher= getCurrentTeacher();
const splitedName= teacher.fullName.split(' ');
const firstName= splitedName[0] ;
const secondName= splitedName[1] ;

const app = document.getElementById("app");



if (!app) {

    console.error(
        "ERROR: #app element was not found!"
    );

}



const menuItems =
    document.querySelectorAll(".nav-link");


console.log("Menu items:", menuItems.length);



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

    if (page == "logout") {

        logout();


    }



}



menuItems.forEach(item => {

    item.addEventListener("click", event => {

        event.preventDefault();


        menuItems.forEach(menuItem => {

            menuItem.classList.remove("active");

        });


        item.classList.add("active");


        const page =
            item.dataset.page;


        loadPage(page);

    });

});


const logoutButton = document.querySelector(".sidebar-logout .logout-btn"); if (logoutButton) { logoutButton.addEventListener("click", event => { event.preventDefault(); logout(); }); } else { console.error("ERROR: Logout button was not found!"); }


const profileButton = document.querySelector(".user-profile"); if (profileButton) { profileButton.addEventListener("click", () => { showProfile(app); }); }

const profileName=document.getElementById("profileName");
profileName.textContent=teacher.fullName;
const avatar= document.getElementById("avatar");
avatar.textContent=`${firstName[0]}${secondName[0]}`;
loadPage("dashboard");

