import { useState } from "react";
import {useNavigate} from "react-router-dom";
import { RxCross1 } from "react-icons/rx";

const Font=()=>{
    const navigate=useNavigate();
    const [joinoption,setJoinoption]=useState(false);
    const [role,setRole]=useState("");
    const RoleSubmit=()=>{
        
        if(role==="teacher"){
          navigate("/teacher_registration");
        }else if(role==="student"){
          navigate("/student_registration");
        }else if(role==="admin"){
          navigate("/admin_login");
        }
    }
    return(
        <div className="font-container">
                  

              {
                joinoption &&(
                         <div className="join-with-us">
                          
                    <div className="join-us">
                       <RxCross1 className="join-us-cross" onClick={()=>setJoinoption(false)}/>
                     <select id="join" name="join" onChange={(e)=>setRole(e.target.value)} required>
                       <option value="">Join as </option>
                       <option value="student">Student</option>
                       <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                       
                     </select>

                     <button onClick={RoleSubmit}>Join</button>
                    </div>
                  </div>

                )
              }
                 







            <div className="font-main">
                <div className="font-image">
                   <img src="./Images/font-image.png" />
                </div>
                <div className="font-text">
                    <img src="./Images/FeedBacker-logo.png" />
                     <h3 class="animate-charcter">Welcome to <br />Feedbacker</h3>
                    <div className="font-p">
                     <p>Empowering quality education through meaningful feedback</p>
                    <p>and Bridging the gap between teaching and learning.</p>
                    </div>
                      
                     <button onClick={()=>setJoinoption(true)}>Join With Us</button>
                </div>

            </div>

        </div>
    )
}
export default Font;