"use server"

import { IReservation } from "@/types";
import { connectToDatabase } from "../Database/MongoDb";
import Reservation from "../Database/models/reservationModel";
import { handleError } from "../utils";

export const createReservation = async (data: IReservation): Promise<IReservation> => {
    try {
        await connectToDatabase();
        if (!data) throw new Error("Missing required reservation data");

        const newReservation = await Reservation.create(data);
        return newReservation.toObject({ getters: true }) as IReservation;
    } catch (error) {
        throw new Error(handleError(error));
    }
};