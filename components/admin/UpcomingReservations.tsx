import { Calendar, ChevronRight, Users } from "lucide-react";

type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

interface Reservation {
    id: number;
    name: string;
    time: string;
    guests: number;
    table: number;
    status: ReservationStatus;
}

const UpcomingReservations = () => {
    const reservations: Reservation[] = [
        { id: 1, name: 'Smith Family', time: '12:30 PM', guests: 4, table: 15, status: 'confirmed' },
        { id: 2, name: 'Johnson Birthday', time: '1:15 PM', guests: 8, table: 20, status: 'pending' },
        { id: 3, name: 'Business Meeting', time: '3:00 PM', guests: 6, table: 12, status: 'confirmed' },
    ];

    const statusStyles: Record<ReservationStatus, string> = {
        confirmed: 'text-emerald-700 bg-emerald-100',
        pending: 'text-amber-700 bg-amber-100',
        cancelled: 'text-red-700 bg-red-100',
    };

    return (
        <div className="w-full h-full border rounded-lg bg-card p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium flex items-center gap-1">
                    Reservations <Calendar className="w-3 h-3 text-orange-500" />
                </h3>
                <button className="text-xs text-orange-500 hover:underline flex items-center gap-0.5">
                    View all <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0">
                {reservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        className="p-1.5 bg-muted/50 rounded hover:bg-muted/75 transition-colors"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{reservation.name}</p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                                    <span>{reservation.time}</span>
                                    <span className="flex items-center gap-0.5">
                                        <Users className="w-2.5 h-2.5" /> {reservation.guests}
                                    </span>
                                    <span>Table {reservation.table}</span>
                                </div>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusStyles[reservation.status]}`}>
                                {reservation.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingReservations;