// app/admin/users/page.tsx or wherever your route is
import React from "react"
import { columns } from "@/components/admin/UsersData/columns"
import { UserManagement } from "@/components/admin/UsersData/columns"
import DataTable from "@/components/admin/tableData/DataTable"
import { getUsers } from "@/lib/actions/user.actions"
import { User } from "lucide-react"

const UsersPage = async () => {
    const users: UserManagement[] = await getUsers()


    return (
        <div className="min-h-[calc(100vh-4rem)] w-full bg-muted/50 py-8">
            <div className="w-full px-2 sm:px-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <User className="w-6 h-6 text-orange-500" />
                            Users Management
                        </h1>
                        <p className="text-base text-muted-foreground mt-1">
                            Manage and monitor your restaurant users
                        </p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="rounded-2xl border bg-card shadow-lg p-0 sm:p-2 w-full overflow-x-visible">
                    <DataTable columns={columns} data={users} type="user" />
                </div>
            </div>
        </div>
    )
}

export default UsersPage
