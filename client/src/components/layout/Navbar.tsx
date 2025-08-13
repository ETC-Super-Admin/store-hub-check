"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu, Package, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { ThemeSwitch } from "../theme-switch";

interface NavbarProps {
    navVisible: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navVisible, sidebarOpen, setSidebarOpen }) => {
    return (
        <motion.nav
            initial={{ y: 0 }}
            animate={{ y: navVisible ? 0 : -100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left section */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center space-x-2">
                        <Package className="h-6 w-6 text-primary" />
                        <span className="font-semibold text-lg">StockFlow</span>
                    </div>
                </div>

                {/* Center section - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <Input
                        placeholder="Search products, orders..."
                        startContent={<Search className="text-gray-400" size={18} />}
                    />
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="relative">

                        <Badge color="danger" size="sm" content="5" placement="top-right" className="absolute -top-1">
                            <Bell className="h-5 w-5" />

                        </Badge>
                        3
                    </Button>

                    <Button variant="ghost" size="sm">
                        <User className="h-5 w-5" />
                    </Button>

                    <Button variant="ghost" size="sm">

                        <ThemeSwitch />
                    </Button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;