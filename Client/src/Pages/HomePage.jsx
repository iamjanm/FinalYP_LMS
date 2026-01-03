import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen, Users, Award, ArrowRight, Sparkles, GraduationCap, TrendingUp } from "lucide-react";

import homeimg from '../Assets/Images/homePageMainImage.png'
import HomeLayout from "../Layouts/HomeLayout";

function HomePage() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { icon: BookOpen, value: "10,000+", label: "Courses" },
        { icon: Users, value: "50,000+", label: "Students" },
        { icon: Award, value: "500+", label: "Instructors" }
    ];

    const features = [
        "Industry-Leading Curriculum",
        "Lifetime Access & Support",
        "Certified By Experts"
    ];

    return (
        <HomeLayout>

            <div className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative pt-10 text-white flex flex-col md:flex-row items-center justify-center mx-5 gap-10 lg:mx-16 min-h-[90vh]">
                    {/* Content Section */}
                    <div className={`mt-16 sm:mt-0 flex flex-col justify-center md:w-1/2 space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 w-fit">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-300">Transform Your Future Today</span>
                        </div>

                        {/* Main Heading with Gradient */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                            Find out best{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                                    Online Courses
                                </span>
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                            We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
                        </p>

                        {/* Rotating Features */}
                        <div className="flex items-center gap-3 text-yellow-400 font-medium">
                            <GraduationCap className="w-6 h-6" />
                            <span className="transition-all duration-500">
                                {features[activeIndex]}
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/courses" className="group">
                                <button className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 rounded-xl font-semibold text-lg cursor-pointer hover:shadow-2xl hover:shadow-yellow-500/50 transition-all ease-in-out duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                    Explore courses
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>

                            <Link to="/contact">
                                <button className="w-full sm:w-auto border-2 border-yellow-500 bg-yellow-500/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold text-lg cursor-pointer hover:bg-yellow-500 hover:shadow-xl transition-all ease-in-out duration-300 transform hover:scale-105">
                                    Contact Us
                                </button>
                            </Link>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-700/50">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-start gap-2 transition-all duration-300 hover:transform hover:scale-110"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.2}s backwards`
                                    }}
                                >
                                    <stat.icon className="w-6 h-6 text-yellow-400" />
                                    <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className={`lg:w-1/2 flex items-center justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>

                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-3xl border border-yellow-500/20 backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
                                <img
                                    src={homeimg}
                                    alt="homepage image"
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-500 rounded-full p-2">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold">Start Learning Today</div>
                                            <div className="text-xs text-gray-300">Join thousands of students</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </HomeLayout>

    )
}
export default HomePage;