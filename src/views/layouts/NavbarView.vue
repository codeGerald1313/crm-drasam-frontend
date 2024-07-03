<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { useNavTitle } from "@/stores/navtitle";
import { usePermissionsStore } from "@/stores/permissions";
import { acitivitiesInLive } from "@/stores/activity";
import type { Notificacion } from "@/model/Type";

export default defineComponent({
  setup() {
    const hasPermissionTo = usePermissionsStore().hasPermissionTo;
    const { user } = useAuth();
    const router = useRouter();
    const useTitle = useNavTitle();
    const notifications = ref([] as Notificacion[]);
    const useConversation = acitivitiesInLive();

    const fetchNotificationss = async () => {
      try {
        const aca = await useConversation.fetchNotifications();

        notifications.value = aca.notifications;
        console.log(notifications.value);
      } catch (error) {
        console.error("Error al obtener Notifiaciones:", error);
      }
    };

    const handleLogout = () => {
      useAuth().logout();
      router.push("/login");
    };

    const handleModuleSelect = (name: string) => {
      useTitle.updateTitle(name);
    };

    onMounted(async () => {
      fetchNotificationss();

      window.Echo.channel("remenber-events").listen(
        "ListenRemenberEvent",
        (data: any) => {

          const existingActivityIndex = notifications.value.findIndex(
            (notification) => notification.id === data.remenber.id
          );

          if (existingActivityIndex !== -1) {
            notifications.value[existingActivityIndex].contact_name =
              data.contact.name;
            notifications.value[existingActivityIndex].last_activity =
              data.remenber.date_to_remenber +
              " " +
              data.remenber.time_to_remenber;
            notifications.value[existingActivityIndex].advisorName =
              data.advisor.name;
          } else {
            notifications.value.push({
              id: data.remenber.id,
              contact_name: data.contact.name,
              last_activity:
                data.remenber.date_to_remenber +
                " " +
                data.remenber.time_to_remenber,
              advisorName: data.advisor.name,
            });

            console.log(notifications.value);
          }
        }
      );

      window.Echo.channel("reminder-deleted").listen(
        "ReminderDeleted",
        (e: any) => {

          console.log(e)

          const notificationToDelete = notifications.value.find(
            (notification) => {
              return notification.id === e.reminderId;
            }
          );

          if (notificationToDelete) {
            const index = notifications.value.indexOf(notificationToDelete);
            if (index !== -1) {
              notifications.value.splice(index, 1);
            }
          }
        }
      );
    });
    return {
      user,
      notifications,
      handleLogout,
      handleModuleSelect,
      useTitle,

      hasPermissionTo,
    };
  },
});
</script>

<template>
  <div class="nk-header nk-header-fixed is-light">
    <div class="container-fluid">
      <div class="nk-header-wrap">
        <div class="nk-header-app-name">
          <div class="nk-header-app-info">
            <a href="javascript:void(0)" class="nk-menu-link p-0">
              <span class="nk-menu-text">{{ useTitle.title }}</span>
            </a>
          </div>
        </div>
        <div class="nk-header-tools">
          <ul class="nk-quick-nav">
     

            <li class="dropdown list-apps-dropdown d-lg-none">
              <a
                href="#"
                class="dropdown-toggle nk-quick-nav-icon"
                data-bs-toggle="dropdown"
              >
                <div class="icon-status icon-status-na">
                  <em class="icon ni ni-menu-circled"></em>
                </div>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                <div class="dropdown-body">
                  <ul class="list-apps">
                    <li>
                      <RouterLink
                        to="/"
                        @click="handleModuleSelect('Visión general')"
                      >
                        <span class="list-apps-media"
                          ><em class="icon ni ni-home icon-side"></em
                        ></span>
                        <span class="list-apps-title"
                          >Visión general</span
                        ></RouterLink
                      >
                    </li>
                    <li v-show="hasPermissionTo(['data'])">
                      <RouterLink
                        to="/bandeja"
                        @click="handleModuleSelect('Chats')"
                      >
                        <span class="list-apps-media"
                          ><em class="icon ni ni-whatsapp bg-info-dim"></em
                        ></span>
                        <span class="list-apps-title">Chats</span></RouterLink
                      >
                    </li>
                    <li v-show="hasPermissionTo(['contacts'])">
                      <a href="#">
                        <span class="list-apps-media"
                          ><em
                            class="icon ni ni-user-list-fill bg-warning-dim"
                          ></em
                        ></span>
                        <span class="list-apps-title">Contactos</span></a
                      >
                    </li>
                    <li>
                      <a href="#">
                        <span class="list-apps-media"
                          ><em class="icon ni ni-file-text bg-success-dim"></em
                        ></span>
                        <span class="list-apps-title">Informes</span></a
                      >
                    </li>
                    <li>
                      <a href="#" v-show="hasPermissionTo(['users'])">
                        <span class="list-apps-media"
                          ><em
                            class="icon ni ni-user-add-fill bg-purple-dim"
                          ></em
                        ></span>
                        <span class="list-apps-title">Equipo</span></a
                      >
                    </li>
                    <li>
                      <RouterLink
                        to="/conexion"
                        @click="handleModuleSelect('Conexiones')"
                        v-show="hasPermissionTo(['conexion'])"
                      >
                        <span class="list-apps-media"
                          ><em class="icon ni ni-rss bg-secondary-dim"></em
                        ></span>
                        <span class="list-apps-title"
                          >Conexiones</span
                        ></RouterLink
                      >
                    </li>
                    <li>
                      <RouterLink
                        to="/config"
                        @click="handleModuleSelect('Configuración')"
                        v-show="hasPermissionTo(['quickly_answers'])"
                      >
                        <span class="list-apps-media"
                          ><em class="icon ni ni-setting bg-danger-dim"></em
                        ></span>
                        <span class="list-apps-title"
                          >Configuración</span
                        ></RouterLink
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <strong>{{ user.email }}</strong>
            <li class="dropdown user-dropdown">
              <a
                href="#"
                class="dropdown-toggle me-n1"
                data-bs-toggle="dropdown"
              >
                <div class="user-toggle">
                  <div class="user-avatar sm icon-general">
                    <em class="icon ni ni-user-alt"></em>
                  </div>
                </div>
              </a>

              <div class="dropdown-menu dropdown-menu-md dropdown-menu-end">
                <div
                  class="dropdown-inner user-card-wrap bg-lighter d-none d-md-block"
                >
                  <div class="user-card">
                    <div class="user-avatar icon-general"><span>JC</span></div>
                    <div class="user-info">
                      <span class="lead-text">{{ user.name }}</span
                      ><span class="sub-text">{{ user.email }}</span>
                    </div>
                  </div>
                </div>
                <div class="dropdown-inner">
                  <ul class="link-list">
                    <li>
                      <a href="#"
                        ><em class="icon ni ni-user-alt"></em
                        ><span>Perfil</span></a
                      >
                    </li>
                    <li>
                      <a href="#"
                        ><em class="icon ni ni-setting-alt"></em
                        ><span>Configuracion</span></a
                      >
                    </li>
                  </ul>
                </div>
                <div class="dropdown-inner">
                  <ul class="link-list">
                    <li>
                      <a href="javascript:void(0);" @click="handleLogout"
                        ><em class="icon ni ni-signout"></em
                        ><span>Salir</span></a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 992px) {
  .nk-apps-sidebar + .nk-main > .nk-wrap > .nk-header-fixed {
    left: 60px;
  }
}

.recordatorio-text {
  font-weight: bold;
}

.agendado-text {
  font-weight: bold; 
}



</style>
