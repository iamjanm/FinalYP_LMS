import { useEffect } from 'react';
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs';
import { FaUsers } from "react-icons/fa";
import { TiEdit } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourse } from '../../Redux/Slices/CourseSlice';
import { getStatsData, getAllUsers } from '../../Redux/Slices/StatSlice';

function AdminDeshboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount, allUsers } = useSelector((state) => state.stat);
    console.log("allUsers dtaa", allUsersCount);


    const myCoures = useSelector((state) => state?.course?.courseData);

    async function onCourseDelete(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            }
        });

        if (result.isConfirmed) {
            const res = await dispatch(deleteCourse(id));
            if (res?.payload?.success) {
                await dispatch(getAllCourse())
            }
        }
    }

    useEffect(() => {
        (
            async () => {
                await dispatch(getAllCourse());
                await dispatch(getStatsData());
                await dispatch(getAllUsers());
            }
        )()

    }, [])

    return (
        <>
            <style>{`
                .swal-confirm-btn {
                    background-color: #d33 !important;
                    border: none !important;
                    color: white !important;
                }
                .swal-confirm-btn:hover {
                    background-color: #d33 !important;
                }
                .swal-cancel-btn {
                    background-color: #3085d6 !important;
                    border: none !important;
                    color: white !important;
                }
                .swal-cancel-btn:hover {
                    background-color: #3085d6 !important;
                }
            `}</style>
            <HomeLayout>
                <div className="min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-white">
                    <h1 className="text-center  text-3xl sm:text-5xl font-semibold text-yellow-500">
                        Admin Dashboard
                    </h1>

                    <div className="grid md:grid-cols-1 gap-5 m-auto md:mx-10">
                        <div className="flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                            <div className="grid grid-cols-1 gap-5">
                                <div className="flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                    <div className="flex flex-col items-center">
                                        <p className="font-semibold">Registered Users</p>
                                        <h3 className="text-4xl font-bold">{allUsersCount}</h3>
                                    </div>
                                    <FaUsers className="text-yellow-500 text-5xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=" lg:mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                        {/* <h1 className="text-center text-2xl sm:text-3xl font-semibold">
                            Registered Users
                        </h1>

                        <div className="overflow-x-auto w-full">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>S No</th>
                                        <th>Profile Name</th>
                                        <th>Profile Pic</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers?.map((user, idx) => {
                                        return (
                                            <tr key={user._id}>
                                                <td>{idx + 1}</td>
                                                <td>{user?.fullName}</td>
                                                <td>
                                                    {user?.avatar?.secure_url ? (
                                                        <img src={user.avatar.secure_url} alt="Profile" className="w-10 h-10 rounded-full" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">N/A</div>
                                                    )}
                                                </td>
                                                <td>{user?.email}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div> */}
                    </div>

                    <div className=" lg:mx-[10%] w-[80%] self-center flex flex-col items-center justify-center gap-10 mb-10">
                        <div className="flex w-full items-center justify-between">
                            <h1 className="text-center  text-2xl sm:text-3xl font-semibold">
                                Courses overview
                            </h1>
                            <button
                                onClick={() => {
                                    navigate("/course/create");
                                }}
                                className="w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-2 sm:px-4 font-semibold sm:text-lg cursor-pointer"
                            >
                                Create new course
                            </button>
                        </div>
{
    myCoures?.length === 0 ? (
        <h2 className="text-center text-xl font-semibold">No courses available. Please create a new course.</h2>
    ) : (
        <div className="overflow-x-auto w-full">
            <table className="table">
                <thead>
                    <tr>
                        <th>S No</th>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        <th>Course Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {myCoures?.map((course, idx) => {
                        return (
                            <tr key={course._id}>
                                <td>{idx + 1}</td>
                                <td>{course?.title}</td>
                                <td>{course?.description}</td>
                                <td>{course?.duration}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

                    </div>

                </div>
            </HomeLayout>
        </>
    )
}
export default AdminDeshboard;