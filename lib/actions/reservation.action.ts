"use server"

import { connectToDatabase } from "../Database/MongoDb";
import ReservationModel from "../Database/models/reservationModel";
import TableModel from "../Database/models/tableModel";
import UserModel from "../Database/models/userModel";

interface CreateReservationParams {
    tableId: string;
    userId: string; // This is the clerkId
    customerName: string;
    customerPhone: string;
    numberOfGuests: number;
    reservationDate: Date;
    reservationTime: string;
    specialRequests?: string;
}

export const createReservation = async (params: CreateReservationParams) => {
    await connectToDatabase();

    const {
        tableId,
        userId: clerkId,
        customerName,
        customerPhone,
        numberOfGuests,
        reservationDate,
        reservationTime,
        specialRequests
    } = params;

    const [table, user] = await Promise.all([
        TableModel.findById(tableId),
        UserModel.findOne({ clerkId })
    ]);

    if (!table) {
        throw new Error("Table not found");
    }
    if (!user) {
        throw new Error("User not found");
    }

    if (numberOfGuests > table.capacity) {
        throw new Error("Number of guests exceeds table capacity");
    }

    const reservation = await ReservationModel.create({
        table: tableId,
        user: user._id, // Use the user's database ID
        guestCount: numberOfGuests,
        guestInfo: {
            name: customerName,
            phone: customerPhone,
            email: user.email, // Assuming user model has email
        },
        reservationDate,
        reservationTime,
        specialRequests,
        status: 'pending', // Or 'pending'
    });

    const today = new Date();
    const reservationD = new Date(reservationDate);
    today.setHours(0, 0, 0, 0);
    reservationD.setHours(0, 0, 0, 0);

    if (reservationD.getTime() === today.getTime()) {
        table.isAvailable = false;
        table.status = "reserved";
        await table.save();
    }

    return JSON.parse(JSON.stringify(reservation));
};

interface UpdateReservationParams {
    reservationId: string;
    updateData: {
        customerName?: string;
        customerPhone?: string;
        numberOfGuests?: number;
        reservationDate?: Date;
        reservationTime?: string;
        specialRequests?: string;
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
}

export const updateReservation = async ({ reservationId, updateData }: UpdateReservationParams) => {
    await connectToDatabase();

    const reservation = await ReservationModel.findById(reservationId);
    if (!reservation) {
        throw new Error("Reservation not found");
    }

    const updatePayload: any = {};
    const guestInfoPayload: any = {};

    if (updateData.customerName) guestInfoPayload.name = updateData.customerName;
    if (updateData.customerPhone) guestInfoPayload.phone = updateData.customerPhone;
    if (Object.keys(guestInfoPayload).length > 0) {
        updatePayload['guestInfo'] = { ...reservation.guestInfo.toObject(), ...guestInfoPayload };
    }

    if (updateData.numberOfGuests) updatePayload.guestCount = updateData.numberOfGuests;
    if (updateData.reservationDate) updatePayload.reservationDate = updateData.reservationDate;
    if (updateData.reservationTime) updatePayload.reservationTime = updateData.reservationTime;
    if (updateData.specialRequests !== undefined) updatePayload.specialRequests = updateData.specialRequests;
    if (updateData.status) updatePayload.status = updateData.status;

    const table = await TableModel.findById(reservation.table);
    if (!table) {
        throw new Error("Associated table not found for the reservation");
    }

    if (updateData.numberOfGuests && updateData.numberOfGuests > table.capacity) {
        throw new Error("Number of guests exceeds table capacity");
    }

    const updatedReservation = await ReservationModel.findByIdAndUpdate(
        reservationId,
        { $set: updatePayload },
        { new: true }
    );

    if (!updatedReservation) {
        throw new Error("Failed to update reservation");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oldReservationDate = new Date(reservation.reservationDate);
    oldReservationDate.setHours(0, 0, 0, 0);

    const newReservationDate = new Date(updatedReservation.reservationDate);
    newReservationDate.setHours(0, 0, 0, 0);

    const isToday = (date: Date) => date.getTime() === today.getTime();

    if (isToday(oldReservationDate) && !isToday(newReservationDate)) {
        table.isAvailable = true;
        table.status = 'available';
        await table.save();
    } else if (isToday(newReservationDate)) {
        if (['cancelled', 'completed'].includes(updatedReservation.status)) {
            table.isAvailable = true;
            table.status = 'available';
        } else {
            table.isAvailable = false;
            table.status = 'reserved';
        }
        await table.save();
    }


    return JSON.parse(JSON.stringify(updatedReservation));
};