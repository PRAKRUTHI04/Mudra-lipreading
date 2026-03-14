import { motion } from "framer-motion";
import { Shield, Users, UserX, UserCheck, Search, MoreVertical, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowCard from "@/components/GlowCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useState } from "react";

const usersData = [
    { id: 1, name: "Dr. Sarah Chen", email: "sarah.chen@mudra.ai", role: "Researcher", status: "active", lastActive: "2 min ago", processed: 342 },
    { id: 2, name: "Alex Kumar", email: "alex.k@mudra.ai", role: "Analyst", status: "active", lastActive: "15 min ago", processed: 128 },
    { id: 3, name: "Maria Rodriguez", email: "maria.r@mudra.ai", role: "Developer", status: "active", lastActive: "1 hour ago", processed: 567 },
    { id: 4, name: "James Wilson", email: "james.w@external.com", role: "Guest", status: "blocked", lastActive: "3 days ago", processed: 12 },
    { id: 5, name: "Priya Patel", email: "priya.p@mudra.ai", role: "Researcher", status: "active", lastActive: "30 min ago", processed: 891 },
    { id: 6, name: "Unknown User", email: "suspicious@temp.com", role: "Guest", status: "blocked", lastActive: "1 week ago", processed: 3 },
];

const Admin = () => {
    const [search, setSearch] = useState("");
    const filtered = usersData.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-display font-bold glow-text">Administration</h1>
                    <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide">
                        Manage platform access and user permissions
                    </p>
                </motion.div>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Users", value: 1432, icon: Users, color: "hsl(185, 100%, 50%)" },
                        { label: "Active Now", value: 89, icon: UserCheck, color: "hsl(160, 80%, 45%)" },
                        { label: "Blocked", value: 23, icon: UserX, color: "hsl(0, 80%, 55%)" },
                        { label: "Pending Review", value: 7, icon: Shield, color: "hsl(35, 95%, 55%)" },
                    ].map((s, i) => (
                        <GlowCard key={s.label} delay={i * 0.1} className="p-5" glowColor={s.color}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg" style={{ background: `${s.color}15` }}>
                                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                                </div>
                                <div>
                                    <p className="text-xs font-tech text-muted-foreground tracking-wider">{s.label}</p>
                                    <AnimatedCounter target={s.value} className="!text-xl" />
                                </div>
                            </div>
                        </GlowCard>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 font-tech"
                    />
                </div>

                {/* User Table */}
                <GlowCard className="p-0 overflow-hidden" delay={0.3}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/10">
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">User</th>
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">Role</th>
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">Status</th>
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">Processed</th>
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">Last Active</th>
                                    <th className="text-left text-xs font-tech tracking-widest text-muted-foreground p-4 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {filtered.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 + i * 0.05 }}
                                        className="hover:bg-muted/10 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div>
                                                <p className="text-sm font-tech text-foreground">{user.name}</p>
                                                <p className="text-xs font-tech text-muted-foreground">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-tech tracking-wider px-2 py-1 rounded-md bg-muted/30 text-foreground">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.status === "active" ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-tech tracking-wider text-emerald-glow">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-tech tracking-wider text-destructive">
                                                    <Ban className="w-3 h-3" /> BLOCKED
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm font-display text-primary">{user.processed}</td>
                                        <td className="p-4 text-xs font-tech text-muted-foreground">{user.lastActive}</td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {user.status === "active" ? (
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs font-tech">
                                                        <Ban className="w-3 h-3 mr-1" /> Block
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="text-emerald-glow hover:text-emerald-glow text-xs font-tech">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Unblock
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlowCard>
            </div>
        </div>
    );
};

export default Admin;
