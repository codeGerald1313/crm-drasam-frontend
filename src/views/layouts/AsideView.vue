<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth';
import { useNavTitle } from '@/stores/navtitle';
import { usePermissionsStore } from '@/stores/permissions'

export default defineComponent({
    setup() {
        let hasPermissionTo = usePermissionsStore().hasPermissionTo;
        const router = useRouter();
        const navTitle = useNavTitle();

        const handleLogout = () => {
            useAuth().logout();
            router.push("/login");
        }

        const handleModuleSelect = (name: string) => {
            navTitle.updateTitle(name);
        };

        return {
            handleLogout,
            handleModuleSelect,
            hasPermissionTo
        }
    }
});
</script>

<template>
    <div class="nk-apps-sidebar is-theme">
        <div class="nk-apps-brand">
            <RouterLink to="/" class="logo-link">
                <img class="logo-light mt-3 logo-img" src="../../assets/images/icons/logo-aside.png" alt="logo" />
            </RouterLink>
        </div>
        <div class="nk-sidebar-element">
            <div class="nk-sidebar-body">
                <div class="nk-sidebar-content" data-simplebar>
                    <div class="nk-sidebar-menu">
                        <ul class="nk-menu apps-menu">
                            <li class="nk-menu-item" v-show="hasPermissionTo(['dashboard'])">
                                <RouterLink to="/" class="nk-menu-link" :class="{ 'active-side-item': $route.path === '/' }"
                                    @click="handleModuleSelect('Visión general')" title="Inicio">
                                    <span class="nk-menu-icon"><em class="icon ni ni-home icon-side"></em></span>
                                </RouterLink>
                            </li>
                            <li class="nk-menu-item" v-show="hasPermissionTo(['data'])">
                                <RouterLink to="/bandeja" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/bandeja' }"
                                    @click="handleModuleSelect('Chats')" title="Chats">
                                    <span class="nk-menu-icon"><em class="icon ni ni-whatsapp icon-side"></em></span>
                                </RouterLink>
                            </li>
                            <li class="nk-menu-item" v-show="hasPermissionTo(['contacts'])">
                                <RouterLink to="/contacto" class="nk-menu-link" title="Contacto"
                                    :class="{ 'active-side-item': $route.path === '/contacto' }"
                                    @click="handleModuleSelect('Contactos')"><span class="nk-menu-icon"><em
                                            class="icon ni ni-user-list-fill icon-side"></em></span></RouterLink>
                            </li>
                            <li class="nk-menu-item">
                                <RouterLink to="/desktop" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/desktop' }"
                                    @click="handleModuleSelect('Informes')" title="Informes">
                                    <span class="nk-menu-icon"><em class="icon ni ni-file-text icon-side"></em></span>
                                </RouterLink>
                            </li>
                            <li class="nk-menu-item" v-show="hasPermissionTo(['users'])">
                                <RouterLink to="/equipo" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/equipo' }"
                                    @click="handleModuleSelect('Equipo')" title="Equipo">
                                    <span class="nk-menu-icon">
                                        <img src="../../assets/images/icons/equipo.png"
                                            class="icon ni ni-user-add-fill icon-side">
                                    </span>
                                </RouterLink>
                            </li>

                            <li class="nk-menu-item" v-show="hasPermissionTo(['conexion'])">
                                <RouterLink to="/conexion" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/conexion' }"
                                    @click="handleModuleSelect('Conexiones')" title="Conexiones">
                                    <span class="nk-menu-icon"><em class="icon ni ni-rss icon-side"></em></span>
                                </RouterLink>
                            </li>

                            <li class="nk-menu-item" v-show="hasPermissionTo(['permissions'])">
                                <RouterLink to="/role" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/role' }"
                                    @click="handleModuleSelect('Roles y permisos')" title="Roles y Permisos">
                                    <span class="nk-menu-icon"><em class="icon ni ni-security icon-side"></em></span>
                                </RouterLink>
                            </li>

                            <li class="nk-menu-item" v-show="hasPermissionTo(['quickly_answers'])">
                                <RouterLink to="/config" class="nk-menu-link"
                                    :class="{ 'active-side-item': $route.path === '/config' }"
                                    @click="handleModuleSelect('Configuración')" title="Configuración">
                                    <span class="nk-menu-icon"><em class="icon ni ni-setting icon-side"></em></span>
                                </RouterLink>
                            </li>

                            <li class="nk-menu-item">
                                <a href="javascript:void(0);" @click="handleLogout" class="nk-menu-link"
                                    title="Salir del sistema"><span class="nk-menu-icon"><em
                                            class="icon ni ni-power icon-side"></em></span></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.logo-link {
    width: 180px;
}

.icon-side {
    font-size: 35px !important;
}

.nk-menu-icon {
    color: #fff !important;
}

.nk-apps-sidebar.is-theme {
    background: #131B1E;
    border-color: #131B1E;
}

.is-theme .active>.nk-menu-link {
    color: #fff;
}

.active-side-item {
    background-color: #F8BC02;
}

.nk-apps-brand .logo-link {
    padding: 1rem 0.5rem 0.9rem;
}

@media (min-width: 992px) {
    .nk-apps-sidebar {
        width: 60px;
    }
}</style>