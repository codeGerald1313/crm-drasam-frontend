<script lang="ts">
import {
  reactive,
  defineComponent,
  onMounted,
  toRef,
  type PropType,
  ref,
} from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuth } from "../../stores/auth";

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    formData: {
      type: Object as PropType<Record<string, any>>,
      default: () => {},
    },
    modalTitle: String,
    modalButtonTitle: String,
  },
  setup(props, { emit }) {
    const headers = useAuth().headers();

    const form = reactive(props.formData);

    const show = toRef(props, "showModal");

    const closeModal = () => {
      emit("closeModal");
    };

    const saveUser = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/contacts/create`,
          props.formData,
          headers
        );

        if (response.status === 201) {
          ElMessage({
            message: response.data.message,
            type: "success",
          });
          closeModal();
        } else {
          console.error("Error al realizar la operación: " + response);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 422) {
          const validationErrors = error.response.data.errors;

          showAlertWithErrors(validationErrors);
        } else {
          console.log("Error al editar el usuario", error);
        }
      }
    };

    const showAlertWithErrors = (errros: Error) => {
      const errorMessage = Object.values(errros).flat().join("\n");
      alert("Errores de validación:\n" + errorMessage);
    };

    onMounted(() => {});

    return {
      show,
      closeModal,
      saveUser,
      form,
    };
  },
});
</script>

<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0, 0, 0, 0.5)"
    id="agregar-datos"
    tabindex="-1"
    v-if="show"
  >
    <div class="modal-dialog modal-editar-dialog">
      <div class="modal-content modal-width justify-content-end modal-editar">
        <div class="modal-header">
          <h5
            class="modal-title w-100 border-bottom text-black"
            id="exampleModalLabel"
          >
            {{ modalTitle }}
          </h5>
          <button
            @click="closeModal"
            class="btn-close"
            aria-label="Cerrar"
          ></button>
        </div>
        <div class="ms-4 fs-5 text-black">Datos del contacto:</div>
        <div class="modal-body form-editar me-3">
          <div class="mb-2">
            <li class="text-black fs-6 mb-1">Nombre</li>
            <div class="form-control-wrap">
              <input
                v-model="formData.name"
                type="text"
                class="form-control editar-input"
              />
            </div>
          </div>
          <div class="mb-2">
            <li class="text-black fs-6 mb-1">Numero de WhatsApp</li>
            <div class="form-control-wrap">
              <input
                v-model="formData.num_phone"
                type="text"
                class="form-control editar-input"
              />
            </div>
          </div>
          <div class="mb-2">
            <li class="text-black fs-6 mb-1">Interés/consulta sobre</li>
            <div class="form-control-wrap">
              <input
                v-model="formData.interes_en"
                type="text"
                class="form-control editar-input"
              />
            </div>
          </div>
          <div class="mb-2">
            <li class="text-black fs-6 mb-1">Asignar a</li>
            <div class="form-control-wrap d-flex w-100">
              <select
                class="form-select form-select-sm select-agregar w-100"
                aria-label=".form-select-sm example"
              >
                <option hidden selected>Seleccione Asesor</option>
                <option value="1">Victor Cáceres</option>
                <option value="2">Verónica Pérez</option>
              </select>
              <div class="d-flex select-agregar-icon">
                <em class="icon ni ni-chevron-down fs-4 w-0"></em>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <li class="text-black fs-6 mb-1">Seleccione razón de cierre</li>
            <div class="form-control-wrap d-flex w-100">
              <select
                class="form-select form-select-sm select-agregar w-100"
                aria-label=".form-select-sm example"
              >
                <option hidden selected>Seleccione razón de cierre</option>
                <option value="1">Victor Cáceres</option>
                <option value="2">Verónica Pérez</option>
              </select>
              <div class="d-flex select-agregar-icon">
                <em class="icon ni ni-chevron-down fs-4 w-0"></em>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-center">
            <button
              @click.prevent="saveUser()"
              class="btn btn btn-warning mb-3 mt-2 b-aceptar d-flex align-items-center justify-content-center text-dark fs-6"
            >
              {{ modalButtonTitle }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/css/Bandeja.css";
</style>
