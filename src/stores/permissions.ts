import { defineStore } from "pinia";
import { useAuth } from "./auth";

export const usePermissionsStore = defineStore({
    id: 'permissions',
    state: () => ({
        userPermissions: useAuth().user.permissions ? useAuth().user.permissions : [],
        userRole: useAuth().user.role ? useAuth().user.roles : [],
        user_data: useAuth().user
    }),
    actions: {
        getUserData() {
            return this.user_data;
        },
        hasRole(userRole: string | string[]) {
			if (Array.isArray(userRole)) {
				return userRole.find(u => {
					return this.getUserData().roles.find((r: any) => u == r.name)
				}) != undefined
			} else {
				return this.getUserData().roles.find((r: any) => userRole == r.name) != undefined
			}
		},
		hasPermissionTo(userPermissions: string | string[]) {
			if (Array.isArray(userPermissions)) {
				return userPermissions.find(u => {
					return this.getUserData().permissions.find((r: any) => u == r.name)
				}) != undefined
			} else {
				return this.getUserData().permissions.find((r: any) => userPermissions == r.name) != undefined
			}
		}
    }
});