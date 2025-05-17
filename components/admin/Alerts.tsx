import { Bell, ChevronRight } from 'lucide-react';
import React from 'react';

type AlertType = 'urgent' | 'warning' | 'info';

interface Alert {
    id: number;
    type: AlertType;
    message: string;
    time: string;
}

const AlertsCard = () => {
    const alerts: Alert[] = [
        { id: 1, type: 'urgent', message: '5 new orders placed', time: '2 min ago' },
        { id: 2, type: 'warning', message: 'Table 7 waiting for check', time: '5 min ago' },
        { id: 3, type: 'info', message: 'Reservation for Johnson party of 8', time: '10 min ago' },
    ];

    const alertStyles: Record<AlertType, string> = {
        urgent: 'bg-red-50 border-l-4 border-red-500 text-red-700 hover:bg-red-100 transition-colors',
        warning: 'bg-amber-50 border-l-4 border-amber-500 text-amber-700 hover:bg-amber-100 transition-colors',
        info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 hover:bg-blue-100 transition-colors',
    };

    return (
        <div className="w-full h-full border rounded-lg bg-card p-4 flex flex-col shadow-sm overflow-hidden">
            <div className="flex-none flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" />
                    Alerts
                </h3>
                <button className="text-xs text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 font-medium">
                    View all <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-2.5 rounded-md ${alertStyles[alert.type]}`}>
                        <div className="flex justify-between items-start gap-2">
                            <p className="text-sm font-medium leading-snug">{alert.message}</p>
                            <span className="text-xs opacity-75 whitespace-nowrap">{alert.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsCard;