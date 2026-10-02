
const seedData = {

    // ============================================================
    // TEACHERS
    // ============================================================

    teachers: [

        {
            id: "T001",
            fullName: "Ahmad Khaled",
            birthDate: "1988-04-15",
            degree: "Bachelor of Computer Science",
            phone: "0790000000",
            email: "ahmad@example.com",
            password: "123456"
        },

        {
            id: "T002",
            fullName: "Sara Mohammed",
            birthDate: "1990-07-22",
            degree: "Master of Information Technology",
            phone: "0790000001",
            email: "sara@example.com",
            password: "123456"
        },

        {
            id: "T003",
            fullName: "Omar Hassan",
            birthDate: "1985-11-10",
            degree: "Bachelor of Software Engineering",
            phone: "0790000002",
            email: "omar@example.com",
            password: "123456"
        },

        {
            id: "T004",
            fullName: "Lina Ahmad",
            birthDate: "1992-03-18",
            degree: "Bachelor of Mathematics",
            phone: "0790000003",
            email: "lina@example.com",
            password: "123456"
        }

    ],


    // ============================================================
    // STUDENTS
    // ============================================================

    students: [

        {
            id: "ST001",
            fullName: "Mohammad Ali",
            birthDate: "2008-05-12",
            academicLevel: "10th Grade",
            phone: "0791111111",
            email: "mohammad@example.com",
            status: "Active"
        },

        {
            id: "ST002",
            fullName: "Ahmad Omar",
            birthDate: "2008-08-20",
            academicLevel: "10th Grade",
            phone: "0792222222",
            email: "ahmad.student@example.com",
            status: "Active"
        },

        {
            id: "ST003",
            fullName: "Omar Hassan",
            birthDate: "2008-03-10",
            academicLevel: "10th Grade",
            phone: "0793333333",
            email: "omar.student@example.com",
            status: "Active"
        },

        {
            id: "ST004",
            fullName: "Yousef Khalil",
            birthDate: "2008-06-17",
            academicLevel: "10th Grade",
            phone: "0794444444",
            email: "yousef@example.com",
            status: "Active"
        },

        {
            id: "ST005",
            fullName: "Zaid Mohammad",
            birthDate: "2008-01-25",
            academicLevel: "10th Grade",
            phone: "0795555555",
            email: "zaid@example.com",
            status: "Active"
        },

        {
            id: "ST006",
            fullName: "Khaled Samir",
            birthDate: "2008-09-03",
            academicLevel: "10th Grade",
            phone: "0796666666",
            email: "khaled@example.com",
            status: "Active"
        },

        {
            id: "ST007",
            fullName: "Rami Nasser",
            birthDate: "2009-02-14",
            academicLevel: "9th Grade",
            phone: "0797777777",
            email: "rami@example.com",
            status: "Active"
        },

        {
            id: "ST008",
            fullName: "Laith Ahmad",
            birthDate: "2009-04-09",
            academicLevel: "9th Grade",
            phone: "0798888888",
            email: "laith@example.com",
            status: "Active"
        },

        {
            id: "ST009",
            fullName: "Yazan Ali",
            birthDate: "2009-07-21",
            academicLevel: "9th Grade",
            phone: "0799999999",
            email: "yazan@example.com",
            status: "Active"
        },

        {
            id: "ST010",
            fullName: "Malak Sami",
            birthDate: "2008-12-11",
            academicLevel: "10th Grade",
            phone: "0781111111",
            email: "malak@example.com",
            status: "Active"
        },

        {
            id: "ST011",
            fullName: "Dana Khaled",
            birthDate: "2009-05-19",
            academicLevel: "9th Grade",
            phone: "0782222222",
            email: "dana@example.com",
            status: "Active"
        },

        {
            id: "ST012",
            fullName: "Sara Ali",
            birthDate: "2008-10-27",
            academicLevel: "10th Grade",
            phone: "0783333333",
            email: "sara.student@example.com",
            status: "Active"
        }

    ],


    // ============================================================
    // SUBJECTS
    // ============================================================

    subjects: [

        {
            id: "SUB001",
            name: "JavaScript",
            teacherId: "T001",
            syllabus: "DOM, Events, Functions, LocalStorage and APIs"
        },

        {
            id: "SUB002",
            name: "Laravel",
            teacherId: "T001",
            syllabus: "Laravel, MVC, Routing, Controllers and APIs"
        },

        {
            id: "SUB003",
            name: "Web Design",
            teacherId: "T002",
            syllabus: "HTML, CSS, Responsive Design and UI Principles"
        },

        {
            id: "SUB004",
            name: "Database",
            teacherId: "T002",
            syllabus: "SQL, Tables, Relationships, Queries and Normalization"
        },

        {
            id: "SUB005",
            name: "Programming Fundamentals",
            teacherId: "T003",
            syllabus: "Variables, Conditions, Loops, Functions and OOP"
        },

        {
            id: "SUB006",
            name: "Mathematics",
            teacherId: "T004",
            syllabus: "Algebra, Geometry, Equations and Functions"
        }

    ],


    // ============================================================
    // CLASSES
    // ============================================================

    classes: [

        {
            id: "C001",
            name: "JavaScript - Grade 10 A",
            subjectId: "SUB001",
            teacherId: "T001",
            studentIds: [
                "ST001",
                "ST002",
                "ST003",
                "ST004",
                "ST005",
                "ST006"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        },

        {
            id: "C002",
            name: "Laravel - Grade 10 A",
            subjectId: "SUB002",
            teacherId: "T001",
            studentIds: [
                "ST001",
                "ST002",
                "ST003",
                "ST004",
                "ST005",
                "ST006"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        },

        {
            id: "C003",
            name: "Web Design - Grade 10 B",
            subjectId: "SUB003",
            teacherId: "T002",
            studentIds: [
                "ST007",
                "ST008",
                "ST009",
                "ST010",
                "ST011",
                "ST012"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        },

        {
            id: "C004",
            name: "Database - Grade 10 B",
            subjectId: "SUB004",
            teacherId: "T002",
            studentIds: [
                "ST007",
                "ST008",
                "ST009",
                "ST010",
                "ST011",
                "ST012"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        },

        {
            id: "C005",
            name: "Programming - Grade 9 A",
            subjectId: "SUB005",
            teacherId: "T003",
            studentIds: [
                "ST007",
                "ST008",
                "ST009",
                "ST010",
                "ST011",
                "ST012"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        },

        {
            id: "C006",
            name: "Mathematics - Grade 10 A",
            subjectId: "SUB006",
            teacherId: "T004",
            studentIds: [
                "ST001",
                "ST002",
                "ST003",
                "ST004",
                "ST005",
                "ST006"
            ],
            createdAt: "2026-09-28",
            expiryDate: "2027-01-28"
        }

    ],


    // ============================================================
    // MATERIALS
    // ============================================================

    materials: [

        {
            id: "MAT001",
            title: "JavaScript DOM Guide",
            description: "Introduction to DOM manipulation",
            type: "PDF",
            fileUrl: "/files/javascript-dom.pdf",
            teacherId: "T001",
            subjectId: "SUB001",
            classId: "C001",
            createdAt: "2026-09-28"
        },

        {
            id: "MAT002",
            title: "Laravel Guide",
            description: "Introduction to Laravel and MVC",
            type: "PDF",
            fileUrl: "/files/laravel.pdf",
            teacherId: "T001",
            subjectId: "SUB002",
            classId: "C002",
            createdAt: "2026-09-28"
        },

        {
            id: "MAT003",
            title: "HTML & CSS Guide",
            description: "Web design fundamentals",
            type: "PDF",
            fileUrl: "/files/html-css.pdf",
            teacherId: "T002",
            subjectId: "SUB003",
            classId: "C003",
            createdAt: "2026-09-29"
        },

        {
            id: "MAT004",
            title: "SQL Basics",
            description: "Introduction to relational databases",
            type: "PDF",
            fileUrl: "/files/sql-basics.pdf",
            teacherId: "T002",
            subjectId: "SUB004",
            classId: "C004",
            createdAt: "2026-09-29"
        },

        {
            id: "MAT005",
            title: "Programming Fundamentals",
            description: "Programming basics and problem solving",
            type: "PDF",
            fileUrl: "/files/programming.pdf",
            teacherId: "T003",
            subjectId: "SUB005",
            classId: "C005",
            createdAt: "2026-09-29"
        },

        {
            id: "MAT006",
            title: "Algebra Guide",
            description: "Algebra and equations",
            type: "PDF",
            fileUrl: "/files/algebra.pdf",
            teacherId: "T004",
            subjectId: "SUB006",
            classId: "C006",
            createdAt: "2026-09-29"
        }

    ],


    // ============================================================
    // HOMEWORKS
    // ============================================================

    homeworks: [

        {
            id: "HW001",
            title: "DOM Assignment",
            description: "Create a dynamic To-Do List",
            teacherId: "T001",
            classId: "C001",
            createdAt: "2026-09-28",
            deadline: "2026-10-02"
        },

        {
            id: "HW002",
            title: "Laravel CRUD",
            description: "Create a CRUD application using Laravel",
            teacherId: "T001",
            classId: "C002",
            createdAt: "2026-09-29",
            deadline: "2026-10-06"
        },

        {
            id: "HW003",
            title: "Responsive Website",
            description: "Create a responsive website using HTML and CSS",
            teacherId: "T002",
            classId: "C003",
            createdAt: "2026-09-29",
            deadline: "2026-10-05"
        },

        {
            id: "HW004",
            title: "SQL Queries",
            description: "Write SQL queries for a student database",
            teacherId: "T002",
            classId: "C004",
            createdAt: "2026-09-30",
            deadline: "2026-10-08"
        },

        {
            id: "HW005",
            title: "Programming Exercises",
            description: "Solve programming problems using functions and loops",
            teacherId: "T003",
            classId: "C005",
            createdAt: "2026-09-30",
            deadline: "2026-10-07"
        }

    ],


    // ============================================================
    // HOMEWORK STATUSES
    // ============================================================

    homeworkStatuses: [

        {
            id: "HWS001",
            homeworkId: "HW001",
            studentId: "ST001",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS002",
            homeworkId: "HW001",
            studentId: "ST002",
            status: "Not Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS003",
            homeworkId: "HW001",
            studentId: "ST003",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS004",
            homeworkId: "HW001",
            studentId: "ST004",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS005",
            homeworkId: "HW001",
            studentId: "ST005",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS006",
            homeworkId: "HW001",
            studentId: "ST006",
            status: "Not Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS007",
            homeworkId: "HW002",
            studentId: "ST001",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS008",
            homeworkId: "HW002",
            studentId: "ST002",
            status: "Submitted",
            updatedAt: "2026-09-30"
        },

        {
            id: "HWS009",
            homeworkId: "HW002",
            studentId: "ST003",
            status: "Not Submitted",
            updatedAt: "2026-09-30"
        }

    ],


    // ============================================================
    // EXAMS
    // ============================================================

    exams: [

        {
            id: "EX001",
            title: "JavaScript Midterm",
            description: "DOM, Events and Storage",
            teacherId: "T001",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-10-05",
            totalMarks: 100
        },

        {
            id: "EX002",
            title: "Laravel Midterm",
            description: "MVC, Routing and CRUD",
            teacherId: "T001",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-10-12",
            totalMarks: 100
        },

        {
            id: "EX003",
            title: "Web Design Exam",
            description: "HTML, CSS and Responsive Design",
            teacherId: "T002",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-10-10",
            totalMarks: 100
        },

        {
            id: "EX004",
            title: "Database Exam",
            description: "SQL and Database Relationships",
            teacherId: "T002",
            classId: "C004",
            subjectId: "SUB004",
            date: "2026-10-15",
            totalMarks: 100
        },

        {
            id: "EX005",
            title: "Programming Exam",
            description: "Variables, Loops, Functions and OOP",
            teacherId: "T003",
            classId: "C005",
            subjectId: "SUB005",
            date: "2026-10-18",
            totalMarks: 100
        }

    ],


    // ============================================================
    // GRADES
    // ============================================================

    grades: [

        // JavaScript
        {
            id: "GR001",
            examId: "EX001",
            studentId: "ST001",
            mark: 87
        },

        {
            id: "GR002",
            examId: "EX001",
            studentId: "ST002",
            mark: 92
        },

        {
            id: "GR003",
            examId: "EX001",
            studentId: "ST003",
            mark: 74
        },

        {
            id: "GR004",
            examId: "EX001",
            studentId: "ST004",
            mark: 89
        },

        {
            id: "GR005",
            examId: "EX001",
            studentId: "ST005",
            mark: 78
        },

        {
            id: "GR006",
            examId: "EX001",
            studentId: "ST006",
            mark: 95
        },

        // Laravel
        {
            id: "GR007",
            examId: "EX002",
            studentId: "ST001",
            mark: 90
        },

        {
            id: "GR008",
            examId: "EX002",
            studentId: "ST002",
            mark: 84
        },

        {
            id: "GR009",
            examId: "EX002",
            studentId: "ST003",
            mark: 88
        },

        // Web Design
        {
            id: "GR010",
            examId: "EX003",
            studentId: "ST007",
            mark: 91
        },

        {
            id: "GR011",
            examId: "EX003",
            studentId: "ST008",
            mark: 86
        },

        {
            id: "GR012",
            examId: "EX003",
            studentId: "ST009",
            mark: 79
        },

        {
            id: "GR013",
            examId: "EX003",
            studentId: "ST010",
            mark: 94
        },

        {
            id: "GR014",
            examId: "EX003",
            studentId: "ST011",
            mark: 82
        },

        {
            id: "GR015",
            examId: "EX003",
            studentId: "ST012",
            mark: 88
        }

    ],


    // ============================================================
    // ATTENDANCE
    // ============================================================

    attendance: [

        // JavaScript - C001
        {
            id: "ATT001",
            studentId: "ST001",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT002",
            studentId: "ST002",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT003",
            studentId: "ST003",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Absent"
        },

        {
            id: "ATT004",
            studentId: "ST004",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT005",
            studentId: "ST005",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT006",
            studentId: "ST006",
            classId: "C001",
            subjectId: "SUB001",
            date: "2026-09-30",
            status: "Present"
        },


        // Laravel - C002
        {
            id: "ATT007",
            studentId: "ST001",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT008",
            studentId: "ST002",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Absent"
        },

        {
            id: "ATT009",
            studentId: "ST003",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT010",
            studentId: "ST004",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT011",
            studentId: "ST005",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT012",
            studentId: "ST006",
            classId: "C002",
            subjectId: "SUB002",
            date: "2026-09-30",
            status: "Present"
        },


        // Web Design - C003
        {
            id: "ATT013",
            studentId: "ST007",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT014",
            studentId: "ST008",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT015",
            studentId: "ST009",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Absent"
        },

        {
            id: "ATT016",
            studentId: "ST010",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT017",
            studentId: "ST011",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Present"
        },

        {
            id: "ATT018",
            studentId: "ST012",
            classId: "C003",
            subjectId: "SUB003",
            date: "2026-09-30",
            status: "Present"
        }

    ],


    // ============================================================
    // NOTES
    // ============================================================

    notes: [

        {
            id: "NOTE001",
            studentId: "ST001",
            teacherId: "T001",
            classId: "C001",
            text: "Excellent participation in today's lesson.",
            createdAt: "2026-09-30"
        },

        {
            id: "NOTE002",
            studentId: "ST003",
            teacherId: "T001",
            classId: "C001",
            text: "Needs to participate more during class.",
            createdAt: "2026-09-30"
        },

        {
            id: "NOTE003",
            studentId: "ST006",
            teacherId: "T001",
            classId: "C002",
            text: "Very good performance in Laravel.",
            createdAt: "2026-09-30"
        },

        {
            id: "NOTE004",
            studentId: "ST009",
            teacherId: "T002",
            classId: "C003",
            text: "Needs improvement in CSS assignments.",
            createdAt: "2026-09-30"
        }

    ],


    // ============================================================
    // NOTIFICATIONS
    // ============================================================

    notifications: [

        {
            id: "NOT001",
            studentId: "ST001",
            teacherId: "T001",
            subjectId: "SUB001",
            type: "Homework",
            relatedId: "HW001",
            text: "New JavaScript homework has been assigned.",
            date: "2026-09-28",
            isRead: false
        },

        {
            id: "NOT002",
            studentId: "ST002",
            teacherId: "T001",
            subjectId: "SUB002",
            type: "Exam",
            relatedId: "EX002",
            text: "Laravel midterm exam has been scheduled.",
            date: "2026-09-29",
            isRead: false
        },

        {
            id: "NOT003",
            studentId: "ST003",
            teacherId: "T001",
            subjectId: "SUB001",
            type: "Homework",
            relatedId: "HW001",
            text: "Your JavaScript homework deadline is approaching.",
            date: "2026-09-30",
            isRead: true
        },

        {
            id: "NOT004",
            studentId: "ST007",
            teacherId: "T002",
            subjectId: "SUB003",
            type: "Material",
            relatedId: "MAT003",
            text: "New Web Design material has been uploaded.",
            date: "2026-09-30",
            isRead: false
        },

        {
            id: "NOT005",
            studentId: "ST010",
            teacherId: "T002",
            subjectId: "SUB004",
            type: "Exam",
            relatedId: "EX004",
            text: "Database exam has been scheduled.",
            date: "2026-09-30",
            isRead: false
        }

    ]

};


export { seedData };

