Job Board with Automated Email System
A fully functional Job Board Application that connects recruiters and job seekers. The platform includes features like job postings, automated email notifications, user authentication, and job applications.

🚀 Features
User Features:
User Authentication:

Register as a recruiter or student.
Secure login with role-based access.
JWT-based authentication.
Email verification for recruiters.
Profile Management:

Update profile details, including bio and skills.
Role-specific actions.
Job Search and Application:

Search jobs using keywords.
Apply to jobs (students).
View applied jobs.
Job Notifications:

Automated newsletters sent to students about new job opportunities using node-cron.
Admin/Recruiter Features:
Job Management:

Create and manage job postings.
Track applicants for each job.
Company Management:

Register and update company information.
Manage jobs under the registered company.
View Applications:

Monitor applications received for job postings.
Automated Newsletter System:
A cron job runs periodically to:
Identify jobs with newsletters pending.
Send emails to all students with details of the job.
Mark jobs as "newsletters sent" to avoid duplicate emails.
🛠️ Tech Stack
Frontend:
React with Vite.
Redux for state management.
CSS Modules for styling.
Backend:
Node.js with Express.
MongoDB with Mongoose ORM.
Utilities:
JWT for authentication.
BcryptJS for password encryption.
Node-Cron for automated tasks.
Cloudinary for managing file uploads.
Nodemailer for email notifications.
📂 Folder Structure

/models        - Mongoose models for User, Job, Company, Application.
/controllers   - Handles core backend logic for users, jobs, companies, and applications.
/utils         - Utility functions like email sending and file handling.
/routes        - Express routes for different API endpoints.
/public        - Static assets.
/client        - Frontend application (React).
🚀 How to Run the Project Locally
Prerequisites:
Node.js (v14 or above)
MongoDB installed locally or a MongoDB Atlas account
Environment variables for secrets
Setup:
Clone the repository:


git clone https://github.com/your-repo/job-board.git
cd job-board
Install dependencies:


npm install
Set up environment variables: Create a .env file in the root directory and add:


PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
Run MongoDB locally or connect to MongoDB Atlas.

Start the backend server:


npm run dev
Navigate to the /client folder to set up and run the frontend:


cd client
npm install
npm run dev
📧 Testing Email Notifications
Ensure email credentials are correctly configured in .env.
Start the server and let the cron job handle automated newsletters.
You can monitor email logs for successful newsletter delivery.
🧪 Testing API Endpoints
Use Postman or cURL to test the API endpoints.
Common endpoints:
POST /api/auth/register - Register a new user.
POST /api/auth/login - Login user.
POST /api/jobs - Create a new job (Admin only).
GET /api/jobs - Get all jobs.
🤝 Contributions
Feel free to fork the repository and submit pull requests. Contributions are welcome!

📄 License
This project is licensed under the MIT License.

