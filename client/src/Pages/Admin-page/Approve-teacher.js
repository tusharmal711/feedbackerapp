import { useEffect, useState } from "react";
import "./../../CSS/index.css";


const ApproveTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  // Fetch pending teachers
  useEffect(() => {
    const fetchPendingTeachers = async () => {
      try {
       
       
         const res = await fetch(`http://localhost:3001/admin/pendingTeacher`, {
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
     const interval = setInterval(fetchPendingTeachers, 1000); // fetch every 1s
  return () => clearInterval(interval); 
  }, []);

  // Handle approve teacher
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/approveTeacher/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve teacher");
      }

      // Remove teacher from UI after approval
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };




  // Handle approve teacher
  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/admin/rejectTeacher/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to approve teacher");
      }

      // Remove teacher from UI after approval
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };












  return (
    <div className="teacher-table-container">
      <h2>Pending Teacher List</h2>
      {teachers.length === 0 ? (
        <p>No pending teachers found.</p>
      ) : (
        <table className="teacher-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Department</th>
              <th>Action</th>
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
      <td className="td-btn1">
        <button
          className="approve-btn"
          onClick={() => handleApprove(teacher._id)}
        >
          Approve
        </button>


          <button
          className="reject-btn"
          onClick={() => handleReject(teacher._id)}
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

export default ApproveTeacher;
