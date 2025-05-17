import React from 'react';
import { Clock, DollarSign, Users, Utensils } from 'lucide-react';
import AlertsCard from '@/components/admin/Alerts';
import SalesChart from '@/components/admin/Barchart';
import DetailsCard from '@/components/admin/Card';
import UpcomingReservations from '@/components/admin/UpcomingReservations';

const Dashboard = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] p-6 flex flex-col gap-6 bg-background overflow-hidden">
            {/* Header Section */}
            <div className="flex-none flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>

            {/* Main Grid Container */}
            <div className="flex-1 grid grid-rows-[auto_1fr] gap-6 min-h-0 overflow-hidden">
                {/* Stats Cards Row */}
                <div className="flex-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailsCard
                        title="Total Tables"
                        value={24}
                        secondaryValue={10}
                        content="occupied"
                        icon={<Utensils className="w-4 h-4" />}
                    />
                    <DetailsCard
                        title="Total Orders"
                        value={58}
                        secondaryValue={12}
                        content="pending"
                        icon={<Clock className="w-4 h-4" />}
                    />
                    <DetailsCard
                        title="Available Staff"
                        value={8}
                        secondaryValue={2}
                        content="on break"
                        icon={<Users className="w-4 h-4" />}
                    />
                    <DetailsCard
                        title="Revenue Today"
                        value="$1,240"
                        secondaryValue={5}
                        content="new tips"
                        icon={<DollarSign className="w-4 h-4" />}
                    />
                </div>

                {/* Charts and Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0 overflow-hidden">
                    {/* Sales Chart */}
                    <div className="lg:col-span-2 h-full overflow-hidden">
                        <SalesChart />
                    </div>

                    {/* Alerts and Reservations */}
                    <div className="grid grid-rows-2 gap-6 h-full overflow-hidden">
                        <AlertsCard />
                        <UpcomingReservations />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;