// AppSidebar.jsx
"use client";
import { useState } from "react";
import {
    LayoutDashboard,
    Settings,
    Table,
    User,
    UtensilsCrossed,
    LogOut,
    UserCog,
    ChevronRight,
    ChevronDown,
    Menu,
    Calendar,
    Hamburger
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import Link from "next/link";
import Image from "next/image";
import MobileSidebar from "./MobileSide";
import { usePathname } from "next/navigation";

// Menu items with active state tracking
const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Manage Users",
        url: "/admin/users",
        icon: User,
    },
    {
        title: "Manage Tables",
        url: "/admin/tables",
        icon: Table,
    },
    {
        title: "Manage Orders",
        url: "/admin/orders",
        icon: UtensilsCrossed,
    },
    {
        title: "Manage Menu",
        url: "/admin/menu",
        icon: Hamburger,
    },
    {
        title: "Reservations",
        url: "/admin/reservations",
        icon: Calendar,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
];

function AppSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Simulating current user
    const user = {
        name: "Admin User",
        role: "Administrator",
        avatar: "/api/placeholder/40/40"
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    // Helper function to check if a menu item is active
    const isActiveItem = (itemUrl) => {
        return pathname === itemUrl || pathname.startsWith(itemUrl + '/');
    };

    return (
        <>
            {/* Mobile sidebar */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden shadow-none outline-none border-none">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <MobileSidebar
                        items={items}
                        pathname={pathname}
                        user={user}
                        setIsMobileOpen={setIsMobileOpen}
                    />
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:flex flex-col h-screen sticky top-0 bg-background border-r transition-all duration-300 ${
                    isCollapsed ? "w-16" : "w-64"
                }`}
            >
                <div className="flex items-center justify-between h-14 px-4 border-b">
                    <div className="flex items-center">
                        <Image
                            className={`${isCollapsed ? "mx-auto" : "mr-3"} h-8 w-8`}
                            src="/logo.svg"
                            alt="Logo"
                            height={32}
                            width={32}
                        />
                        {!isCollapsed && (
                            <span className="font-semibold text-lg">Admin Panel</span>
                        )}
                    </div>

                    <Button
                        onClick={toggleCollapse}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                <ScrollArea className="flex-1 py-2">
                    <div className="space-y-1 px-2">
                        <div className="pb-2">
                            {!isCollapsed && (
                                <h2 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                                    MENU
                                </h2>
                            )}
                            <nav className="space-y-1">
                                {items.map((item) => (
                                    <TooltipProvider key={item.title} delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    asChild
                                                    variant={isActiveItem(item.url) ? "default" : "ghost"}
                                                    className={`w-full justify-start ${isCollapsed ? "px-2" : "px-2"} ${
                                                        isActiveItem(item.url) 
                                                            ? "bg-primary text-primary-foreground" 
                                                            : "hover:bg-accent hover:text-accent-foreground"
                                                    }`}
                                                >
                                                    <Link href={item.url} className="flex items-center w-full">
                                                        <item.icon className={`${isCollapsed ? "mx-auto" : "mr-2"} h-4 w-4 shrink-0`} />
                                                        {!isCollapsed && (
                                                            <span className="truncate">{item.title}</span>
                                                        )}
                                                    </Link>
                                                </Button>
                                            </TooltipTrigger>
                                            {isCollapsed && (
                                                <TooltipContent side="right" sideOffset={10}>
                                                    {item.title}
                                                </TooltipContent>
                                            )}
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </nav>
                        </div>
                    </div>
                </ScrollArea>

                <div className="mt-auto p-2 border-t">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start ${isCollapsed ? "px-2" : "px-2"} hover:bg-accent`}
                            >
                                <div className="flex items-center w-full">
                                    <Avatar className={`${isCollapsed ? "mx-auto" : "mr-2"} h-6 w-6 shrink-0`}>
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>AU</AvatarFallback>
                                    </Avatar>
                                    {!isCollapsed && (
                                        <div className="text-left min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                                        </div>
                                    )}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.role}
                                </p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/admin/profile" className="flex items-center cursor-pointer">
                                    <UserCog className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings" className="flex items-center cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
                                <Link href="/admin/logout" className="flex items-center cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </>
    );
}

export default AppSidebar;