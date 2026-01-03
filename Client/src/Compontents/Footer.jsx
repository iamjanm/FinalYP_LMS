import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";

function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "About Us", href: "/about" },
        { name: "Courses", href: "/courses" },
        { name: "Instructors", href: "/instructors" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" }
    ];

    const courses = [
        { name: "Web Development", href: "/courses/web-dev" },
        { name: "Data Science", href: "/courses/data-science" },
        { name: "Digital Marketing", href: "/courses/marketing" },
        { name: "Graphic Design", href: "/courses/design" },
        { name: "Business Analytics", href: "/courses/analytics" }
    ];

    const support = [
        { name: "Help Center", href: "/help" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "FAQs", href: "/faqs" },
        { name: "Refund Policy", href: "/refund" }
    ];

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Linkedin, href: "#", label: "LinkedIn" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Youtube, href: "#", label: "YouTube" }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
                                <span className="text-2xl font-bold text-white">LMS</span>
                            </div>
                            <span className="text-xl font-bold text-white">Learning Hub</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Transform your future with our comprehensive online learning platform.
                            Join thousands of students worldwide and master new skills with expert instructors.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 group">
                                <MapPin className="w-5 h-5 text-yellow-500 mt-1 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">Islamia uni bahawalpur</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Phone className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">+92 3017713270</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <Mail className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm">support@learninghub.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
                            Quick Links
                            <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-500 transition-all duration-300"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Courses */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
                            Popular Courses
                            <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        </h3>
                        <ul className="space-y-3">
                            {courses.map((course, index) => (
                                <li key={index}>
                                    <a
                                        href={course.href}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-500 transition-all duration-300"></span>
                                        {course.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
                            Support
                            <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        </h3>
                        <ul className="space-y-3 mb-6">
                            {support.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-yellow-500 transition-all duration-300"></span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                    {/* <div className="mt-12 pt-8 border-t border-gray-800">
                        <div className="max-w-2xl">
                            <h3 className="text-white font-bold text-xl mb-3">Stay Updated</h3>
                            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest courses and updates.</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                                />
                                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 flex items-center justify-center gap-2 group">
                                    Subscribe
                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div> */}
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} Learning Hub. All rights reserved. Crafted with ❤️ for learners worldwide.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="bg-gray-800 p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 group transform hover:scale-110"
                                >
                                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

                            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        </footer>
    );
}

export default Footer;