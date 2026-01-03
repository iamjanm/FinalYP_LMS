import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, User, MessageSquare, Send, MapPin, Phone, Clock, CheckCircle } from "lucide-react";

import axiosInstance from "../Helpers/axiosinstance";
import { isEmail } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import emailjs from 'emailjs-com';

function Contact() {
    const [userInput, setUserInput] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const sendEmail = (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        emailjs.sendForm(
            "service_yr9oaoj",
            "template_xoqly2x",
            e.target,
            "_y3ZmIu7fxYB0c5WX"
        )
            .then(() => {
                toast.success("Email sent successfully!");
                setUserInput({
                    name: "",
                    email: "",
                    message: ""
                });
            })
            .catch(() => {
                toast.error("Failed to send email");
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };




    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.email || !userInput.name || !userInput.message) {
            toast.error("All fields are mandatory");
            return;
        }
        if (!isEmail(userInput.email)) {
            toast.error("Invalid Email");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = axiosInstance.post("/contact", userInput);
            toast.promise(response, {
                loading: "Submitting your message....",
                success: "Form submitted successfully",
                error: "Failed to submit the form"
            });
            const contactResponse = await response;
            if (contactResponse?.data?.success) {
                setUserInput({
                    name: "",
                    email: "",
                    message: ""
                });
            }
        } catch (error) {
            toast.error("Operation failed......");
        } finally {
            setIsSubmitting(false);
        }
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            content: "123 Learning Street, Education City, EC 12345",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            content: "+92 3017713270",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Clock,
            title: "Working Hours",
            content: "Mon - Fri: 9:00 AM - 6:00 PM",
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <HomeLayout>
            <div className="relative min-h-screen py-20 px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-6 py-2 mb-6">
                            <Mail className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-300">Get In Touch</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            Contact <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Us</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* Contact Info Cards */}
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20"
                                style={{
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.2}s backwards`
                                }}
                            >
                                <div className={`bg-gradient-to-r ${info.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <info.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-2">{info.title}</h3>
                                <p className="text-gray-400">{info.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <div className="order-2 lg:order-1">
                            <form onSubmit={sendEmail} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                                <h2 className="text-3xl font-bold text-white mb-6">Send us a Message</h2>

                                {/* Name Field */}
                                <div className="mb-6">
                                    <label htmlFor="name" className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <User className="w-5 h-5 text-yellow-400" />
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`w-full bg-gray-900/50 border ${focusedField === 'name' ? 'border-yellow-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300`}
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Enter your full name"
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            value={userInput.name}
                                        />
                                        {userInput.name && (
                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="mb-6">
                                    <label htmlFor="email" className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-yellow-400" />
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`w-full bg-gray-900/50 border ${focusedField === 'email' ? 'border-yellow-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300`}
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="your.email@example.com"
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            value={userInput.email}
                                        />
                                        {userInput.email && isEmail(userInput.email) && (
                                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="mb-6">
                                    <label htmlFor="message" className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-yellow-400" />
                                        Your Message
                                    </label>
                                    <textarea
                                        className={`w-full bg-gray-900/50 border ${focusedField === 'message' ? 'border-yellow-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 resize-none h-40`}
                                        name="message"
                                        id="message"
                                        placeholder="Tell us how we can help you..."
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        value={userInput.message}
                                    />
                                    <div className="text-right mt-1">
                                        <span className="text-sm text-gray-500">{userInput.message.length} characters</span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onSubmit = { sendEmail }                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Info Section */}
                        <div className="order-1 lg:order-2 space-y-8">
                            {/* Why Contact Us Card */}
                            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">Why Contact Us?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Get expert guidance on course selection",
                                        "Technical support for platform issues",
                                        "Partnership and collaboration opportunities",
                                        "Custom training solutions for organizations",
                                        "General inquiries and feedback"
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="bg-yellow-500 rounded-full p-1 mt-1">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Response Time Card */}
                            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Quick Response</h3>
                                        <p className="text-gray-400">We typically respond within 24 hours</p>
                                    </div>
                                </div>
                                <p className="text-gray-300">
                                    Our dedicated support team is here to help you with any questions or concerns.
                                    We're committed to providing timely and helpful responses to all inquiries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </HomeLayout>
    );
}

export default Contact;