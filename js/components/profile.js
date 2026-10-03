import {getCurrentTeacher} from "../data.js"

export function showProfile(app) {
const teacher = getCurrentTeacher();
const splitedName= teacher.fullName.split(' ');
const firstName= splitedName[0] ;
const secondName= splitedName[1] ;

    app.innerHTML = `
        <section class="profile-page">

            <div class="profile-header">
                <div class="profile-avatar">
                    ${
                        firstName[0]}
                        ${secondName[0]}
                        
                    
                </div>

                <div class="profile-title">
                    <h1>${teacher.fullName}</h1>
                    <p>Curriculum Lead</p>
                </div>

                <button class="edit-profile-btn">
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
                            <strong>Sarah Jenkins</strong>
                        </div>

                        <div class="profile-field">
                            <span>Email Address</span>
                            <strong>sarah.jenkins@evolvia.com</strong>
                        </div>

                        <div class="profile-field">
                            <span>Phone Number</span>
                            <strong>+962 7 9000 0000</strong>
                        </div>

                        <div class="profile-field">
                            <span>Role</span>
                            <strong>Curriculum Lead</strong>
                        </div>

                        <div class="profile-field">
                            <span>Department</span>
                            <strong>Academic Affairs</strong>
                        </div>

                        <div class="profile-field">
                            <span>Joined</span>
                            <strong>September 2025</strong>
                        </div>

                    </div>

                </div>


                <div class="profile-card">

                    <div class="card-header">
                        <h2>Account Information</h2>
                        <p>Information about your EVOLVIA account</p>
                    </div>

                    <div class="account-info">

                        <div class="account-row">
                            <span>Account Status</span>
                            <span class="status-active">Active</span>
                        </div>

                        <div class="account-row">
                            <span>Account Type</span>
                            <strong>Instructor</strong>
                        </div>

                        <div class="account-row">
                            <span>Last Login</span>
                            <strong>Today, 10:42 AM</strong>
                        </div>

                    </div>

                </div>

            </div>

        </section>
    `;
}



