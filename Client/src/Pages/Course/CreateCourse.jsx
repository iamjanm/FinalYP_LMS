import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, BookOpen, User, Tag, FileText } from "lucide-react";
import HomeLayout from "../../Layouts/HomeLayout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";

function CreateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        title: "",
        category: "",
        createdBy: "",
        description: "",
        thumbnail: null,
        previewImage: ""
    });

    const [isDragging, setIsDragging] = useState(false);

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                });
            });
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: file
                });
            });
        }
    }

    function handleUserInput(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    async function OnFormSubmit(e) {
        e.preventDefault();
        if (!userInput.title || !userInput.description || !userInput.category || !userInput.thumbnail || !userInput.createdBy) {
            alert("All fields are mandatory");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));
        if (response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                createdBy: "",
                description: "",
                thumbnail: null,
                previewImage: ""
            });
            navigate("/courses");
        }
    }

    return (
        <HomeLayout>
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1D232A' }}>
                <div className="relative w-full max-w-4xl backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8 space-y-6" style={{ backgroundColor: '#1D232A' }}>
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="absolute -left-3 top-8 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-cyan-400 shadow-lg transition-all duration-300 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    </button>

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-white">
                            Create New Course
                        </h1>
                    </div>

                    {/* Main Grid */}
                    <main className="grid lg:grid-cols-2 gap-6 mt-6">
                        {/* Left Column */}
                        <div className="space-y-5">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className="relative group"
                                >
                                    <label htmlFor="image_uploads" className="cursor-pointer block">
                                        {userInput.previewImage ? (
                                            <div className="relative overflow-hidden rounded-lg border-2 border-slate-600 shadow-lg">
                                                <img
                                                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    src={userInput.previewImage}
                                                    alt="Preview"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                                    <span className="text-white font-medium text-sm">Click to change</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`w-full h-56 rounded-lg border-2 ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 bg-slate-700/30'} flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-slate-500 hover:bg-slate-700/40 group`}>
                                                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="w-7 h-7 text-slate-300" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-white text-base">Upload your course thumbnail</p>
                                                </div>
                                            </div>
                                        )}
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
                            </div>

                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-white block" htmlFor="title">
                                    Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="w-full bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Instructor Input */}
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-white block" htmlFor="createdBy">
                                    Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="w-full bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>

                            {/* Category Input */}
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-white block" htmlFor="category">
                                    Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="w-full bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>

                            {/* Description Textarea */}
                            <div className="space-y-2">
                                <label className="text-base font-semibold text-white block" htmlFor="description">
                                    Course description
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="w-full bg-slate-700/50 px-4 py-3 h-32 rounded-lg border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 resize-none transition-all duration-300"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    {/* Submit Button */}
                    <button
                        onClick={OnFormSubmit}
                        className="w-full text-white text-lg font-semibold py-3.5 rounded-lg shadow-lg transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                        style={{ backgroundColor: '#FBBF24' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#F59E0B'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#FBBF24'}
                    >
                        Create Course
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CreateCourse;