// // src/app/[locale]/layout.tsx

// import { NextIntlClientProvider, hasLocale } from "next-intl";
// import { notFound } from "next/navigation";
// import { routing } from "@/i18n/routing";

// import { Providers } from "@/providers/HeroProviders";
// import StoreProvider from "@/providers/StoreProvider";
// import StockManagementLayout from "@/components/layout/StockManagementLayout";

// export default async function LocaleLayout({
//     children,
//     params,
// }: {
//     children: React.ReactNode;
//     params: Promise<{ locale: string }>;
// }) {
//     // Ensure that the incoming `locale` is valid
//     const { locale } = await params;
//     if (!hasLocale(routing.locales, locale)) {
//         notFound();
//     }

//     return (
//         <NextIntlClientProvider>
//             <StoreProvider>
//                 <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
//                     <StockManagementLayout>{children}</StockManagementLayout>
//                 </Providers>
//             </StoreProvider>
//         </NextIntlClientProvider>
//     );
// }

// // src/components/layout/StockManagementLayout.tsx

// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     Menu,
//     X,
//     Package,
//     BarChart3,
//     ShoppingCart,
//     Users,
//     Settings,
//     Home,
//     Bell,
//     Search,
//     User
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// interface StockManagementLayoutProps {
//     children: React.ReactNode;
// }

// const StockManagementLayout: React.FC<StockManagementLayoutProps> = ({ children }) => {
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const [navVisible, setNavVisible] = useState(true);
//     const [lastScrollY, setLastScrollY] = useState(0);

//     // Handle navbar show/hide on scroll
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollY = window.scrollY;

//             if (currentScrollY > lastScrollY && currentScrollY > 100) {
//                 setNavVisible(false);
//             } else {
//                 setNavVisible(true);
//             }

//             setLastScrollY(currentScrollY);
//         };

//         window.addEventListener("scroll", handleScroll, { passive: true });
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, [lastScrollY]);

//     const sidebarItems = [
//         { icon: Home, label: "Dashboard", href: "/dashboard", badge: null },
//         { icon: Package, label: "Inventory", href: "/inventory", badge: "24" },
//         { icon: ShoppingCart, label: "Orders", href: "/orders", badge: "5" },
//         { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
//         { icon: Users, label: "Suppliers", href: "/suppliers", badge: null },
//         { icon: Settings, label: "Settings", href: "/settings", badge: null },
//     ];

//     return (
//         <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//             {/* Navigation Bar */}
//             <motion.nav
//                 initial={{ y: 0 }}
//                 animate={{ y: navVisible ? 0 : -100 }}
//                 transition={{ duration: 0.3, ease: "easeInOut" }}
//                 className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
//             >
//                 <div className="flex items-center justify-between px-4 py-3">
//                     {/* Left section */}
//                     <div className="flex items-center space-x-4">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setSidebarOpen(!sidebarOpen)}
//                             className="p-2"
//                         >
//                             <Menu className="h-5 w-5" />
//                         </Button>

//                         <div className="flex items-center space-x-2">
//                             <Package className="h-6 w-6 text-blue-600" />
//                             <span className="font-semibold text-lg">StockFlow</span>
//                         </div>
//                     </div>

//                     {/* Center section - Search */}
//                     <div className="hidden md:flex flex-1 max-w-md mx-8">
//                         <div className="relative w-full">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                             <Input
//                                 placeholder="Search products, orders..."
//                                 className="pl-10 bg-gray-100 dark:bg-gray-700 border-none"
//                             />
//                         </div>
//                     </div>

//                     {/* Right section */}
//                     <div className="flex items-center space-x-3">
//                         <Button variant="ghost" size="sm" className="relative">
//                             <Bell className="h-5 w-5" />
//                             <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500">
//                                 3
//                             </Badge>
//                         </Button>

//                         <Button variant="ghost" size="sm">
//                             <User className="h-5 w-5" />
//                         </Button>
//                     </div>
//                 </div>
//             </motion.nav>

//             {/* Sidebar */}
//             <AnimatePresence>
//                 {sidebarOpen && (
//                     <motion.aside
//                         initial={{ x: -280 }}
//                         animate={{ x: 0 }}
//                         exit={{ x: -280 }}
//                         transition={{ duration: 0.3, ease: "easeInOut" }}
//                         className="fixed left-0 top-0 z-40 h-full w-70 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg"
//                     >
//                         {/* Sidebar Header */}
//                         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 mt-16">
//                             <h2 className="font-semibold text-gray-800 dark:text-gray-200">Menu</h2>
//                             <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => setSidebarOpen(false)}
//                                 className="md:hidden"
//                             >
//                                 <X className="h-4 w-4" />
//                             </Button>
//                         </div>

//                         {/* Sidebar Content */}
//                         <div className="flex flex-col p-4 space-y-2">
//                             {sidebarItems.map((item, index) => (
//                                 <motion.button
//                                     key={item.label}
//                                     initial={{ opacity: 0, x: -20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: index * 0.1 }}
//                                     className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
//                                 >
//                                     <div className="flex items-center space-x-3">
//                                         <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
//                                         <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
//                                             {item.label}
//                                         </span>
//                                     </div>
//                                     {item.badge && (
//                                         <Badge variant="secondary" className="text-xs">
//                                             {item.badge}
//                                         </Badge>
//                                     )}
//                                 </motion.button>
//                             ))}
//                         </div>

//                         {/* Sidebar Footer */}
//                         <div className="absolute bottom-4 left-4 right-4">
//                             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                                 <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
//                                     Storage Used
//                                 </p>
//                                 <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
//                                     <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
//                                 </div>
//                                 <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
//                                     7.2 GB of 10 GB used
//                                 </p>
//                             </div>
//                         </div>
//                     </motion.aside>
//                 )}
//             </AnimatePresence>

//             {/* Sidebar Overlay for Mobile */}
//             <AnimatePresence>
//                 {sidebarOpen && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={() => setSidebarOpen(false)}
//                         className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
//                     />
//                 )}
//             </AnimatePresence>

//             {/* Main Content */}
//             <main
//                 className={`transition-all duration-300 ease-in-out pt-16 min-h-screen ${sidebarOpen ? "md:ml-70" : "ml-0"
//                     }`}
//             >
//                 <div className="p-6">
//                     {children}
//                 </div>
//             </main>

//             {/* Footer */}
//             <footer
//                 className={`transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${sidebarOpen ? "md:ml-70" : "ml-0"
//                     }`}
//             >
//                 <div className="px-6 py-4">
//                     <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
//                         <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
//                             <span>&copy; 2024 StockFlow. All rights reserved.</span>
//                         </div>
//                         <div className="flex items-center space-x-4 text-sm">
//                             <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
//                                 Privacy Policy
//                             </button>
//                             <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
//                                 Terms of Service
//                             </button>
//                             <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
//                                 Support
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </footer>

//         </div>
//     );
// };

// export default StockManagementLayout;