import Image from "next/image";
import { MenuItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SerializedHotelTable } from "@/types/tables";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/lib/stores/orderStore";
import { useDebounce } from "@/lib/hooks/useDebounce";

type MenuCardProps = {
    item: MenuItem | SerializedHotelTable;
    type: "menu" | "table";
};

const MenuCard = ({ item, type }: MenuCardProps) => {
    if (type === "menu") {
        const meal = item as MenuItem;
        const addItem = useOrderStore((state) => state.addItem);
        const debouncedAddItem = useDebounce(()=>{
            console.log("Adding item with preparationTime:", meal.preparationTime);
            console.log("Meal data:", debouncedAddItem);
            const itemToAdd = {
                menuItem: meal._id,
                name: meal.name,
                price: meal.price,
                quantity: 1,
                estimatedServeTime: meal.preparationTime || 30
            };
            console.log("Item to add to store:", itemToAdd);
            addItem(itemToAdd);
        }, 300)
        return (
            <div className="border rounded-lg shadow-md overflow-hidden flex flex-col mb-6 hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full shrink-0">
                    <Image
                        src={meal.image || "https://placehold.co/600x400"}
                        alt={meal.name}
                        fill
                        className="object-cover"
                    />
                    {meal.isAvailable ? (
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">Available</Badge>
                    ) : (
                        <Badge variant="destructive" className="absolute top-2 right-2">Not Available</Badge>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-2 truncate">{meal.name}</h2>
                    <p className="text-sm text-gray-600 mb-2">Category: {meal.category.name}</p>
                    <p className="text-sm line-clamp-3 text-gray-700 mb-4 flex-grow">{meal.description}</p>

                    <div className="flex justify-between items-center mt-auto">
                        <p className="text-lg font-semibold text-primary">${meal.price.toFixed(2)}</p>
                        <Button onClick={debouncedAddItem} >Add to List</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "table") {
        const table = item as SerializedHotelTable;
        return (
            <Link href={`/select-tables/${table._id}`}>
                <div className="border rounded-lg shadow-md overflow-hidden flex flex-col mb-6 hover:shadow-lg transition-shadow duration-300 p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold truncate">Table {table.tableNumber}</h2>
                        {table.isAvailable ? (
                            <Badge className="bg-green-500 text-white">Available</Badge>
                        ) : (
                            <Badge variant="destructive">Not Available</Badge>
                        )}
                    </div>
                    <div className="text-sm text-gray-600">
                        <p>Place: <span className="font-semibold">{table.location}</span></p>
                        <p>Seats: <span className="font-semibold">{table.capacity}</span></p>
                        <p>Status: <span className="font-semibold">{table.status}</span></p>
                    </div>
                </div>
            </Link>
        );
    }

    return null;
};

export default MenuCard;