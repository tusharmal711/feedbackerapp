import { useEffect, useState } from "react";
import "./../../CSS/index.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL; 

const ApproveTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  // Fetch pending teachers
  useEffect(() => {
    const fetchPendingTeachers = async () => {
      try {
       
       
         const res = await fetch(`${backendUrl}admin/approvedTeacher`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
 if (!res.ok) {
          throw new Error("Failed to fetch pending teachers");
        }
        const data = await res.json();
        setTeachers(data.people|| []);
        console.log(teachers);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchPendingTeachers();
  }, []);

  
  return (
    <div className="teacher-table-container">
      <h2>Approved Teacher List</h2>
      {teachers.length === 0 ? (
        <p>No approved teachers found.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Department</th>
              
            </tr>
          </thead>
       <tbody>
  {teachers.map((teacher, index) => (
    <tr key={teacher._id}>
      <td>{index + 1}</td>
      <td>{teacher.teacherName}</td>
      <td>{teacher.emailId}</td>
      <td>{teacher.college}</td>
      <td>{teacher.deptName}</td>
      
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default ApproveTeacher;
