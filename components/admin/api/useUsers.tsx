// useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getUsers, deleteUser } from "@/lib/actions/user.actions"
import { Users } from "@/components/admin/UsersData/columns"

export const useGetUsers = () => {
    return useQuery<Users[], Error>({
        queryKey: ["users"],
        queryFn: getUsers,
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (clerkId: string) => deleteUser(clerkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}
