"use client"

import { useQuery } from "@tanstack/react-query"
import { ICategory } from "@/lib/Database/models/categoryModel"
import { getCategory } from "@/lib/actions/category.action"

export const useGetCategories = () => {
    return useQuery<ICategory[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const data = await getCategory()
            if (data?.error) {
                throw new Error(data.error)
            }
            return data?.data || []
        },
    })
}