<script lang="ts">
import { ref, reactive, defineComponent, onMounted, toRef } from "vue"
import axios from "axios"
import { ElMessage } from 'element-plus'
import { useAuth } from '../../stores/auth';

export default defineComponent({
    props: {
        showModal: {
            type: Boolean,
            required: true
        },
        formData: {
            type: Object,
            default: () => { }
        },
    },
    setup(props, { emit }) {

        const headers = useAuth().headers();

        const form = reactive(props.formData);
        const show = toRef(props, 'showModal');

        const closeModal = () => {
            emit('closeModal');
        }

        const addChannel = async () => {

            if (!form.company_name) {
                ElMessage({
                    message: 'Nombre de la compañía obligatorio.',
                    type: 'warning',
                })
                return;
            }

            if (!form.phone) {
                ElMessage({
                    message: 'Ingrese un número de celular.',
                    type: 'warning',
                })
                return;
            }

            if (!form.welcome) {
                ElMessage({
                    message: 'Ingrese una bienvenida para el canal.',
                    type: 'warning',
                })
                return;
            }

            const SendForm = JSON.stringify(form);

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/conexions/create`, SendForm, headers);

                if (res.data.status) {
                    ElMessage({ message: res.data.message, type: 'success' });
                }
                else {
                    ElMessage({ message: res.data.message, type: 'error' })
                }

                closeModal();
            }
            catch (error) {
                console.log(error)
            }

        }

        onMounted(() => {

        });

        return {
            show,
            closeModal,
            form,
            addChannel
        }
    }
});
</script>

<template>
    <div class="modal fade show modal-lg" tabindex="-1" id="modalCanal" v-if="show"
        style="display: block; background-color: rgba(133, 133, 133, 40%);">
        <div class="modal-dialog modal-lg modal-dialog-top" role="document">
            <div class="modal-content">
                <a class="close cursor-pointer" data-bs-dismiss="modal" @click="closeModal">
                    <em class="icon ni ni-cross color-y fs-3"></em>
                </a>
                <div class="modal-body" style="background: white;">
                    <form autocomplete="off" @submit.prevent="addChannel">
                        <div class="nk-block nk-block-lg">
                            <div class="row g-gs">
                                <div class="col-lg-7 column-with-border">
                                    <h6 class="title mb-2 color-black">Whatsapp</h6>
                                    <div class="form-group">
                                        <label class="form-label" for="phone-no">Nombre de la empresa</label>
                                        <div class="form-control-wrap">
                                            <input v-model="form.company_name" type="text" class="input-per1"
                                                id="inp_company_name">
                                            <input v-model="form.id" type="text" class="form-control form-rounded none"
                                                id="inp_company_name">
                                            <input v-model="form.user_id" class="none">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label" for="phone-no">Teléfono</label>
                                        <div class="form-control-wrap">
                                            <input type="text" class="input-per1" id="inp_phone" v-model="form.phone">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label" for="phone-no">Chatbot</label>
                                        <p>Este bot permitirá dar la bienvenida en simples pasos</p>
                                    </div>

                                    <div class="form-group">
                                        <div class="form-control-wrap">
                                            <label class="form-label">Bienvenida</label>
                                            <textarea id="txt_welcome" class="input-per2" v-model="form.welcome"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-5">
                                    <label class="form-label label-session ff fs-16 color-y">Sesión</label>
                                    <div class="form-group">
                                        <img src="../../assets/images/icons/qr-sesion.png">
                                    </div>
                                    <!-- qr-sesion.png -->
                                    <div class="form-group text-end">
                                        <button type="submit" class="btn-per fs-16 ff fw-semibold">Listo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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

.input-per1 {
    border: 1px solid #d2d2d2;
    border-radius: 9px;
    width: 375px;
    height: 42px;
    outline: none;
    padding-left: 10px;
    padding-right: 10px;
}

.input-per2 {
    border: 1px solid #d2d2d2;
    border-radius: 9px;
    width: 375px;
    height: 80px;
    outline: none;
    padding-left: 10px;
    padding-right: 10px;
}

.btn-per {
    margin-top: 45px;
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

/* FinCambios */
.none {
    display: none;
}
</style>