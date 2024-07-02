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
                  <input type="text" class="form-control" placeholder="Buscar Contacto" v-model="searchText" />
                </div>
              </div>

              <div class="col-12 col-md-5 mb-2 mb-md-0">
                <!-- Segunda columna con el grupo de botones -->
                <div style="text-align: end" id="custom-button-group">
                  <button type="button" class="btn btn-outline-yellow mr-1 mb-1 mb-md-0" data-bs-toggle="modal" data-bs-target="#modalForm" v-show="hasPermissionTo(['contacts.record'])">
                    <i class="fas fa-plus mr-1"></i> Difusión
                  </button>
                  <button @click="openModal" type="button" class="btn btn-outline-warning mb-1 mb-md-0" v-show="hasPermissionTo(['contacts.create'])">
                    <i class="fas fa-trash mr-1"></i> Agregar Contacto
                  </button>
                  <button type="button" class="btn mb-1 mb-md-0 ml-1" v-show="hasPermissionTo(['contacts.delete'])">
                    <i class="fas fa-trash mr-1 font-base"></i>
                  </button>
                  <!-- Agrega más botones aquí si es necesario -->
                </div>
              </div>

              <div class="col-12 col-md-3">
                <!-- Tercera columna con el filtro -->
                <div class="dropdown" id="custom-dropdown">
                  <span class="mt-1 mr-1"> FILTRAR POR: </span>
                  <ul class="d-flex g-3">
                    <li class="preview-item">
                      <div class="btn-group">
                        <button type="button" for="drop-box" class="btn btn-yellow" style="width: 115px;">
                          Todos
                        </button>
                        <button type="button" id="drop-box"
                          class="btn btn-yellow dropdown-toggle dropdown-toggle-split d-flex justify-content-center"
                          data-bs-toggle="dropdown" aria-expanded="false" style="border-left: none; width: 45px;">
                          <em class="icon ni ni-chevron-down"></em>
                        </button>
                        <div class="dropdown-menu" style="">
                          <ul class="link-list-opt no-bdr">
                            <li>
                              <a href="#"><span>Todos</span></a>
                            </li>
                            <li>
                              <a href="#"><span>Victor Cáceres</span></a>
                            </li>
                            <li>
                              <a href="#"><span>Verónica Pérez</span></a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <DataTable :data="filteredData" :columns="columns" :options="dataTableOptions"
              class="table table-striped table-bordered display dsn-table" />
          </div>

          <ContactModalView v-if="showModal" :show-modal="showModal" :form-data="formData" @close-modal="closeModal"
            :modal-title="modalTitle" :modal-button-title="modalButtonTitle"></ContactModalView>

          <div class="modal" id="modalForm" tabindex="-1" role="dialog" aria-labelledby="modalForm">
            <div class="modal-dialog" style="width: 388px;" role="document">
              <div class="modal-content" style="background: white;">

                <div class="modal-body" style="height: 598px;">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="w-100 border-bottom me-3">
                      <p class="fw-semibold" style="font-size: 18px; font-family: 'Segoe UI'; color: #2D383C;">Mensaje de
                        difusión</p>
                    </div>
                    <div class="close fw-semibold" style="cursor: pointer;" data-bs-dismiss="modal" aria-label="Close"><em
                        class="icon ni ni-cross fs-3" style="color: #F8BC02;"></em></div>
                  </div>
                  <div class="mb-2" style="font-size: 14 px; font-family: 'Segoe UI'; color: #2D383C;">
                    Seleccione una o más opciones según la categoría de contactos que desee enviar el mensaje
                  </div>
                  <form action="#" class="form-validate is-alter">
                    <div class="form-group">
                      <ul class="custom-control-group g-3 align-start">
                        <!-- Use "align-start" to align items vertically -->
                        <li>
                          <div class="d-flex align-items-center">
                            <input type="checkbox" class="me-2 check-box" id="pay-card1" />
                            <label class="fw-semibold" for="pay-card1"
                              style="font-size: 16px; color: #2D383C; font-family: 'Segoe UI';">Seleccionar
                              categoría</label>
                          </div>
                        </li>
                        <li>
                          <div class="d-flex align-items-center">
                            <input type="checkbox" class="me-2 check-box" id="pay-card2" />
                            <label class="" for="pay-card2"
                              style="font-size: 16px; color: #2D383C; font-family: 'Segoe UI';">Frío</label>
                          </div>
                        </li>
                        <li>
                          <div class="d-flex align-items-center">
                            <input type="checkbox" class="me-2 check-box" id="pay-card3" />
                            <label class="" for="pay-card3"
                              style="font-size: 16px; color: #2D383C; font-family: 'Segoe UI';">Tibio</label>
                          </div>
                        </li>
                        <li>
                          <div class="d-flex align-items-center">
                            <input type="checkbox" class="me-2 check-box" id="pay-card4" />
                            <label class="" for="pay-card4"
                              style="font-size: 16px; color: #2D383C; font-family: 'Segoe UI';">Caliente</label>
                          </div>
                        </li>
                        <!-- <li v-for="(contact, index) in contacts" :key="index">
                          <div class="custom-control custom-control-sm custom-checkbox"
                            v-show="hasPermissionTo(['contacts.list'])">
                            <input type="checkbox" class="custom-control-input" id="pay-card" />
                            <label class="custom-control-label" for="pay-card">{{
                              contact.name
                            }}</label>
                          </div>
                        </li> -->
                      </ul>
                    </div>
                    <div class="d-flex flex-column justify-content-center ms-1" style="width: 326px;">
                      <div class="d-flex justify-content-between">
                        <div>
                          <p class="fw-semibold" style="font-size: 16px; font-family: 'Segoe UI'; color: #545454;">Mensaje
                          </p>
                        </div>
                        <div><button
                            style="width: 98px; height: 30px; border: 1px solid #A9A9A9; background: transparent; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom: none; color: #F8BC02; font-size: 14px; font-family: 'Segoe UI';"><em
                              class="icon ni ni-clip-v fs-6 me-1"></em>Adjuntar</button></div>
                      </div>
                      <div class="d-flex align-items-center mb-3">
                        <textarea class="" id="cp1-project-description" name="cp1-project-description"
                          placeholder="Escribir mensaje"
                          style="width: 100%; height: 166px; outline: none; border: 1px solid #A9A9A9; border-radius: 10px; border-top-right-radius: 0px; padding: 13px 10px 15px 20px;"></textarea>

                      </div>
                    </div>
                    <div class="form-group mt-2 center-button">
                      <button type="submit"
                        class="btn btn-lg btn-primary button-p d-flex justify-content-center align-items-center">
                        Enviar
                      </button>
                    </div>
                  </form>
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
import { computed, defineComponent, inject, onMounted, ref } from "vue";
import { useAuth } from "../../stores/auth";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import axios from "axios";
import type { Contact } from "@/model/Type";
import { usePermissionsStore } from '@/stores/permissions'

import ContactModalView from "./ContactModalView.vue";
import { ElMessage } from "element-plus";

DataTable.use(DataTablesCore);

export default defineComponent({
  components: {
    DataTable,
    ContactModalView,
  },

  setup() {
    const hasPermissionTo = usePermissionsStore().hasPermissionTo;
    const swal = inject("$swal");

    const showModal = ref(false);

    const contacts = ref<Array<Contact>>([]);
    const modalTitle = ref("");
    const modalButtonTitle = ref("");

    const formData = ref({});

    const headers = useAuth().headers();

    const columns = [
      {
        data: "select", // Use a unique key for checkbox column
        title: "", // Empty title for checkbox column
        orderable: false, // Disable sorting for the checkbox column
        render: () => '<input type="checkbox">', // Render checkbox input
      },
      {
        data: "name",
        title: "Nombre Completo",
        render: (data: string, type: string, row: any) =>
          `${data}`,
      },
      { data: "num_phone", title: "Teléfono" },
      { data: "interes_en", title: "Interés en" },
      {
        data: null,
        title: "Asesor",
        render: () => "Carlos",
      },
      {
        data: "status",
        title: "Estado",
        render: (data: number) => {
          let estadoTexto = "";
          let estadoClase = "";

          switch (data) {
            case 1:
              estadoTexto = "Frio";
              estadoClase = "bg-outline-primary";
              break;
            case 2:
              estadoTexto = "Tibio";
              estadoClase = "bg-outline-success";
              break;
            case 3:
              estadoTexto = "Caliente";
              estadoClase = "bg-outline-danger";
              break;
            default:
              estadoTexto = "Desconocido";
              estadoClase = "bg-outline-secondary";
              break;
          }

          return `<span class="badge rounded-pill badge-dim ${estadoClase}">${estadoTexto}</span>`;
        },
      },
      {
        data: null,
        title: "Razón de cierre",
        render: () => "Venta",
      },
      {
        data: "created_at",
        title: "Fecha de creación",
        render: (data: string) => {
          const fecha = new Date(data);
          const fechaFormateada = fecha
            .toISOString()
            .replace(/T/, " ")
            .replace(/\..+/, "");
          return fechaFormateada;
        },
      },
      {
        data: null,
        title: "Acciones",
        orderable: false,
        render: (data: string, type: string, row: any) => {
          const recordId = row.id;
          if (hasPermissionTo(['contacts.edit']) == true && hasPermissionTo(['contacts.delete']) == true) {
            return `
      <button class="btn btn-warning edit-button" data-row='${JSON.stringify(
            row
          )}'>
        <i class="fas fa-pencil-alt"></i> 
      </button>
      <button class="btn btn-danger delete-button" data-id='${recordId}'>
        <i class="fas fa-trash"></i>
      </button>`;
          }
          else if (hasPermissionTo(['contacts.edit']) == true) {
            return `
      <button class="btn btn-warning edit-button" data-row='${JSON.stringify(
              row
            )}'>
        <i class="fas fa-pencil-alt"></i> 
      </button>`
          }
          else if (hasPermissionTo(['contacts.delete']) == true) {
            return `
      <button class="btn btn-danger delete-button" data-id='${recordId}'>
        <i class="fas fa-trash"></i>
      </button>
    `;
          }else {

          }
        },
      },
    ];

    document.addEventListener("click", function (event) {
      const target = event.target as HTMLElement;

      const editButton = target.closest(".edit-button");
      const deleteButton = target.closest(".delete-button");

      if (editButton) {
        const dataContact = editButton.getAttribute("data-row");
        if (dataContact !== null) {
          const parsedData = JSON.parse(dataContact);
          openModal2(parsedData);
        }
      }
      if (deleteButton) {
        const idContact = deleteButton.getAttribute("data-id");
        if (idContact !== null) {
          deleteContact(idContact);
        }

        event.stopPropagation();
      }
    });

    const dataTableOptions = {
      responsive: true,
      autoWidth: false,
      bLengthChange: false,
      pageLength: 2,
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
          `${import.meta.env.VITE_API_URL}/contacts/list`,
          headers
        );

        contacts.value = response.data.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const handleConfirm = () => { };

    const searchText = ref("");

    const filteredData = computed(() => {
      if (!searchText.value) {
        return contacts.value;
      }
      const search = searchText.value.toLowerCase();
      return contacts.value.filter(
        (contact) =>
          contact.name.toLowerCase().includes(search) ||
          contact.num_phone.includes(search)
      );
    });

    const openModal = (data: {}) => {
      formData.value = data ? { ...data } : {};
      showModal.value = true;
      modalTitle.value = "Agregar Asesor";
      modalButtonTitle.value = "Registrar";
    };

    const deleteContact = async (contactId: any) => {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/contacts/delete/${contactId}`,
          headers
        );
        if (response.status === 204) {
          ElMessage({
            message: "Registro eliminado exitosamente",
            type: "success",
          });
          fetchContacts();
          console.log("Registro eliminado exitosamente");
        }
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
      }
    };

    const openModal2 = (data: {}) => {
      formData.value = data ? { ...data } : {};
      showModal.value = true;
      modalTitle.value = "Editar Asesor";
      modalButtonTitle.value = "Guardar";
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
      contacts,
      openModal,
      closeModal,
      openModal2,
      columns,
      showModal,
      deleteContact,
      modalTitle,
      modalButtonTitle,
      searchText,
      dataTableOptions,
      formData,
      filteredData,
      hasPermissionTo
    };
  },
});
</script>

<style scoped>
/* cambios */
.check-box {
  appearance: none;
  width: 22px;
  height: 22px;
  cursor: pointer;
  background: transparent;
  border: 2px solid #F8BC02;
  border-radius: 5px;
  outline: #F8BC02;
  color: black;
}

.check-box:checked {
  background: #F8BC02;
}

.button-p {
  width: 130px;
  height: 44px;
  background: #F8BC02;
  color: #2d383c;
  border: 2px solid #F8BC02;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Segoe UI';
}

.button-p:hover {
  background: transparent;
  color: #F8BC02;
}

/* cambios-end */
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
</style>
