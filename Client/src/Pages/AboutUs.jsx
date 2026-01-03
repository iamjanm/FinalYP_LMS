import { useState, useEffect } from 'react';
import CarouselSlide from "../Compontents/CarouselSlide";
import aboutMainImage from "../Assets/Images/aboutMainImage.png";
import { celebrities } from "../Constants/CelebrityData";
import HomeLayout from "../Layouts/HomeLayout";

function AboutUs() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeCard, setActiveCard] = useState(0);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const stats = [
        { value: "10K+", label: "Active Students", icon: "👨‍🎓" },
        { value: "500+", label: "Expert Teachers", icon: "👩‍🏫" },
        { value: "1000+", label: "Quality Courses", icon: "📚" },
        { value: "95%", label: "Success Rate", icon: "⭐" }
    ];

    const features = [
        {
            title: "Learn Anywhere",
            description: "Access courses from any device, anytime, anywhere",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            title: "Expert Mentors",
            description: "Learn from industry professionals and experienced educators",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            title: "Affordable Pricing",
            description: "Quality education shouldn't break the bank",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            title: "Career Growth",
            description: "Build skills that accelerate your professional journey",
            gradient: "from-orange-500 to-yellow-500"
        }
    ];

    return (
        <HomeLayout>
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative lg:pl-20 pt-20 pb-20 flex flex-col text-white min-h-[90vh]">
                    {/* Hero Section */}
                    <div className={`flex flex-col lg:flex-row items-center gap-10 mx-10 mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <section className="lg:w-1/2 space-y-8">
                            <div className="inline-block">
                                <span className="text-sm font-semibold tracking-wider text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
                                    🚀 WELCOME TO THE FUTURE OF LEARNING
                                </span>
                            </div>

                            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
                                    Affordable
                                </span>
                                <br />
                                <span className="text-white">and Quality</span>
                                <br />
                                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    Education
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 leading-relaxed">
                                Our goal is to provide affordable quality education to the world.
                                We are creating a platform where aspiring teachers and students
                                share their skills, creativity, and knowledge to empower each other
                                and contribute to the growth and wellness of mankind.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full font-semibold text-black overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50">
                                    <span className="relative z-10">Start Learning Today</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                                <button className="px-8 py-4 border-2 border-gray-700 rounded-full font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all hover:scale-105 backdrop-blur-sm">
                                    Explore Courses
                                </button>
                            </div>
                        </section>

                        <div
                            className="lg:w-1/2 relative group"
                            onMouseMove={handleMouseMove}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
                            <div className="relative">
                                <img
                                    alt="about main"
                                    className="relative z-10 drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-105"
                                    src={aboutMainImage}
                                    style={{
                                        filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.5))",
                                        transform: `perspective(1000px) rotateY(${(mousePosition.x - 250) / 50}deg) rotateX(${-(mousePosition.y - 250) / 50}deg)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className={`mx-10 mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-purple-500/0 group-hover:from-yellow-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all"></div>
                                    <div className="relative">
                                        <div className="text-4xl mb-2">{stat.icon}</div>
                                        <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-gray-400 font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className={`mx-10 mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-12">
                            Why Choose <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Us?</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-transparent transition-all duration-300 hover:scale-105 overflow-hidden"
                                    onMouseEnter={() => setActiveCard(index)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform`}>
                                            ✨
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Section */}
                    <div className={`mx-auto mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Inspiring Leaders
                            </span>
                        </h2>
                        <p className="text-gray-400 text-center mb-12 text-lg">
                            Learn from those who've shaped the world
                        </p>
                        <div className="w-[90vw] lg:w-[70vw] carousel m-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none z-10"></div>
                            {celebrities && celebrities.map(celebrity => (
                                <CarouselSlide
                                    {...celebrity}
                                    key={celebrity.slideNumber}
                                    totalSlides={celebrities.length}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className={`mx-10 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-12 overflow-hidden">
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="relative text-center">
                                <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">
                                    Ready to Transform Your Future?
                                </h2>
                                <p className="text-black/80 text-xl mb-8">
                                    Join thousands of learners worldwide and start your journey today
                                </p>
                                <button className="px-10 py-5 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform hover:shadow-2xl">
                                    Get Started Now →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default AboutUs;