"use client";

import React from "react";

interface FooterProps {
    sidebarOpen: boolean;
}

const Footer: React.FC<FooterProps> = ({ sidebarOpen }) => {
    return (
        <footer
            className={`transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${sidebarOpen ? "md:ml-70" : "ml-0"
                }`}
        >
            <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>&copy; 2024 StockFlow. All rights reserved.</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Privacy Policy
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Terms of Service
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            Support
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;