import { useQuery } from "@tanstack/react-query";

interface QueryProps {
    query: string | undefined;
}

const fetchData = async ({ query }: QueryProps) => {
    const url = query
        ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
        : "https://www.themealdb.com/api/json/v1/1/search.php?s";

    const response = await fetch(url, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const data = await response.json();
    if (!data) {
        throw new Error("No data found");
    }

    return data;
};

export const useGetData = (query: string | undefined) => {
    return useQuery({
        queryKey: ['menu', { query }],
        queryFn: () => fetchData({ query })
    });
};