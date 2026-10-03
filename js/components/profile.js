import { getCurrentTeacher, updateTeacher } from "../data.js";

export function showProfile(app) {

    const teacher = getCurrentTeacher();

    const splitedName = teacher.fullName.split(" ");
    const firstName = splitedName[0] || "";
    const lastName = splitedName[1] || "";

    app.innerHTML = `
        <section class="profile-page">

            <div class="profile-header">

                <div class="profile-avatar">
                    ${firstName[0] || ""}
                    ${lastName[0] || ""}
                </div>

                <div class="profile-title">
                    <h1>${teacher.fullName}</h1>
                    <p>Teacher</p>
                </div>

                <button class="edit-profile-btn" id="editProfileBtn">
                    Edit Profile
                </button>

            </div>


            <div class="profile-content">

                <div class="profile-card">

                    <div class="card-header">
                        <h2>Personal Information</h2>
                        <p>Your personal account information</p>
                    </div>


                    <div class="profile-grid">

                        <div class="profile-field">
                            <span>Full Name</span>
                            <strong>${teacher.fullName}</strong>
                        </div>


                        <div class="profile-field">
                            <span>Email Address</span>
                            <strong>${teacher.email}</strong>
                        </div>


                        <div class="profile-field">
                            <span>Phone Number</span>
                            <strong>${teacher.phone}</strong>
                        </div>


                        <div class="profile-field">
                            <span>Role</span>
                            <strong>Teacher</strong>
                        </div>


                        <div class="profile-field">
                            <span>Department</span>
                            <strong>Academic Affairs</strong>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    `;


    const editProfileBtn = document.getElementById("editProfileBtn");

    editProfileBtn.addEventListener("click", () => {

        app.innerHTML = `
            <section class="profile-page">

                <div class="profile-header">

                    <div class="profile-avatar">
                        ${firstName[0] || ""}
                        ${lastName[0] || ""}
                    </div>

                    <div class="profile-title">
                        <h1>Edit Profile</h1>
                        <p>Update your personal information</p>
                    </div>

                </div>


                <div class="profile-content">

                    <div class="profile-card">

                        <div class="card-header">
                            <h2>Personal Information</h2>
                            <p>Update your account information</p>
                        </div>


                        <div class="profile-grid">

                            <div class="profile-field">
                                <span>Full Name</span>

                                <input
                                    type="text"
                                    id="fullNameInput"
                                    value="${teacher.fullName}"
                                >
                            </div>


                            <div class="profile-field">
                                <span>Email Address</span>

                                <input
                                    type="email"
                                    id="emailInput"
                                    value="${teacher.email}"
                                >
                            </div>


                            <div class="profile-field">
                                <span>Phone Number</span>

                                <input
                                    type="text"
                                    id="phoneInput"
                                    value="${teacher.phone}"
                                >
                            </div>


                            <div class="profile-field">
                                <span>Role</span>

                                <strong>
                                    Teacher
                                </strong>
                            </div>


                            <div class="profile-field">
                                <span>Department</span>

                                <strong>
                                    Academic Affairs
                                </strong>
                            </div>

                        </div>


                        <div class="profile-actions">

                            <button
                                class="save-profile-btn"
                                id="saveProfileBtn"
                            >
                                Save Changes
                            </button>


                            <button
                                class="cancel-profile-btn"
                                id="cancelProfileBtn"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            </section>
        `;


        const saveProfileBtn =
            document.getElementById("saveProfileBtn");


        const cancelProfileBtn =
            document.getElementById("cancelProfileBtn");


        saveProfileBtn.addEventListener("click", () => {

            const updatedTeacher = {
                ...teacher,

                fullName:
                    document.getElementById("fullNameInput").value.trim(),

                email:
                    document.getElementById("emailInput").value.trim(),

                phone:
                    document.getElementById("phoneInput").value.trim()
            };


            if (
                !updatedTeacher.fullName ||
                !updatedTeacher.email ||
                !updatedTeacher.phone
            ) {
                alert("Please fill in all fields.");
                return;
            }


            updateTeacher(updatedTeacher);

            showProfile(app);

        });


        cancelProfileBtn.addEventListener("click", () => {

            showProfile(app);

        });

    });

}