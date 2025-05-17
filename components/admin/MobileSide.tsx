"use client";
import {
    Settings,
    LogOut,
    UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

import Link from "next/link";
import Image from "next/image";

// Fixed type definition
type SidebarProps = {
    items: {
        title: string;
        url: string;
        icon: React.ElementType;
    }[];
    user: {
        name: string;
        role: string;
        avatar: string;
    };
    activeItem: string;
    setActiveItem: (item: string) => void;
    setIsMobileOpen: (isOpen: boolean) => void;
};

function MobileSidebar({ items, activeItem, setActiveItem, user, setIsMobileOpen }: SidebarProps) {
    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex items-center h-14 px-4 border-b">
                <div className="flex items-center">
                    <Image
                        className="mr-3 h-8 w-8"
                        src="/logo.svg"
                        alt="Logo"
                        height={32}
                        width={32}
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 py-2">
                <div className="space-y-1 px-2">
                    <div className="pb-2">
                        <h2 className="text-xs font-semibold text-muted-foreground px-2 py-1">
                            Application
                        </h2>
                        <nav className="space-y-1">
                            {items.map((item) => (
                                <Button
                                    key={item.title}
                                    asChild
                                    variant={activeItem === item.title ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => {
                                        setActiveItem(item.title);
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    <Link href={item.url} className="flex items-center">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </div>
                </div>
            </ScrollArea>

            <div className="mt-auto p-2 border-t">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start">
                            <div className="flex items-center">
                                <Avatar className="mr-2 h-6 w-6">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>AU</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.role}</p>
                                </div>
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
        </div>
    );
}

export default MobileSidebar;