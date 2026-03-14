import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Video, Clock, Shield, MessageSquare,
    Settings, Fingerprint, LogOut, FlaskConical, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Process", icon: Video, path: "/process" },
    { label: "History", icon: Clock, path: "/history" },
    { label: "Verification", icon: FlaskConical, path: "/verification" },
    { label: "Admin", icon: Shield, path: "/admin" },
    { label: "Feedback", icon: MessageSquare, path: "/feedback" },
    { label: "Settings", icon: Settings, path: "/settings" },
];

const AppLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r border-border/30"
                style={{
                    background: "linear-gradient(180deg, hsl(220 25% 5%) 0%, hsl(220 25% 3%) 100%)",
                }}
            >
                {/* Logo */}
                <div className="p-4 flex items-center gap-3 border-b border-border/20">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-2 rounded-xl bg-primary/10 border border-primary/20 flex-shrink-0"
                    >
                        <Fingerprint className="w-6 h-6 text-primary" />
                    </motion.div>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h1 className="text-lg font-display font-bold glow-text tracking-wider">MUDRA</h1>
                            <p className="text-[10px] font-tech text-muted-foreground tracking-widest">NEURAL LIP READER</p>
                        </motion.div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                whileHover={{ x: 2 }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${isActive
                                        ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground border border-transparent"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:text-primary/70"}`} />
                                {!collapsed && (
                                    <span className="text-sm font-tech tracking-wider whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                                {isActive && !collapsed && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 space-y-1 border-t border-border/20">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-all"
                    >
                        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        {!collapsed && <span className="text-sm font-tech tracking-wider">Collapse</span>}
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-tech tracking-wider">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                animate={{ marginLeft: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 min-h-screen overflow-x-hidden"
            >
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            </motion.main>
        </div>
    );
};

export default AppLayout;
