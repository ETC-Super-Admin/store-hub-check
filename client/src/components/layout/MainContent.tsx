"use client";

import React from "react";

interface MainContentProps {
    children: React.ReactNode;
    sidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ children, sidebarOpen }) => {
    return (
        <main
            className={`transition-all duration-300 ease-in-out pt-16 min-h-screen ${sidebarOpen ? "md:ml-70" : "ml-0"
                }`}
        >
            <div className="p-6">
                {children}
            </div>
        </main>
    );
};

export default MainContent;