<template>
  <div class="nk-content">
    <div class="container-fluid">
      <div class="nk-content-inner">
        <div class="nk-content-body">
          <div class="table-responsive">
            <div class="row mb-3">
              <div class="col-12 col-md-4 mb-2 mb-md-0">
                <!-- Primera columna con el campo de búsqueda -->
                <div class="form-group has-search">
                  <span class="fa fa-search form-control-feedback"></span>
                  <input type="text" class="form-control" placeholder="Buscar asesor" v-model="searchText" />
                </div>
              </div>

              <div class="col-12 col-md-2 mb-2 mb-md-0"></div>

              <div class="col-12 col-md-6">
                <div style="text-align: end" id="custom-button-group">
                  <button type="button" class="btn btn-outline-warning mr-1 mb-1 mb-md-0" data-bs-toggle="modal"
                    data-bs-target="#modalAnswerFast">
                    <i class="fas fa-trash mr-1"></i> Respuestas rápidas del equipo
                  </button>
                  <button @click.prevent="openModal" type="button" class="btn btn-outline-yellow mr-1 mb-1 mb-md-0">
                    <i class="fas fa-plus mr-1"></i> Agregar Asesor
                  </button>
                  <button type="button" class="btn mb-1 mb-md-0">
                    <i class="fas fa-trash mr-1 font-base"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="container-table">
              <DataTable :data="filteredData" :columns="columns" :options="dataTableOptions"
                class="table table-striped table-bordered display dsn-table" />
            </div>

            <EquipoModalView v-if="showModal" :show-modal="showModal" :form-data="formData" @close-modal="closeModal"></EquipoModalView>
          </div>
          <div class="modal" id="modalAnswerFast" tabindex="-1" role="dialog" aria-labelledby="modalAnswerFast">
            <div class="modal-dialog" style="width: 388px;" role="document">
              <div class="modal-content" style="background: white;">
                <div class="modal-header">
                  <h5 class="modal-title">Respuestas rápidas</h5>
                  <a href="#" class="close" data-bs-dismiss="modal" aria-label="Close"><em class="icon ni ni-cross"></em></a>
                </div>
                <div class="modal-body" style="padding: 0px;">
                  <ul class="nav nav-tabs" role="tablist">
                    <div class="d-flex">
                      <div class="d-flex align-items-center justify-content-center fw-semibold"
                        style="width: 183px; height: 44px; font-size: 16px; background: #f8bc02;">
                        <p>Plantillas</p>
                      </div>
                      <div class="d-flex align-items-center justify-content-center fw-semibold"
                        style="width: 208px; height: 44px; font-size: 16px;">
                        <p>Crear nuevas respuestas</p>
                      </div>
                    </div>
                  </ul>
                  <form action="" class="p-3">
                    <div class="form-group">
                      <div class="d-flex align-items-center justify-content-end">
                        <input type="text" class="form-control input-AB" id="default-04" placeholder="Buscar Respuesta" />
                        <em class="icon ni ni-search position-absolute mt-1 me-3 color-y fs-5"></em>
                      </div>

                    </div>
                    <div class="form-group">
                      <div class="form-control-wrap" style="height: 160px;">
                        ...
                      </div>
                      <div class="flex justify-center p-4">
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="modal" id="modalAnswerFast" tabindex="-1" role="dialog" aria-labelledby="modalAnswerFast">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Mensaja de Difusión</h5>
                  <a href="#" class="close" data-bs-dismiss="modal" aria-label="Close"><em
                      class="icon ni ni-cross"></em></a>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer bg-light">
                  <span class="sub-text">Modal Footer Texts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAuth } from "../../stores/auth";
import DataTable from "datatables.net-vue3";
import DataTablesCore, { type ConfigColumns } from "datatables.net-bs5";
import axios from "axios";
import type { Advisor } from "@/model/Type";
import EquipoModalView from "./EquipoModalView.vue";
import { ElMessage } from "element-plus";

DataTable.use(DataTablesCore);

export default defineComponent({
  components: {
    DataTable,
    EquipoModalView,
  },

  setup() {

    const showModal = ref(false);
    const users = ref<Array<Advisor>>([]);

    const formData = ref({});

    const headers = useAuth().headers();

    const columns: ConfigColumns[] = [
      {
        data: "select",
        title: "",
        orderable: false,
        render: () => '<input type="checkbox">',
      },
      {
        data: "name",
        title: "Nombre",
        render: (data: string, type: string, row: any) =>
          `${data} ${row.last_name}`,
      },
      { data: "role", title: "Rol" },
      { data: "email", title: "E-mail" },

      {
        data: "password",
        title: "Contraseña",
        render: function (data: any, type: string, row: any) {
          if (type === "display") {
            return `<input type="password" class="password-input" value="" placeholder="*********" data-user-id="${row.id}">`;
          }
          return data;
        },
      },

      {
        data: "status",
        title: "Estado",
        render: (data: string) => {
          if (data !== "1") {
            return `<span class="badge rounded-pill badge-dim btn-green" style="font-weight: bold; color: black;">En seguimiento</span>`;
          } else {
            return `<span class="badge rounded-pill badge-dim bg-outline-success" style="font-weight: bold; color: black;">Concretado</span>`;
          }
        },
      },
      {
        title: "Acciones",
        orderable: false,
        render: (data: string, type: string, row: any) => {
          return `
            <button class="btn btn-warning" data-action="editar" data-id="${row.id}">
              <i class="fas fa-pencil-alt"></i>
            </button>
          `;
        },
      },
    ];

    const dataTableOptions = {
      responsive: true,
      autoWidth: false,
      bLengthChange: false,
      pageLength: 5,
      dom: "rtip",
      language: {
        search: "Buscar",
        zeroRecords: "No hay registros en su búsqueda",
        info: "Mostrando del _START_ a _END_ de _TOTAL_ registros",
        infoFiltered: "(Filtrados de _MAX_ registros)",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último",
        },
      },
    };

    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/records`,
          headers
        );
        users.value = response.data.users;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    document.addEventListener("click", async function (event) {
      const target = event.target as HTMLElement;

      if (target instanceof HTMLElement) {
        const editButton = target.closest(".btn-warning[data-id]");

        if (editButton) {
          const userId = editButton.getAttribute("data-id");

          if (userId !== null) {
            const userIdNumber = parseInt(userId);

            const selectedContact = users.value.find(
              (user) => user.id === userIdNumber
            );

            if (selectedContact) {
              openModal(selectedContact);
            }
          }
        }
      }
    });

    document.addEventListener("keyup", async function (event) {
      const target = event.target as HTMLElement;
      if (
        event.key === "Enter" &&
        target.classList.contains("password-input")
      ) {
        const inputValue = (target as HTMLInputElement).value;
        const userIdAttr = target.getAttribute("data-user-id");

        if (userIdAttr !== null) {
          const userId = parseInt(userIdAttr);
          try {
            const response = await axios.put(
              `${import.meta.env.VITE_API_URL}/users/update-password/${userId}`,
              { password: inputValue },
              headers
            );

            if (response.status === 200) {
              ElMessage.success("Contraseña actualizada exitosamente");
            } else {
              console.error("Error al actualizar la contraseña");
            }
          } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
          }
        }
      }
    });

    const handleConfirm = () => { };

    const searchText = ref("");

    const filteredData = computed(() => {
      if (!searchText.value) {
        return users.value;
      }
      const search = searchText.value.toLowerCase();
      return users.value.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.last_name.toLowerCase().includes(search) ||
          user.email.includes(search)
      );
    });

    const openModal = (data: {}) => {
      formData.value = data ? { ...data } : {};
      showModal.value = true;
    };

    const closeModal = () => {
      fetchContacts();
      showModal.value = false;
    };

    onMounted(() => {
      fetchContacts();
    });

    return {
      handleConfirm,
      users,
      columns,
      searchText,
      dataTableOptions,
      filteredData,
      openModal,
      showModal,
      formData,
      closeModal,
    };
  },
});
</script>

<style scoped>
/* cambios */
.color-y {
  color: #f8bc02;
}

.input-AB {
  height: 42px;
  border: 1px solid #d2d2d2;
  border-radius: 10px;
  outline: none;
  padding-left: 12px;
  margin-top: 10px;
}

/* fin cambios */
.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #f8bc02;
  right: 0;
}

@media (max-width: 576px) {
  #custom-button-group button {
    display: block;
    width: 100%;
  }

  #custom-dropdown {
    display: flex;
    justify-content: center;
  }
}

.ml-5 {
  margin-left: 5rem;
}

.ml-3 {
  margin-left: 2rem;
}

.ml-1 {
  margin-left: 1rem;
}

.mr-3 {
  margin-right: 3rem;
}

.mr-1 {
  margin-right: 1rem;
}

.btn-icon-text {
  margin-right: 5rem !important;
}

.align-start {
  display: flex;
  flex-direction: column;
}

.mt-2 {
  margin-top: 2rem;
}

.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-outline-warning {
  border-radius: 20px;
}

.data-button {
  margin-left: 4rem !important;
}

.table.dataTable thead th {
  background-color: #fff4d7;
  border-color: #fff4d7;
  color: #2d383c;
}

.btn-outline-yellow {
  color: #f8bc02;
  border-color: #f8bc02;
  border-radius: 20px;
}

.btn-outline-yellow:hover {
  color: #fff;
  background-color: #eec250;
  border-color: #eec250;
  border-radius: 20px;
}

.font-base {
  font-size: 1.3rem;
}

.font-base:hover {
  color: #eec250;
}

.btn-yellow {
  color: #eec250;
  border-color: #eec250;
}

.btn-yellow:hover {
  color: #eec250;
  border-color: #eec250;
}

.table-responsive {
  overflow-x: hidden;
}

.modal.left .modal-dialog,
.modal.right .modal-dialog {
  position: fixed;
  margin: auto;
  width: 920px;
  height: 100%;
  -webkit-transform: translate3d(0%, 0, 0);
  -ms-transform: translate3d(0%, 0, 0);
  -o-transform: translate3d(0%, 0, 0);
  transform: translate3d(0%, 0, 0);
}

.modal.left .modal-content,
.modal.right .modal-content {
  height: 100%;
  overflow-y: auto;
}

.modal.left .modal-body,
.modal.right .modal-body {
  padding: 15px 15px 80px;
}

.modal.right.fade .modal-dialog {
  right: 0;
  -webkit-transition: opacity 0.3s linear, right 0.3s ease-out;
  -moz-transition: opacity 0.3s linear, right 0.3s ease-out;
  -o-transition: opacity 0.3s linear, right 0.3s ease-out;
  transition: opacity 0.3s linear, right 0.3s ease-out;
}

.modal.right.fade.in .modal-dialog {
  left: 0;
}

.modal-content {
  border-radius: 0;
  border: none;
}

.modal-header {
  border-bottom-color: #eeeeee;
  background-color: #fafafa;
}

.btn-yellow-color {
  background: #f8bc02;
  border-radius: 20px;
  color: #2d383c;
}

.btn-yellow-color:hover {
  background: #f8bc02;
  border-color: #000000;
  color: #2d383c;
  border-radius: 20px;
  font-weight: 700;
}

.btn-green {
  color: #16ad09;
  border-color: #16ad09;
}

.btn-green:hover {
  color: #fff;
  background: #16ad09;
}

.nav {
  display: flex;
}

.nav-item {
  flex: 1;
  text-align: center;
  background-color: #f8bc02;
  color: #2d383c;
}

.nav-link {
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
}

.nav-tabs .nav-link.active {
  color: #2d383c;
  border: none;
  background-color: rgba(0, 0, 0, 0);
}

.nav-tabs .nav-link:after {
  left: 0;
  right: 0;
  bottom: 0;
  height: 0;
  opacity: 0;
}

.modal-body {
  padding: 0;
}

@media (min-width: 576px) {
  .modal-body {
    padding: 0;
  }
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 0 3px;
}
</style>
