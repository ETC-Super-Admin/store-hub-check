"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Package, BarChart3, ShoppingCart, Users, Settings, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen }) => {
    const sidebarItems = [
        { icon: Home, label: "Dashboard", href: "/", badge: null },
        { icon: Package, label: "Inventory", href: "/inventory", badge: "24" },
        { icon: ShoppingCart, label: "Orders", href: "/orders", badge: "5" },
        { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
        { icon: Users, label: "Suppliers", href: "/suppliers", badge: null },
        { icon: Settings, label: "Settings", href: "/settings", badge: null },
    ];

    return (
        <>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 z-40 h-full w-70 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 mt-16">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">Menu</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Sidebar Content */}
                <div className="flex flex-col p-4 space-y-2">
                    {sidebarItems.map((item, index) => (
                        <Link href={item.href} key={item.label} passHref>
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-primary" />
                                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                        {item.label}
                                    </span>
                                </div>
                                {item.badge && (
                                    <div className="relative">
                                        <div className="h-1 w-3 bg-primary rounded-full absolute -top-1 right-0" />
                                        {item.badge}
                                    </div>
                                )}
                            </motion.button>
                        </Link>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Storage Used
                        </p>
                        <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-xs text-primary dark:text-blue-300 mt-1">
                            7.2 GB of 10 GB used
                        </p>
                    </div>
                </div>
            </motion.aside>

            {/* Sidebar Overlay for Mobile */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            />
        </>
    );
};

export default Sidebar;