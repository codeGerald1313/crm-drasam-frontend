<script setup lang="ts">
import { reactive, toRef, watch } from 'vue';
import moment from "moment";
import { ElMessage } from 'element-plus';
import { useConversationStore } from '../../stores/conversation';

const useConversation = useConversationStore();

const { showModalRemenber, formDataRemenber } = defineProps(['showModalRemenber','formDataRemenber']);
const emits = defineEmits(['close-modal-remenber']);

const closeModalRemenber = () => {
    useConversation.setmodalRemenber(false);
    emits('close-modal-remenber');
}

const modalRemenber = toRef(useConversation, 'modalRemenber');

const form = reactive({
    datechatRecorder: moment().format('YYYY-MM-DD'),
    timechatRecorder: moment().format('hh:mm'),
    conversation_id: formDataRemenber
});

const addSaveRemenber = () => {
    
    if (!form.datechatRecorder) {
        ElMessage({
            message: 'Fecha requerida.',
            type: 'warning',
        })
        return;
    }

    if (!form.timechatRecorder) {
        ElMessage({
            message: 'Hora requerida.',
            type: 'warning',
        })
        return;
    }

    useConversation.addSaveRemenber(form);
}

watch(modalRemenber, (newValue, oldValue) => {
    if (newValue === true) {
        closeModalRemenber();
    }
});

</script>

<template>

<!-- Modal recordar -->
<div class="modal fade show" v-if="showModalRemenber" id="recordar" tabindex="-1" aria-labelledby="staticBackdrop" aria-hidden="true" style="display: block; background-color: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-dialog-top modal-cerrar justify-content-center">
        <div class="modal-content modal-width">
        <div class="modal-header">
            <h5 class="modal-title w-100 border-bottom" id="exampleModalLabel">Elegir cuando</h5>
            <button type="button" class="btn-close ms-1" @click="closeModalRemenber"></button>
        </div>
        <div class="modal-body check-boxes">
            <div class="block mb-4">
                <li class="text-black fs-6 mb-1">Fecha :</li>                        
                <div class="form-control-wrap recordar-input">
                    <input type="date" v-model="form.datechatRecorder" class="form-control form-recordar" placeholder="DD/MM/AA">
                </div>
            </div>

            <div class="block mb-4">
                <li class="text-black fs-6 mb-1">Horario :</li>                        
                <div class="form-control-wrap recordar-input">
                    <input type="time" v-model="form.timechatRecorder" class="form-control form-recordar" placeholder="00:00">
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-center">
                <button type="submit" @click.prevent="addSaveRemenber" class="btn btn btn-warning mb-3 mt-2"><p class="text-dark">Aceptar</p></button>
            </div>
        </div>
        
        </div>
    </div>                    
</div>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";
</style>