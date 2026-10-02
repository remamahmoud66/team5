import {getCurrentTeacher} from "../data.js"
import { seedData } from "../seedData.js";
import { loadWeather } from "../weather_api.js";

export function showDashboard(app) {

    console.log("Dashboard component loaded");
    console.log("App element:", app);
    console.log("Seed Data:", seedData);



    const teacher = getCurrentTeacher();

    console.log("Current teacher:", teacher);


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



    const firstClass = seedData.classes[0];

    const firstSubject = seedData.subjects.find(
        subject => subject.id === firstClass.subjectId
    );


    const firstExam = seedData.exams.find(
        exam => exam.classId === firstClass.id
    );


    const firstGrades = firstExam
        ? seedData.grades.filter(
            grade => grade.examId === firstExam.id
        )
        : [];


    const calculateClassStats = (classId) => {

        const selectedClass = seedData.classes.find(
            classItem => classItem.id === classId
        );


        if (!selectedClass) {
            return {
                subject: null,
                exam: null,
                grades: [],
                average: 0,
                highest: 0,
                lowest: 0,
                gradedStudents: 0,
                totalStudents: 0
            };
        }


        const subject = seedData.subjects.find(
            item => item.id === selectedClass.subjectId
        );


        const exam = seedData.exams.find(
            item => item.classId === selectedClass.id
        );


        const grades = exam
            ? seedData.grades.filter(
                grade => grade.examId === exam.id
            )
            : [];


        const totalMarks = grades.reduce(
            (sum, grade) => sum + grade.mark,
            0
        );


        const average =
            grades.length > 0
                ? Math.round(totalMarks / grades.length)
                : 0;


        const highest =
            grades.length > 0
                ? Math.max(
                    ...grades.map(grade => grade.mark)
                )
                : 0;


        const lowest =
            grades.length > 0
                ? Math.min(
                    ...grades.map(grade => grade.mark)
                )
                : 0;


        return {
            subject: subject,
            exam: exam,
            grades: grades,
            average: average,
            highest: highest,
            lowest: lowest,
            gradedStudents: grades.length,
            totalStudents: selectedClass.studentIds.length
        };

    };


    

    const initialStats = calculateClassStats(
        firstClass.id
    );




    const classOptions = seedData.classes.map(classItem => {

        const subject = seedData.subjects.find(
            item => item.id === classItem.subjectId
        );


        return `
            <option value="${classItem.id}">
                ${classItem.name}
                ${subject ? ` - ${subject.name}` : ""}
            </option>
        `;

    }).join("");


 

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



            <!-- =====================================================
                 CLASS PERFORMANCE
            ====================================================== -->

            <section class="dashboard-card class-performance-card">


                <!-- =========================
                     CARD HEADER
                ========================== -->

                <div class="card-header">

                    <div>

                        <h2>
                            Class Performance
                        </h2>

                        <p>
                            Average marks and exam performance
                        </p>

                    </div>


                    <!-- Class Selector -->

                    <select
                        id="classPerformanceSelect"
                        class="class-select"
                    >

                        ${classOptions}

                    </select>

                </div>



                <!-- =========================
                     SELECTED CLASS INFO
                ========================== -->

                <div class="selected-class-info">

                    <h3 id="selectedClassName">
                        ${firstClass.name}
                    </h3>

                    <p id="selectedSubjectName">
                        ${firstSubject ? firstSubject.name : "No subject"}
                    </p>

                </div>



                <!-- =========================
                     PERFORMANCE STATS
                ========================== -->

                <div
                    class="performance-stats"
                    id="performanceStats"
                >


                    <!-- Average -->

                    <div class="performance-stat">

                        <span>
                            Average Mark
                        </span>

                        <strong id="averageMark">
                            ${initialStats.average}%
                        </strong>

                    </div>



                    <div class="performance-stat">

                        <span>
                            Highest Mark
                        </span>

                        <strong id="highestMark">
                            ${initialStats.highest}
                        </strong>

                    </div>


                    <!-- Lowest -->

                    <div class="performance-stat">

                        <span>
                            Lowest Mark
                        </span>

                        <strong id="lowestMark">
                            ${initialStats.lowest}
                        </strong>

                    </div>


                    <!-- Students -->

                    <div class="performance-stat">

                        <span>
                            Students Graded
                        </span>

                        <strong id="gradedStudents">
                            ${initialStats.gradedStudents}
                            /
                            ${initialStats.totalStudents}
                        </strong>

                    </div>

                </div>



                <!-- =========================
                     STUDENT MARKS
                ========================== -->

                <div
                    class="student-performance"
                    id="studentPerformance"
                >

                    ${renderStudentMarks(initialStats.grades)}

                </div>


            </section>


        </section>

    `;



    loadWeather();


    console.log(
        "Dashboard rendered successfully"
    );



    const classPerformanceSelect =
        document.getElementById(
            "classPerformanceSelect"
        );


    classPerformanceSelect.addEventListener(
        "change",
        () => {

            const selectedClassId =
                classPerformanceSelect.value;


            const stats =
                calculateClassStats(
                    selectedClassId
                );


            // Find selected class
            const selectedClass =
                seedData.classes.find(
                    classItem =>
                        classItem.id === selectedClassId
                );


            // Update class name
            document.getElementById(
                "selectedClassName"
            ).textContent =
                selectedClass
                    ? selectedClass.name
                    : "No class";


            // Update subject name
            document.getElementById(
                "selectedSubjectName"
            ).textContent =
                stats.subject
                    ? stats.subject.name
                    : "No subject";


            // Update average
            document.getElementById(
                "averageMark"
            ).textContent =
                `${stats.average}%`;


            // Update highest
            document.getElementById(
                "highestMark"
            ).textContent =
                stats.highest;


            // Update lowest
            document.getElementById(
                "lowestMark"
            ).textContent =
                stats.lowest;


            // Update graded students
            document.getElementById(
                "gradedStudents"
            ).textContent =
                `${stats.gradedStudents} / ${stats.totalStudents}`;


            // Update students marks
            document.getElementById(
                "studentPerformance"
            ).innerHTML =
                renderStudentMarks(
                    stats.grades
                );

        }
    );




    const createHomeworkBtn =
        document.getElementById(
            "createHomeworkBtn"
        );


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




function renderStudentMarks(grades) {

    if (grades.length === 0) {

        return `
            <div class="no-grades">
                No grades have been recorded for this class yet.
            </div>
        `;

    }


    return grades.map(grade => {

        const student =
            seedData.students.find(
                student =>
                    student.id === grade.studentId
            );


        const studentName =
            student
                ? student.fullName
                : "Unknown Student";


        return `

            <div class="student-mark-row">

                <div class="student-name">

                    <span class="student-avatar">
                        ${studentName.charAt(0)}
                    </span>

                    <span>
                        ${studentName}
                    </span>

                </div>


                <div class="student-mark">

                    <div class="mark-bar">

                        <div
                            class="mark-progress"
                            style="width: ${grade.mark}%"
                        ></div>

                    </div>

                    <strong>
                        ${grade.mark}
                    </strong>

                </div>

            </div>

        `;

    }).join("");

}