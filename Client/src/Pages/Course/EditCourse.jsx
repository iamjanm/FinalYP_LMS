import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { updateCourse, getCourseById } from "../../Redux/Slices/CourseSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

  function EditCourse(){

    const dispatch =useDispatch();
    const navigate =useNavigate();
    const {state }=useLocation();
    const { id } = useParams();
    const initialCourse = useRef(state || {});
   const [userInput, setUserInput] = useState({
  _id: state?._id || id || "",
  title: state?.title || "",
  category: state?.category || "",
  description: state?.description || "",
  createdBy: state?.createdBy || "",
  thumbnail: null,
  previewImage: state?.thumbnail?.secure_url || "",
});

console.log("updateCourse",updateCourse);

     function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage=e.target.files[0];
        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function(){
                setUserInput({
                    ...userInput,
                    previewImage:this.result,
                    thumbnail:uploadedImage
                })
            })
        }
    }
    
    function handleUserInput(e){
        e.preventDefault();
        const {name,value}=e.target;
       setUserInput({
            ...userInput,
            [name]:value
       })
    }

    async function OnFormSubmit(e){
        e.preventDefault();
        if(!userInput._id){
            toast.error("Course id is missing. Open Edit from the course list or reload the course.");
            return;
        }
        if(!userInput.title || !userInput.description || !userInput.category ){
            toast.error("All fields are mandatory");
            return;
        }

        // build payload with only changed fields
        const payload = { _id: userInput._id };
        ["title","category","description","createdBy"].forEach(field=>{
            if (userInput[field] !== initialCourse.current?.[field]) {
                payload[field] = userInput[field];
            }
        });
        if (userInput.thumbnail) {
            payload.thumbnail = userInput.thumbnail;
        }

        if(Object.keys(payload).length === 1){
            toast("No changes detected");
            return;
        }

        const response = await dispatch(updateCourse(payload));
        if(response?.payload?.success){
            // if server returned updated course, update local state
            const updatedCourse = response.payload.course;
            if (updatedCourse) {
                setUserInput({
                    _id: updatedCourse._id || userInput._id,
                    title: updatedCourse.title || userInput.title,
                    category: updatedCourse.category || userInput.category,
                    description: updatedCourse.description || userInput.description,
                    createdBy: updatedCourse.createdBy || userInput.createdBy,
                    thumbnail: null,
                    previewImage: updatedCourse.thumbnail?.secure_url || userInput.previewImage || "",
                });
                initialCourse.current = { ...initialCourse.current, ...payload, thumbnail: updatedCourse.thumbnail || initialCourse.current.thumbnail };
            } else {
                // fallback: update only changed fields in the form state
                setUserInput(prev => ({...prev, ...payload, thumbnail: null}));
            }
            navigate("/courses");
        }
        console.log("response",response);
    }

    // If component opened directly with an :id param, fetch the course to populate the form
    useEffect(() => {
        async function loadCourse() {
            if (!initialCourse.current || Object.keys(initialCourse.current).length === 0) {
                if (id) {
                    const result = await dispatch(getCourseById(id));
                    if (result && result.payload) {
                        const course = result.payload;
                        if (course) {
                            setUserInput({
                                _id: course._id || id,
                                title: course.title || "",
                                category: course.category || "",
                                description: course.description || "",
                                createdBy: course.createdBy || "",
                                thumbnail: null,
                                previewImage: course.thumbnail?.secure_url || "",
                            });
                            initialCourse.current = course;
                            return;
                        }
                    }
                    toast.error("Failed to load course. Please try again.");
                    navigate('/courses');
                }
            }
        }
        loadCourse();
    }, [id, dispatch, navigate]);

    // If opened without id/state, redirect to courses list
    useEffect(() => {
        if (!userInput._id && !id && (!state || Object.keys(state).length === 0)) {
            toast.error("No course selected for editing");
            navigate('/courses');
        }
    }, [userInput._id, id, state, navigate]);
    
    console.log("userInput",userInput);
    
    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form 
                    onSubmit={OnFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 mt-5 text-white w-[80vw] md:w-[700px] sm:my-10   relative shadow-[0_0_10px_black]  "
                >
                    <div>
                        <Link to={"/admin/deshboard"} className=" absolute left-2  text-lg text-accent cursor-pointer">
                            <AiOutlineArrowLeft/>
                        </Link>
                    </div>
            
                    <h1 className=" text-center text-2xl font-bold">
                        Edit Course
                    </h1>

                    <main className=" grid lg:grid-cols-2 grid-cols-1 gap-x-10">
                        <div>
                            <div>
                                <label htmlFor="image_uploads" className="  cursor-pointer">
                                        {userInput.previewImage ? (
                                            <img 
                                                className=" w-full h-44 m-auto border"
                                                src={userInput.previewImage}
                                            />
                                        ):(
                                            <div className=" w-full h-44 m-auto flex items-center justify-center border">
                                                <h1 className=" font-bold text-lg">  Upload your course thumbnail</h1>
                                            </div>
                                        ) }
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={handleImageUpload}
                                />
                            </div>
                                   
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="title">
                                            Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>   
                        </div >

                        <div className="flex flex-col gap-1">
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="createdBy">
                                        Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>  
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="category">
                                        Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>      
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="description">
                                        Course description
                                </label>
                                <textarea
                                    required
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1  h-24 overflow-scroll resize-none border"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>        
                        </div>
                    </main>

                    <button type="submit" className="w-full bg-yellow-600 text-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out py-2 rounded-sm font-semibold">
                        Update Course
                    </button>

                </form>
            </div>
        </HomeLayout>  
    )
}
export default EditCourse;