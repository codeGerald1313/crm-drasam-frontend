<script lang="ts">
import { reactive, ref, defineComponent, onMounted, toRef, type PropType } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useAuth } from "../../stores/auth";
import type { Roles } from '@/model/Type';
import moment from "moment";

export default defineComponent({
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
    formData: {
      type: Object as PropType<Record<string, any>>,
      default: () => { },
    }
  },
  setup(props, { emit }) {
    const headers = useAuth().headers();

    const form = reactive(props.formData);
    // form.hour_start = ref('00:00');
    // form.hour_end = ref('23:59');

    const show = toRef(props, "showModal");

    const roles = ref<Array<Roles>>([]);

    const closeModal = () => {
      emit("closeModal");
    };

    const getRoles = async () => {
      const responseRoles = await axios.get(`${import.meta.env.VITE_API_URL}/roles/list`, headers);
      roles.value = responseRoles.data.data;
    }

    const saveUser = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/create`, props.formData, headers);

        if (response.status === 201) {
          ElMessage({
            message: response.data.message,
            type: "success"
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
    }

    const showAlertWithErrors = (errros: Error) => {
      const errorMessage = Object.values(errros).flat().join("\n");
      alert("Errores de validación:\n" + errorMessage);
    };

    onMounted(() => {
      getRoles();
    });

    return {
      show,
      closeModal,
      saveUser,
      form,
      roles
    };
  },
});
</script>

<template>
  <!-- Modal -->
  <div class="modal right fade show" style="display: block; background-color: #b4b0b052" tabindex="-1" role="dialog"
    v-if="show">
    <div class="modal-dialog" style="width: 388px;" role="document">
      <div class="modal-content" style="background-color: #ffffff;">
        <div class="modal-body p-0">
          <!-- Agregar padding y head -->
          <div class="p-4">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="modal-title w-100 border-bottom me-2 fw-semibold color-w font-family f-18" id="myModalLabel2">
                <span v-if="formData.id">Editar Asesor</span>
                <span v-else>Agregar Asesor</span>
              </h4>
              <div @click.prevent="closeModal" class="color-y fs-1 poe" aria-label="Cerrar"><em class="icon ni ni-cross-sm"></em>
              </div>
            </div>
            <!--  -->
            <form>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label" for="default-01">Nombres</label>
                    <div class="form-control-wrap">
                      <input v-model="formData.name" type="text" class="input-AA" name="name" placeholder="" />
                    </div>
                  </div>
                </div>
                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="default-01">Apellidos</label>
                    <div class="form-control-wrap">
                      <input v-model="formData.last_name" type="text" class="input-AA" name="last_name" placeholder="" />
                    </div>
                  </div>
                </div>
                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label">Rol</label>
                    <div class="form-control-wrap">
                      <select v-model="formData.role" class="input-AA" name="role" ria-label="Default select example">
                        <option v-for="rol in roles" :value="rol.name" :key="rol.id">{{ rol.name }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="default-01">Número de Whatsapp</label>
                    <div class="form-control-wrap">
                      <input type="text" v-model="formData.num_wpp" class="input-AA" id="num_wpp" placeholder="" />
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="default-01">E-mail</label>
                    <div class="form-control-wrap">
                      <input v-model="formData.email" type="text" class="input-AA" name="email" placeholder="" />
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="default-01">Número de documento</label>
                    <div class="form-control-wrap">
                      <input type="text" v-model="formData.document" class="input-AA" name="document" placeholder="" />
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="hour_start">Hora Inicio</label>
                    <div class="form-control-wrap">
                      <el-time-select v-model="formData.hour_start" class="input-AA pt-1" placeholder=""/>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <label class="form-label" for="hour_end">Hora Fin</label>
                    <div class="form-control-wrap">
                      <el-time-select v-model="formData.hour_end" class="input-AA pt-1" placeholder=""></el-time-select>
                    </div>
                  </div>
                </div>

                <div class="col-md-12 mt-2">
                  <div class="form-group">
                    <div class="form-label-group">
                      <label class="form-label" for="password">Contraseña</label>
                    </div>
                    <div class="form-control-wrap w-p">
                      <a tabindex="-1" href="#" class="form-icon form-icon-right passcode-switch lg"
                        data-target="password"><em class="passcode-icon icon-show icon ni ni-eye"></em><em
                          class="passcode-icon icon-hide icon ni ni-eye-off"></em></a><input v-model="formData.password"
                        autocomplete="new-password" type="password" class="input-AA form-control-lg" required
                        name="password" placeholder="******************" />
                    </div>
                  </div>
                </div>
                <!-- cambiar clases del boton -->
                <div class="flex justify-center mt-3">
                  <button @click.prevent="saveUser()" class="btn-aceptar fw-semibold">
                    <span v-if="formData.id">Actualizar</span>
                    <span v-else>Registrar</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- modal-content -->
    </div>
    <!-- modal-dialog -->
  </div>
  <!-- modal -->
</template>
<style scoped>
/* cambios css */
.color-y {
  color: #f8bc02;
}

.color-w {
  color: #2D383C;
}

.f-18 {
  font-size: 18px;
}

.f-16 {
  font-size: 16px;
}

.font-family {
  font-family: 'Segoe UI';
}

.w-p {
  width: 328px;
}

.input-AA {
  width: 328px;
  height: 42px;
  border: 1px solid #d2d2d2;
  border-radius: 10px;
  outline: none;
  padding-left: 12px;
}

.poe {
  cursor: pointer;
}

.btn-aceptar {
  width: 130px;
  height: 44px;
  background: #f8bc02;
  color: #2d383c;
  outline: none;
  border: none;
  border-radius: 10px;
  font-size: 16px;
}

.btn-aceptar:hover {
  border: 1px solid #f8bc02;
  background: white;
  color: #f8bc02;
  transition: 0.2s;
}

/* fin cambios css */
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