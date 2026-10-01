
import { seedData } from "../seedData.js";
import { loadWeather } from "../weather_api.js";

export function showDashboard(app) {

    console.log("Dashboard component loaded");

    console.log("App element:", app);

    console.log("Seed Data:", seedData);


    // =========================================================
    // DASHBOARD DATA
    // =========================================================

    const teacher = seedData.teachers[0];

    console.log("Current teacher:", teacher);


    // =========================================================
    // ATTENDANCE DATA
    // =========================================================

    const attendance = seedData.attendance;

    const totalAttendance = attendance.length;

    const presentCount = attendance.filter(
        item => item.status === "Present"
    ).length;


    const overallAttendance =
        totalAttendance > 0
            ? Math.round(
                (presentCount / totalAttendance) * 100
            )
            : 0;


    // =========================================================
    // COURSE STATISTICS
    // =========================================================

    const courseStatistics = seedData.subjects.map(subject => {

        const subjectAttendance = attendance.filter(
            item => item.subjectId === subject.id
        );


        const present = subjectAttendance.filter(
            item => item.status === "Present"
        ).length;


        const percentage =
            subjectAttendance.length > 0
                ? Math.round(
                    (present / subjectAttendance.length) * 100
                )
                : 0;


        return `
            <div class="course-item">

                <div class="course-info">

                    <span class="course-dot"></span>

                    <div>

                        <strong>
                            ${subject.name}
                        </strong>

                        <small>
                            ${subject.code}
                        </small>

                    </div>

                </div>


                <strong class="percentage">
                    ${percentage}%
                </strong>

            </div>
        `;
    }).join("");


    // =========================================================
    // RENDER DASHBOARD
    // =========================================================

    app.innerHTML = `

        <section class="page-content">


            <!-- =========================
                 WELCOME
            ========================== -->

            <section class="welcome-card">

                <div class="welcome-content">

                    <h1>

                        Good evening,

                        <span id="userName">
                            ${teacher.fullName}
                        </span>

                        <span>👋</span>

                    </h1>


                    <p>

                        Your academic workspace is ready.
                        Manage classes, students, assignments,
                        exams and attendance from one place.

                    </p>

                </div>


                <button
                    class="create-btn"
                    id="createHomeworkBtn"
                >

                    <span>+</span>

                    Create Homework

                </button>

            </section>



            <!-- =========================
                 DASHBOARD GRID
            ========================== -->

            <div class="dashboard-grid">


                <!-- =========================
                     WEATHER
                ========================== -->

                <section class="dashboard-card weather-card">

                    <div class="card-header">

                        <div>

                            <h2>
                                Weather — Amman
                            </h2>

                        </div>

                    </div>


                    <div class="weather-content">

                        <div class="weather-icon">

                            <i
                                id="weatherIcon"
                                class="fa-solid fa-sun"
                            ></i>

                        </div>


                        <div class="temperature">

                            <strong id="temperature">
                                Loading...
                            </strong>


                            <span id="weatherLocation">
                                Amman · Loading...
                            </span>

                        </div>

                    </div>


                    <p
                        id="weatherDescription"
                        class="weather-description"
                    >
                        Loading weather data...
                    </p>

                </section>



                <!-- =========================
                     ATTENDANCE
                ========================== -->

                <section class="dashboard-card attendance-card">

                    <div class="card-header">

                        <div>

                            <h2>
                                Attendance Statistics
                            </h2>

                            <p>
                                Students attendance by course
                            </p>

                        </div>


                        <button
                            class="more-btn"
                            type="button"
                        >

                            <i class="fa-solid fa-ellipsis"></i>

                        </button>

                    </div>



                    <div class="attendance-content">


                        <!-- Chart -->

                        <div class="chart-container">

                            <div
                                class="attendance-chart"
                                id="attendanceChart"
                                style="
                                    --attendance: ${overallAttendance}%;
                                "
                            >

                                <div class="chart-center">

                                    <strong>
                                        ${overallAttendance}%
                                    </strong>

                                    <span>
                                        Overall
                                    </span>

                                </div>

                            </div>

                        </div>



                        <!-- Course Statistics -->

                        <div
                            class="course-statistics"
                            id="courseStatistics"
                        >

                            ${courseStatistics}

                        </div>


                    </div>

                </section>


            </div>


        </section>

    `;

    loadWeather();
    console.log("Dashboard rendered successfully");


    // =========================================================
    // CREATE HOMEWORK BUTTON
    // =========================================================

    const createHomeworkBtn =
        document.getElementById("createHomeworkBtn");


    if (createHomeworkBtn) {

        createHomeworkBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "Create Homework clicked"
                );

            }
        );

    }

}

