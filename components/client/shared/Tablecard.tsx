import Image from "next/image";



const TableCard = ({ table }: { table: any }) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden max-w-sm mx-auto mb-6 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
                <Image
                    src={table.strMealThumb}
                    alt={table.strMeal}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2 truncate">{table.strMeal}</h2>
                <p className="text-sm text-gray-600 mb-2">Category: {table.strCategory}</p>
                <p className="text-sm text-gray-600 mb-4">Area: {table.strArea}</p>
                <p className="text-sm line-clamp-3 text-gray-700">{table.strInstructions}</p>
            </div>
        </div>
    );
};

export default TableCard;