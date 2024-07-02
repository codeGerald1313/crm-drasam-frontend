<script lang="ts" >
import { ref, defineComponent, onMounted, reactive, computed } from "vue"
import axios from "axios"
import { ElMessage } from 'element-plus'
import { useAuth } from '../../stores/auth'
import type { Answer } from '@/model/Type';
import { usePermissionsStore } from '@/stores/permissions'

export default defineComponent({
    setup() {
        const hasPermissionTo = usePermissionsStore().hasPermissionTo;
        const password = ref('');
        const showPassword = ref(false);

        const passwordVisibility = () => {
            showPassword.value = !showPassword.value;
        }

        const headers = useAuth().headers();

        const user = computed(() => useAuth().user);
        const role = user.value.roles[0].name;

        const answers = ref<Array<Answer>>([]);
        const modal = ref(false);
        const type_section = ref(false);

        const form = reactive({
            id: null,
            title: '',
            message: '',
            type: useAuth().user.validate == 0 ? 'answers' : ''
        });

        const resetForm = () => {
            form.id = null;
            form.title = '';
            form.message = '';
            form.type = '';
        }

        const sendAnswers = async () => {
            if (!form.title) {
                ElMessage({
                    message: 'Ingrese un titulo.',
                    type: 'warning',
                })
                return;
            }

            if (!form.message) {
                ElMessage({
                    message: 'Ingrese un mensaje.',
                    type: 'warning',
                })
                return;
            }

            const SendForm = JSON.stringify(form);

            try {
                const res = await axios.post(`${import.meta.env.VITE_API_URL}/quickly_answers/create`, SendForm, headers);
                resetForm();
                getAnswers();

                if (res.data.status) {
                    ElMessage({ message: res.data.message, type: 'success' });
                }
                else {
                    ElMessage({ message: res.data.message, type: 'error' })
                }
            }
            catch (error) {
                console.log(error)
            }
        }

        const getAnswers = async () => {
            const getData = await axios.get(`${import.meta.env.VITE_API_URL}/quickly_answers/list/${useAuth().user.id}`, headers);
            answers.value = await getData.data.data;
        }

        const deleteAnswers = async (id: number) => {
            try {
                const res = await axios.delete(`${import.meta.env.VITE_API_URL}/quickly_answers/delete/${id}`, headers);
                getAnswers();

                if (res.data.status) {
                    ElMessage({ message: res.data.message, type: 'success' });
                }
                else {
                    ElMessage({ message: res.data.message, type: 'error' })
                }
            }
            catch (error) {
                console.log(error)
            }
        }

        const change_type = (value: boolean) => {
            if (value == true) {
                type_section.value = true;
                document.querySelector('#templates')?.classList.remove('activeTab');
                document.querySelector('#create_answer')?.classList.add('activeTab');
            }
            else if (value == false) {
                type_section.value = false;
                document.querySelector('#templates')?.classList.add('activeTab');
                document.querySelector('#create_answer')?.classList.remove('activeTab');
            }
        }

        const add_field = (field: string) => {
            form.message = form.message + " " + field;
        }

        const profile = async () => {
            const data = {
                id: user.value.id,
                name: user.value.name,
                email: user.value.email,
                password: password.value
            };

            try {
                const sendForm = JSON.stringify(data);
                const res = await axios.put(`${import.meta.env.VITE_API_URL}/users/edit_config/${data.id}`, sendForm, headers);

                password.value = '';

                if (res.data.status) {
                    ElMessage({ message: res.data.message, type: 'success' })
                }
                else {
                    ElMessage({ message: res.data.message, type: 'error' })
                }
            }
            catch (error) {
                console.log(error)
            }
        }

        const typesQuickly = [
            {
                id: 1,
                label: 'Answer',
            },
            {
                id: 2,
                label: 'Template'
            }
        ];

        onMounted(() => {
            getAnswers();
            modal.value = false;
            change_type(false);
        });

        return {
            typesQuickly,
            user,
            role,
            showPassword,
            passwordVisibility,
            form,
            sendAnswers,
            answers,
            deleteAnswers,
            modal,
            type_section,
            change_type,
            add_field,
            password,
            profile,
            hasPermissionTo
        }
    }
});

</script>

<template>
    <div class="nk-content">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <div class="nk-block nk-block-lg">
                        <div class="row g-gs">
                            <div class="col-lg-4 column-with-border mb-5">
                                <div class="user-card">
                                    <div class="user-avatar bg-primary-dim"><span>PL</span></div>
                                    <div class="user-info">
                                        <span class="lead-text">Promolider</span>
                                        <span class="sub-text color-black">{{ user.email }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="name">Nombre</label>
                                    <div class="form-control-wrap">
                                        <input type="text" class="form-control form-rounded" id="name" v-model="user.name">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for="email">Correo electronico</label>
                                    <div class="form-control-wrap">
                                        <input type="email" class="form-control form-rounded" id="email"
                                            v-model="user.email">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label chat-label color-black" for="pass">Perfil</label>
                                    <div class="form-control-wrap">
                                        <input type="text" disabled class="form-control form-rounded" id="pass"
                                            placeholder="Administrador" style="width: 50%;">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="form-label chat-label color-black" for="passwordRef">Contraseña</label>
                                    <div class="form-control-wrap">
                                        <div class="form-icon form-icon-right">
                                            <a href="javascript:void(0)" @click="passwordVisibility">
                                                <em :class="showPassword ? 'ni ni-eye' : 'ni ni-eye-off'"></em>
                                            </a>
                                        </div>
                                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                                            class="form-control form-rounded" id="passwordRef" placeholder="*********">
                                    </div>
                                </div>
                                <div class="form-group text-center">
                                    <button type="submit" class="btn btn-secondary bg" @click.prevent="profile()"
                                        style="color: #000;border: none;">Guardar</button>
                                </div>
                            </div>
                            <div class="col-lg-8 mb-5">
                                <div class="row mb-5" v-show="hasPermissionTo(['quickly_answers.create'])">
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                                        <p class="p-label color-black">Respuestas rápidas</p>
                                        <p class="p-label-sub color-black">Podrás editar y crear respuestas rápidas para
                                            interactuar en simples pasos con tus contactos</p>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                                        <p class="mb-4"></p>
                                        <a href="javascript:void(0)" class="p-label-tab color-black color"
                                            @click="modal = true">Administrar</a>
                                    </div>
                                </div>
                                <div class="row mb-5" v-show="hasPermissionTo(['users.delete'])">
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                                        <p class="p-label color-black">Elimina tu cuenta</p>
                                        <p class="p-label-sub color-black">Esta acción es permanente e irreversible.
                                            Perderás acceso a la cuenta y toda la información que contiene</p>
                                    </div>
                                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                                        <p class="mb-4"></p>
                                        <a href="javascript:void(0)" class="p-label-tab color-black color">Eliminar
                                            cuenta</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal -->

                    <div v-show="modal" class="modal fade show modal-lg" tabindex="-1"
                        style="display: block; background-color: rgba(133, 133, 133, 0.5); ">

                        <div class="modal-dialog modal-lg modal-dialog-top" role="document">

                            <div class="modal-content modal-f-r">

                                <a class="close" data-bs-dismiss="modal" @click="modal = false">
                                    <em class="icon ni ni-cross"></em>
                                </a>

                                <div class="modal-body p-0" style="background-color: #fff; border-radius: 5px;">

                                    <div autocomplete="off">

                                        <div class="nk-block nk-block-lg">

                                            <h6 class="title mb-2 color-black rp">Respuestas Rapidas</h6>

                                            <ul class="nav-form-r">
                                                <li @click="change_type(false)" id="templates">Respuestas</li>
                                                <li @click="change_type(true)" id="create_answer">Crear nuevas respuestas
                                                </li>
                                            </ul>

                                            <div class="" v-show="type_section == false">
                                                <div class="form-group pt-4 px-4 m-0">
                                                    <div class="form-control-wrap">
                                                        <div class="d-flex align-items-center justify-content-end">
                                                            <input type="text" class="form-control form-rounded"
                                                                style="height: 42px;" placeholder="Buscar respuesta">
                                                            <em class="icon ni ni-search position-absolute me-2 fs-5"
                                                                style="color: #F8BC02; margin-bottom: 3px;"></em>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ul class="rp-ul p-4">
                                                    <li v-for="answer in answers">
                                                        <div>
                                                            <h6 class="m-0">{{ answer.title }}</h6>
                                                            <p>{{ answer.message }}</p>
                                                        </div>
                                                        <a class="btn" @click.prevent="deleteAnswers(answer.id)"><i
                                                                class="fas fa-trash mr-1 font-base"></i></a>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div class="" v-show="type_section == true">
                                                <form action="" class="p-4" @submit.prevent="sendAnswers">
                                                    <div class="form-group m-0">
                                                        <div class="form-control-wrap">
                                                            <label for="" class="form-label pb-1">Título (no
                                                                se muestra en el
                                                                mensaje).</label>
                                                            <input type="text" class="form-control form-rounded"
                                                                style="height: 42px;" v-model="form.title">
                                                        </div>
                                                    </div>

                                                    <div class="mb-2" v-if="user.validate == 1">
                                                        <li class="text-black fs-6 mb-1">Tipo</li>                        
                                                        <div class="form-control-wrap d-flex w-100">
                                                            <el-select class="form-select form-select-sm select-agregar w-100" v-model="form.type" placeholder="Seleccione Asesor">
                                                                <el-option
                                                                v-for="item in typesQuickly"
                                                                :key="item.id"
                                                                :label="item.label"
                                                                :value="item.id"
                                                                />
                                                            </el-select>
                                                            
                                                        </div>                                               
                                                    </div>

                                                    <div class="form-group mt-3">
                                                        <div class="form-control-wrap">
                                                            <div class="d-flex justify-content-between align-items-center">
                                                                <label class="form-label ">Mensaje</label>

                                                                <ul class="form-select field"
                                                                    style="width: 155px; border-radius: 10px 10px 0 0;"
                                                                    aria-label="Default select example">
                                                                    Agregar campo
                                                                    <ul class="ul-field">
                                                                        <li class="ti">
                                                                            Variables de contacto
                                                                        </li>
                                                                        <li @click="add_field('{nombre del contacto}')">
                                                                            Nombre del contacto
                                                                        </li>
                                                                    </ul>
                                                                </ul>
                                                            </div>
                                                            <textarea v-model="form.message" id="txt_welcome"
                                                                class="form-control form-control-sm form-rounded custom-text-area"
                                                                placeholder="Escribir aqui">
                                                            </textarea>
                                                        </div>
                                                    </div>

                                                    <div class="form-group text-center d-flex justify-content-center align-items-center"
                                                        style="height: 100px;">
                                                        <button 
                                                            class="btn-per d-flex justify-content-center align-items-center fw-semibold"
                                                            style="color: #363636; border: none; background: #F8BC02; height: 44px; width: 130px; font-size: 16px; border-radius: 10px;">Guardar</button>
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.btn-per::hover {
    background: white;
    border: 1px solid #f8bc02;
    color: #f8bc02;
}

.form-rounded {
    border-radius: 10px;
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

.p-label-tab {
    font-weight: 410;
    font-size: 15px;
}

.p-label-sub {
    font-size: 13px;
    text-align: justify;
}

.form-label {
    font-weight: 410;
    margin-bottom: 0.5rem;
    font-size: 13.5px;
}

.column-with-border {
    border-right: 1px solid #ccc;
    padding-right: 15px;
}

.user-avatar {
    width: 60px;
    height: 60px;
}

.color {
    color: #f8bc02;
}

.bg {
    background-color: #f8bc02;
    border: none;
}

.rp {
    padding: 25px 25px 10px 25px;
    font-weight: bold;
    color: #000;
}

.modal-f-r {
    max-width: 90%;
    width: 400px;
    height: 550px;
    margin: 0 auto;
}

.nav-form-r {
    display: flex;
    width: 100%;
    border-top: #54545433 1px solid;
    border-bottom: #54545433 1px solid;
}

.nav-form-r li {
    cursor: pointer;
    padding: 10px;
    flex: .5;
    text-align: center;
    font-size: 1.1em;
    color: #000;
    font-weight: 500;
}

.rp-ul li {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
    border-bottom: #54545433 1px solid;
}

.mr-1 {
    font-size: 1.15em;
}

.activeTab {
    background-color: #f8bc02;
}

.ul-field {
    width: 155px;
    display: none;
    position: absolute;
    margin-top: 7.5px;
    background: #fff;
    border: #dbdfea 1px solid;
    margin-left: -17px;
    border-radius: 0 0 10px 10px;
    padding-bottom: 10px;
}

.ul-field li {
    padding: 0 10px 7px 10px;
    cursor: pointer;
}

.ul-field .ti {
    border-bottom: #dbdfea 1px solid;
    cursor: default;
    padding: 10px;
    margin-bottom: 10px;
}

.field:hover>.ul-field {
    display: block;
}

@media (max-width: 991px) {
    .column-with-border {
        border-right: none;
        padding-right: 0;
    }
}
</style>