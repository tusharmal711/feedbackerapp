import { useEffect, useState } from "react";
import "./../../CSS/index.css";


const ApprovedStudent = () => {
  const [students, setStudents] = useState([]);

  // Fetch pending teachers
  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
       
       
         const res = await fetch(`http://localhost:3001/admin/approvedStudent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
 if (!res.ok) {
          throw new Error("Failed to fetch pending teachers");
        }
        const data = await res.json();
        setStudents(data.people|| []);
     
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchPendingStudents();
  }, []);




  return (
    <div className="teacher-table-container">
      <h2>Approved Student List</h2>
      {students.length === 0 ? (
        <p>No approved students found.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Department</th>
              <th>Sem</th>
              <th>Uni. Roll</th>

             
            </tr>
          </thead>
       <tbody>
  {students.map((student, index) => (
    <tr key={student._id}>
      <td>{index + 1}</td>
      <td>{student.studName}</td>
      <td>{student.emailId}</td>
      <td>{student.college}</td>
      <td>{student.deptName}</td>
      <td>{student.semester}</td>
        <td>{student.uniRoll}</td>
      
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default ApprovedStudent;
