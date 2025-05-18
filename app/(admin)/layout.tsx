import AppSidebar from "@/components/admin/SideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex">
                <AppSidebar />
                <div className="w-full ">
                    {children}
                    <Toaster />
                </div>
            </div>
        </SidebarProvider>
    );
}