import { QueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { getUsers, deleteUser } from "@/lib/actions/user.actions"
import { UserManagement } from "@/components/admin/UsersData/columns"

export const useGetUsers = () => {
    return useQuery<UserManagement[], Error>({
        queryKey: ["users"],
        queryFn: () => getUsers(),
    })
}


export const useDeleteUser = (clerkId: string) => {
    const queryClient = new QueryClient()
    return useMutation<UserManagement, Error, string>({
        mutationFn: () => deleteUser(clerkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}
