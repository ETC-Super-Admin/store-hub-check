"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import Footer from "./Footer";

interface StockManagementLayoutProps {
    children: React.ReactNode;
}

const StockManagementLayout: React.FC<StockManagementLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navVisible = useScrollDirection();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                navVisible={navVisible}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <AnimatePresence>
                {sidebarOpen && (
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />
                )}
            </AnimatePresence>

            <MainContent sidebarOpen={sidebarOpen}>
                {children}
            </MainContent>

            <Footer sidebarOpen={sidebarOpen} />
        </div>
    );
};

export default StockManagementLayout;