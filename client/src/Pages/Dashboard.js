import { MdAddComment } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
const Dashboard=()=>{
    // add new input field is starting from here
     const [fields, setFields] = useState([]);
     const [createNew,setCreateNew]=useState(false);
  const handleAddField = () => {
    setFields([...fields, ""]);
  };

  const handleInputChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const Anibar = ()=>{
    const sidebar=document.querySelector(".side-bar");
    const topbar=document.querySelector(".top-bar");
    const topbarlogo=document.querySelector(".top-web-logo");
    const middle=document.querySelector(".middle-dashboard");
     const toparrow=document.querySelector(".top-r-arrow");
    sidebar.classList.add("display-none");
    topbar.classList.add("increase-width");
    topbarlogo.classList.add("display-block");
    middle.classList.add("increase-width");
    toparrow.classList.add("display-block-logo");
  }

const RemoveAnibar=()=>{
     const sidebar=document.querySelector(".side-bar");
    const topbar=document.querySelector(".top-bar");
      const toparrow=document.querySelector(".top-r-arrow");
    const topbarlogo=document.querySelector(".top-web-logo");
    const middle=document.querySelector(".middle-dashboard");
    sidebar.classList.remove("display-none");
    topbar.classList.remove("increase-width");
    topbarlogo.classList.remove("display-block");
    middle.classList.remove("increase-width");
     toparrow.classList.remove("display-block-logo");
}


//   add new input field is ending here
    return(
          <div>
              <div className="dashboard-container">
                   <div className="top-bar">
                    <FaChevronRight className="top-r-arrow" onClick={RemoveAnibar}/>
                         <div className="top-web-logo" id="topbar-logo">
                           <img src="./Images/FeedBacker-logo.png" />
                           <span className="dash-web-logo-name">FeedBacker</span>
                        </div>
                        <IoNotifications className="noti-icon"/>
                        <img src="./Images/profile-image.png" className="profile-img"/>
                   </div>
                   <div className="side-bar">
                    <div className="dash-web-logo">
                           <img src="./Images/FeedBacker-logo.png" />
                           <span className="dash-web-logo-name">FeedBacker</span>
                        </div>

                        <FaChevronLeft className="sidebar-right-arrow" onClick={Anibar}/>


                        <div className="feedback-nav">
                           <div className="side-bar-one one">
                          <MdAddComment className="feedback-nav-icon"/><p>Create feedback form</p><FaChevronRight className="right-nav-arrow"/>
                      </div>
                      <div className="side-bar-one two">
                          <FaMoneyCheck className="feedback-nav-icon"/><p>View feedback result</p><FaChevronRight  className="right-nav-arrow"/>
                      </div>
                        </div>
                      
                   </div>


                      




                      <div className="middle-dashboard">
                       
                        <div className="middle-content">
                            {
                                !createNew &&(
                                       <button type="button" className="create-new" onClick={()=>setCreateNew(true)}><FaPlus />Create new</button>
                                )
                            }
                            
                            {/* <div className="no-form">
                            <p>No form created</p>
                            </div> */}




                          {/* new form creating is starting from here */}
                          {
                            createNew &&(
                                <div className="form-created">


                            <div className="form-text-field">
                                <div> 
                          <label for="sem">Semester</label>
                               </div>
                                      <select id="sem" name="join" required>
                                      <option value="">Select semester</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                       <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="8">8</option>
                       
                                    </select>
                            </div>
                             <div className="form-text-field">
                                <div> 
                               <label for="section">Section</label>
                               </div>
                                      <select id="section" name="join" required>
                                      <option value="">Select section</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                       <option value="4">4</option>
                                     
                                    </select>
                            </div>



                            {fields.map((field, index) => (
        <div className="form-text-field" key={index}>
             <div> <label for="section">{`Question ${index + 1}`}</label>
            </div>
          <input
            type="text"
           
            value={field}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      ))}



                               <div className="form-text-field">
                    <button
          type="button"
          className="add-field"
          onClick={handleAddField}
        >
          <FaPlus /> Add field
        </button>
      </div>


      <div className="form-text-field-button">
        <button type="button" className="form-cancel" onClick={()=>{setCreateNew(false); setFields([]);}}>Cancel</button>
        <button className="form-post">Post</button>
        </div>
                            



                        
                          </div>
                            )
                          }
                       
                          {/* new form creating is ending here */}












                        </div>
                        

                      </div>


                     













              </div>
          </div>
    )
}
export default Dashboard;