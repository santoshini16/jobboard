import cron from "node-cron";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running News Letter Cron Automation");

    
    const jobs = await Job.find({ newsLettersSent: false }).populate('company', 'name');

    for (const job of jobs) {
      try {
     
        const students = await User.find({ role: "student" });
        
        for (const student of students) {
          const subject = `Hot Job Alert: ${job.title} Available Now`;
          const message = `
Hi ${student.fullname},

Great news! A new job opportunity has just been posted that matches your profile. Here are the details:

**Position**: ${job.title}  
**Company**: ${job.company?.name || "N/A"}  
**Location**: ${job.location}  
**Salary**: ${job.salary.toLocaleString()}LPA 
**Experience Level**: ${job.experienceLevel}  
**Job Type**: ${job.jobType}  

**Job Description**:  
${job.description}

**Requirements**:  
${job.requirements.length > 0 ? job.requirements.map((req) => `- ${req}`).join("\n") : "No specific requirements mentioned."}

If you're interested, apply now and don't miss this opportunity!  

Best of luck,  
**The JobHunt Team**
          `;

          await sendEmail({
            email: student.email,
            subject,
            message,
          });
        }

        // Mark the job as having its newsletters sent
        job.newsLettersSent = true;
        await job.save();

        console.log(`Newsletter sent for job: ${job.title}`);
      } catch (error) {
        console.error(
          `Error while sending newsletters for job: ${job.title}`,
          error
        );
      }
    }
  });
};



