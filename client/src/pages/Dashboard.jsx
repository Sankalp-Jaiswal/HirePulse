import { useState } from "react";
import Layout from "../components/Layout";
import JDInput from "../components/JDInput";
import ExcelUpload from "../components/ExcelUpload";

const Dashboard = () => {
  const [jd, setJD] = useState(`Job Title: Frontend Developer (React / Next.js)
Experience: 2–5 Years
Location: Remote / Hybrid / On-site
Employment Type: Full-time

Job Overview

We are seeking a Frontend Developer with strong expertise in React.js and Next.js to build fast, SEO-friendly, and user-centric web applications. The role involves close collaboration with UI/UX designers and backend engineers to deliver high-quality products.

Roles & Responsibilities

Develop responsive web applications using React.js and Next.js

Implement pixel-perfect UI from Figma/Adobe XD designs

Work with SSR, SSG, and ISR concepts in Next.js

Optimize frontend performance and accessibility

Integrate APIs and handle client-side state efficiently

Ensure cross-browser and mobile compatibility

Participate in code reviews and maintain coding standards

Technical Requirements

Strong knowledge of JavaScript (ES6+)

Hands-on experience with React.js & Next.js

Proficiency in HTML, CSS, Tailwind CSS

Experience with API integration

Familiarity with Git version control

Understanding of SEO basics and web performance

Preferred Skills

State management (Redux / Zustand / Context API)

Authentication tools (Clerk, Auth0, Firebase)

Experience with UI libraries (ShadCN, MUI)

Basic backend knowledge (Node.js, MongoDB)

Testing experience (Jest, Playwright)

Qualification

Bachelor’s degree in Computer Science or equivalent practical experience`);
  const [candidates, setCandidates] = useState([]);

  return (
    <Layout>
  <h2 className="text-2xl font-semibold mb-4 text-white">
    Job Description & Candidate Data
  </h2>

      <div className="space-y-6">
        <JDInput jd ={jd} setJD={setJD} />
        <ExcelUpload jd={jd} setCandidates={setCandidates} />
      </div>
    </Layout>
  );
};

export default Dashboard;
