import { useEffect, useState } from "react";
import "./../../CSS/index.css";


const ApproveStudent = () => {
  const [students, setStudents] = useState([]);

  // Fetch pending teachers
  useEffect(() => {
    const fetchPendingStudents = async () => {
      try {
       
       
         const res = await fetch(`http://localhost:3001/admin/pendingStudent`, {
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
     const interval = setInterval(fetchPendingStudents, 1000); // fetch every 5s
  return () => clearInterval(interval); 
  }, []);

  // Handle approve teacher
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/approveStudent/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve teacher");
      }

      // Remove teacher from UI after approval
      setStudents((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };


const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/rejectStudent/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve teacher");
      }

      // Remove teacher from UI after approval
      setStudents((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };














  return (
    <div className="teacher-table-container">
      <h2>Pending Student List</h2>
      {students.length === 0 ? (
        <p>No pending students found.</p>
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

              <th>Action</th>
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
      <td className="td-btn">
        <button
          className="approve-btn"
          onClick={() => handleApprove(student._id)}
        >
          Approve
        </button>

         <button
          className="reject-btn"
          onClick={() => handleReject(student._id)}
        >
          Reject
        </button>



      </td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
};

export default ApproveStudent;
