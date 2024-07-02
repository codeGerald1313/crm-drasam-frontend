<script lang="ts">

import { ref, defineComponent, onMounted } from "vue"
import axios from "axios"
import { ElMessage } from 'element-plus'
import { useAuth } from '../../stores/auth'
import ModalConexionView from './ModalConexionView.vue'
import type { Conexions } from '@/model/Type'
export default defineComponent({
    components: { ModalConexionView },
    setup() {
        const showModal = ref(false);
        const headers = useAuth().headers();

        const conexions = ref<Array<Conexions>>([]);
        const formData = ref({});

        const connectionVerification = async () => {
            const getData = await axios.get(`${import.meta.env.VITE_API_URL}/conexions/list`, headers);
            conexions.value = getData.data.conexions;
        }

        const delete_channel = async (id: number) => {

            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL}/conexions/delete/${id}`, headers);
                connectionVerification();

                if (res.data.status) {
                    ElMessage({ message: res.data.message, type: 'success' });
                }
                else {
                    ElMessage({ message: res.data.message, type: 'error' })
                }
            }
            catch (error) {
                console.log(error);
            }

        }

        const openModal = (data: {}) => {
            formData.value = data ? { ...data } : {};
            showModal.value = true;
        }

        const closeModal = () => {
            connectionVerification();
            showModal.value = false;
        }

        onMounted(() => {
            connectionVerification();
        });

        return {
            conexions,
            openModal,
            showModal,
            formData,
            closeModal,
            delete_channel,
            connectionVerification
        }
    }
});

</script>

<template>
    <div class="nk-content">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <div class="nk-block">
                        <div class="row">

                            <!-- COMPROBAR EN LA BASE DE DATOS -->



                            <div class="col-xs-12 col-sm-6 col-md-6 col-xl-4 col-lg-6 col-xxl-3 mb-4 content-card"
                                id="modal_channel" v-if="conexions.length < 1">
                                <div class="card card-bordered h-75 d-flex align-items-center justify-content-center">
                                    <div class="card-inner">
                                        <div class="card-title-group align-start pb-3 g-2">
                                            <div class="card-title card-title-sm">
                                                <div class="d-flex align-items-center justify-content-center">
                                                    <h6 class="title" style="margin-right: 10px;">Agregar Canal</h6>
                                                    <a @click="openModal">
                                                        <img src="../../assets/images/icons/add-conexion.png">
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Cambios -->
                            <div class="border-fg" v-for="row in conexions" :key="row.id">
                                <div class="d-flex justify-content-between align-items-center mt-1">
                                    <div class="d-flex flex-column">
                                        <div class="fw-bold color-b fs-16 ff">Whatsapp</div>
                                        <div class="fw-semibold color-b2 fs-16 ff mt-1">Nombre de empresa: {{
                                            row.company_name }}</div>
                                    </div>
                                    <div class="cursor-pointer">
                                        <a @click.prevent="openModal(row)"><em
                                                class="icon ni ni-pen me-2 fs-3 color-y"></em></a>
                                        <a @click.prevent="delete_channel(row.id)"><em
                                                class="icon ni ni-trash me-2 fs-3 color-y"></em></a>
                                    </div>
                                </div>
                                <div class="d-flex flex-column mt-1">
                                    <div class="color-b2 fs-16 ff">Teléfono: {{ row.phone }}</div>
                                    <div class="color-b2 fs-16 ff">Ultima actualización: 16/08/23 09:25</div>
                                </div>
                                <div class="d-flex flex-column mt-3">
                                    <div class="fw-bold color-b fs-16 ff">Chatbot</div>
                                    <div class="fw-semibold color-b2 fs-16 ff">Cuando tus contactos inicien una
                                        conversación
                                    </div>
                                    <div class="d-flex mt-2 justify-content-between align-items-center">
                                        <div class="d-flex justify-content-end align-items-center">
                                            <input v-model="row.welcome" class="input-cnx fw-semibold" type="text"
                                                placeholder="Bienvenida">
                                            <a class="position-absolute me-2" data-bs-toggle="modal"
                                                data-bs-target="#modalWelcome">
                                                <em class="icon ni ni-pen fs-5 color-y cursor-pointer"></em>
                                            </a>

                                        </div>
                                        <div class="me-3">
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div class="fw-semibold color-b2 fs-16 ff mt-4">Cuando el asesor haya cerrado el
                                        contacto
                                    </div>
                                    <div class="d-flex mt-2 justify-content-between align-items-center">
                                        <div class="d-flex justify-content-end align-items-center">
                                            <input class="input-cnx fw-semibold" type="text"
                                                placeholder="Encuesta de satisfacción">
                                            <a class="position-absolute me-2" data-bs-toggle="modal"
                                                data-bs-target="#modalDefault">
                                                <em class="icon ni ni-pen fs-5 color-y
                                                cursor-pointer"></em>
                                            </a>
                                        </div>
                                        <div class="me-3">
                                            <label class="switch">
                                                <input type="checkbox">
                                                <span class="slider round"></span>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <!-- FinCambios -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DE ENCUESTA-->

        <div class="modal fade" tabindex="-1" id="modalDefault">
            <div class="modal-dialog modal-dialog-top" role="document">
                <div class="modal-content">

                    <div class="modal-body" style="padding-top: 10px;">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h6 class="title mb-2 ff fs-16 color-b">Encuesta de satisfacción</h6>
                            </div>
                            <div><a href="#" class="close" data-bs-dismiss="modal" aria-label="Close">
                                    <em class="icon ni ni-cross color-y"></em>
                                </a></div>

                        </div>

                        <form>
                            <div class="form-group">
                                <label class="form-label chat-label fw-semibold color-b2 ff fs-16">Pregunta</label>
                                <div class="d-flex align-items-center justify-content-end" style="width: 454px;">
                                    <div>
                                        <input type="text" class="input-per1 ff fs-14" id="default-04"
                                            placeholder="Haz una pregunta">
                                    </div>
                                    <div class="position-absolute">
                                        <em class="icon ni ni-happy color-y fs-2" style="margin-right: 10px;"></em>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label chat-label color-black">Opciones</label>
                                <div class="d-flex align-items-center justify-content-end"
                                    style="width: 454px; margin-bottom: 20px;">
                                    <div>
                                        <input type="text" class="input-per1 ff fs-14" id="default-04" placeholder="Añadir">
                                    </div>
                                    <div class="position-absolute">
                                        <em class="icon ni ni-happy color-y fs-2" style="margin-right: 10px;"></em>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center justify-content-end" style="width: 454px;">
                                    <div>
                                        <input type="text" class="input-per1 ff fs-14" id="default-04" placeholder="Añadir">
                                    </div>
                                    <div class="position-absolute">
                                        <em class="icon ni ni-happy color-y fs-2" style="margin-right: 10px;"></em>
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn-per fs-16 ff fw-semibold">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- END MODAL ENCUESTA -->

        <!-- MODAL DE BIENVENIDA -->

        <div class="modal fade" tabindex="-1" id="modalWelcome">
            <div class="modal-dialog modal-dialog-top" role="document">
                <div class="modal-content">
                    <a href="#" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <em class="icon ni ni-cross color-y fs-4"></em>
                    </a>
                    <div class="modal-body">
                        <h6 class="title mb-2 color-b2 ff fs-16">Mensaje de Bienvenida</h6>
                        <form>
                            <div class="form-group">
                                <div class="form-control-wrap">
                                    <textarea class="input-txtarea" placeholder="Escribir aqui"></textarea>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="submit" class="btn-per">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- EDND MODAL BIENVENIDA -->

        <!-- MODAL AGREGAR CANAL -->

        <ModalConexionView v-if="showModal" :show-modal="showModal" :form-data="formData" @close-modal="closeModal" />

    </div>
</template>

<style scoped>
/* Cambios */
.border-fg {
    border: 1px solid #A9A9A9;
    border-radius: 10px;
    width: 430px;
    height: 393px;
}

.ff {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.fs-14 {
    font-size: 14px;
}

.fs-16 {
    font-size: 16px;
}

.color-b {
    color: #2D383C;
}

.color-b2 {
    color: #545454;
}

.color-y {
    color: #F8BC02;
}

.cursor-pointer {
    cursor: pointer;
}

.input-cnx {
    width: 300px;
    height: 42px;
    border: 2px solid #F8BC02;
    border-radius: 10px;
    outline: none;
    color: #F8BC02;
    padding: 0px 40px 0px 10px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.input-cnx::placeholder {
    color: #F8BC02;

}

.input-txtarea {
    border: 1px solid #d2d2d2;
    border-radius: 10px;
    width: 454px;
    height: 101px;
    font-size: 14px;
    padding: 10px 20px;
    outline: none;
}

.input-per1 {
    border: 1px solid #d2d2d2;
    border-radius: 9px;
    width: 454px;
    height: 42px;
    outline: none;
    padding: 0px 40px 0px 10px;
}

.btn-per {
    width: 130px;
    height: 44px;
    border: 1px solid #F8BC02;
    border-radius: 9px;
    color: #2D383C;
    background: #F8BC02;
    transition: 0.3s;
}

.btn-per:hover {
    background: transparent;
    color: #F8BC02;
    transition: 0.3s;
}

.input-txtarea::placeholder {
    opacity: 50%;
}

/* checkbox switch */
.switch {
    position: relative;
    display: inline-block;
    width: 55px;
    height: 28px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* The slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    -webkit-transition: .4s;
    transition: .4s;

}

.slider:before {
    position: absolute;
    content: "";
    height: 23px;
    width: 23px;
    left: 2.6px;
    top: 2px;
    background-color: #A9A9A9;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: transparent;
    color: #F8BC02;
}

input:checked+.slider:before {
    background-color: #F8BC02;
}

input:checked+.slider.round {
    border: 1.5px solid #F8BC02;
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border: 1.5px solid #A9A9A9;
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

/* FinCambios */

.card-bordered {
    border: 1px solid #A9A9A9;
    border-radius: 13px
}

.card-inner {
    padding: 1rem;
    padding-left: 20px;
    padding-right: 20px;
}

.form-rounded {
    border-radius: 10px;
    background: transparent;
    border: 1px solid #A9A9A9;
    outline: #545454;
}

.color-black {
    color: #545454;
}

.p-label {
    font-weight: 410;
    font-size: 13.5px;
}

.p-label-sub {
    font-size: 13.5px;
}

.form-label {
    font-weight: 410;
    margin-bottom: 0.5rem;
    font-size: 13.5px;
}

.custom-text-area {
    min-height: 70px;
}

.label-session {
    padding-left: 30px;
}

.column-with-border {
    border-right: 1px solid #ccc;
    padding-right: 15px;
}

@media (max-width: 991px) {
    .column-with-border {
        border-right: none;
        padding-right: 0;
    }
}

@media (min-height: 575px) {

    .content-card {
        height: 300px;
    }
}

.modal-content {
    background-color: #fff;
}

.none {
    display: none;
}
</style>