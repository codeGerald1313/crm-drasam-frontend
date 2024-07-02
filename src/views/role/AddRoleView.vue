<script setup>
import { ref, reactive } from "vue"
import axios from "axios"
import { ElMessage } from 'element-plus'

import { useAuth } from '../../stores/auth';
const headers = useAuth().headers();

const permissionsAll = ref([]);

const form = reactive({
    id: null,
    name: '',
    guard_name: 'web',
    permissions: []
});

const resetForm = () => {
    form.id = null;
    form.name = '';
    form.guard_name = 'web';
    form.permissions = [];
}


const getData = async () => {
    const getPermission = await axios.get(`${import.meta.env.VITE_API_URL}/permissions/list`, headers);
    permissionsAll.value = await getPermission.data.data;
}

const handleSubmit = async () => {

    if (!form.name) {
        ElMessage({
            message: 'Nombre del rol obligatorio.',
            type: 'warning',
        })
        return;
    }

    if (!form.permissions.length > 0) {
        ElMessage({
            message: 'Seleccione al menos un permiso.',
            type: 'warning',
        })
        return;
    }

    const SendForm = JSON.stringify(form);

    try {

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/roles/create`, SendForm, headers)
        if (res.data.status) {
            ElMessage({ message: res.data.message, type: 'success' })
            resetForm();
        }
        else {
            ElMessage({ message: res.data.message, type: 'error' })
        }

    } catch (error) {
        console.log(error)
    }
}

getData();

</script>

<template>
    <div class="row">
        <div class="col-lg-12 p-3" style="background-color:#f9fafb;">
            <form id="signupForm" autocomplete="off" @submit.prevent="handleSubmit">
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3 d-flex align-items-center">
                            <input id="name" v-model="form.name" class="form-control" name="name" type="text"
                                placeholder="Nombre Rol">
                            <button type="submit" class="btn btn-dim btn-outline-secondary mx-1" native-type="submit"><em
                                    class="icon ni ni-save"></em> Registrar</button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 pt-2" v-for="(permissions, modulo) in permissionsAll"
                        :key="modulo">
                        <div class="card card-bordered">
                            <div class="card-header border-bottom text-uppercase text-white bg-warning">{{ modulo }}</div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="modu in permissions">
                                    <div class="custom-control custom-control-sm custom-switch">
                                        <input type="checkbox" class="custom-control-input" v-model="form.permissions"
                                            :id="modu.id" :value="modu.id">
                                        <label class="custom-control-label" :for="modu.id" style="font-size: 0.79rem;">{{
                                            modu.description }}</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
.list-group-item {
    background-color: #fff;
    border: 0px;
}

.card-bordered {
    height: 100%;
}</style>