import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Font from "./Pages/Font";
import StuLog from "./Pages/Student-Login";
import Dashboard from "./Pages/Dashboard";
import StuReg from "./Pages/Student-Register";
import TeaReg from "./Pages/Teacher-Register";
import TeacherLog from "./Pages/Teacher-Login";
import AdminLog from "./Pages/Admin-Login";
import AdminDashboard from "./Pages/Admin-dashboard";
import TeacherDashboard from "./Pages/Teacher-dashboard";
import ApprovedStudent from "./Pages/Admin-page/Approved-student";
import ApprovedTeacher from "./Pages/Admin-page/Approved-teacher";
import ApproveStudent from "./Pages/Admin-page/Approve-student";
import ApproveTeacher from "./Pages/Admin-page/Approve-teacher";
import CreateForm from "./Pages/Teacher-page/Form";
import TeacherProfile from "./Pages/Teacher-page/TeacherProfile";
import PublicRoute from "./PublicRoute"; // 👈 Import it
import Cookies from "js-cookie";
import StudentDashboard from "./Pages/Student-dashboard";
import ViewFrom from "./Pages/Teacher-page/View-form";
import EditForm from "./Pages/Teacher-page/EditForm";
import AvailableForms from "./Pages/Student-page/AvailableForms";
import FillFeedbackForm from "./Pages/Student-page/FillFeedbackForm";
import ViewResponses from "./Pages/Teacher-page/ViewResponses";
import StudentProfile from "./Pages/Student-page/StudentProfile";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={
              <PublicRoute>
            <Font />
             </PublicRoute>
            } />
          <Route exact path="/student_login" element={<StuLog />} />
          <Route exact path="/student_registration" element={<StuReg />} />
          <Route exact path="/teacher_registration" element={<TeaReg />} />

          {/* 👇 Wrap Teacher Login in PublicRoute */}
          <Route
            exact
            path="/teacher_login"
            element={
            
                <TeacherLog />
             
            }
          />

          <Route exact path="/admin_login" element={<AdminLog />} />
          <Route exact path="/dashboard" element={<Dashboard />} />

               <Route exact path="/teacher_dashboard" element={<TeacherDashboard />}>
            <Route exact path="create_form" element={<CreateForm />} />
             <Route exact path="view_form" element={<ViewFrom/>} />
            <Route exact path="teacher_profile" element={<TeacherProfile />} />
             <Route path="responses/:formId" element={<ViewResponses />} />
              <Route path="edit/:id" element={<EditForm />} />
          </Route>
            
            

          <Route exact path="/student_dashboard" element={<StudentDashboard />}>
            <Route exact path="student_form" element={<AvailableForms />} />
            <Route exact path="student_profile" element={<StudentProfile />} />
           
          </Route>
            
            <Route path="/student/fill_form/:formId" element={<FillFeedbackForm />} />


          <Route exact path="/admin_dashboard" element={<AdminDashboard />}>
            <Route index element={<Navigate to="approve_teacher" replace />} />
            <Route exact path="approve_teacher" element={<ApproveTeacher />} />
            <Route exact path="approve_student" element={<ApproveStudent />} />
            <Route exact path="approved_teacher" element={<ApprovedTeacher />} />
            <Route exact path="approved_student" element={<ApprovedStudent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
