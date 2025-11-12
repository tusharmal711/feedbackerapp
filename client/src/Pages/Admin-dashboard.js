import { FaChevronRight } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import{useState,useEffect} from "react";
import { useLocation ,useNavigate , Outlet} from "react-router-dom";
const AdminDashboard=()=>{


const location=useLocation();
const navigate=useNavigate();
const [viewSection,setViewSection]=useState(2);


const [showLogout,setShowLogout]=useState(false);
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3001/admin/logout", {
        method: "POST",
        credentials: "include", // important so cookie is sent/cleared
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Clear storage if you saved token or user info
        localStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminToken");

        console.log(data.message); // "Logout Successfully"
        // Redirect to login page
        navigate("/admin_login");
      } else {
        console.error("Logout failed:", data.message || "Unknown error");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

    return(
           <div className="admin-dashboard">


             {
              showLogout &&(
                   <div className="admin-logout-container">
              <div className="admin-logout-container-popup">
                   
                       <p>Are you sure to logout ?</p>
                     <div className="admin-logout-container-popup-btn">
                      <button onClick={()=>setShowLogout(false)}>Cancel</button>
                      <button onClick={handleLogout}>Logout</button>
                     </div>
                  
                    
              </div>
            </div>
              )
             }
           














              <div className="left-admin-container">

                 <div className="admin-profile">
                     <img src="/Images/image.png" alt="not-found" />
                     <div className="admin-profile-text">
                        <p>Name</p>
                        <p>Email</p>
                     </div>
                 </div>

                 <div className="admin-left-main">
  <li  className={viewSection === 2 ? "active-li-menu" : ""} 
  onClick={() => {
    setViewSection(2);
    navigate("approve_teacher");
  }}>
    Pending Teacher <FaChevronRight className="admin-left-arrow"/>
  </li>
  
  <li  className={viewSection === 3 ? "active-li-menu" : ""} 
  onClick={() => {
    setViewSection(3);
    navigate("approve_student");
  }}>
    Pending Student <FaChevronRight className="admin-left-arrow"/>
  </li>
  
  <li  className={viewSection === 4 ? "active-li-menu" : ""} 
  onClick={() => {
    setViewSection(4);
    navigate("approved_teacher");
  }}>
    Approved Teacher <FaChevronRight className="admin-left-arrow"/>
  </li>
  
  <li  className={viewSection === 5 ? "active-li-menu" : ""} 
  onClick={() => {
    setViewSection(5);
    navigate("approved_student");
  }}>
    Approved Student <FaChevronRight className="admin-left-arrow"/>
  </li>
</div>

                 <div className="admin-logout" onClick={()=>setShowLogout(true)}>
                    <LuLogOut />Logout
                 </div>

                  
              </div>












              <div className="right-admin-container">
                 
                     
                 <Outlet />

              </div>















           </div>
    )
}
export default AdminDashboard;