<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import { useConversationStore } from '../../stores/conversation';
import { ElMessage } from 'element-plus';


const useConversation = useConversationStore();

const { showModalCerrar, formDataCerrar } = defineProps(['showModalCerrar','formDataCerrar']);
const emits = defineEmits(['close-modal-cerrar']);

const closeModalCerrar = () => {
    useConversation.setmodalCerrar(false);
    emits('close-modal-cerrar');
}

const selectedReason = ref(null);

const modalCerrar = toRef(useConversation, 'modalCerrar');


const clousureReasons = computed(() => useConversation.clousureReasons);

const acceptButtonClick = () => {
    if (selectedReason.value !== null) {
        useConversation.closeReasonConversation(formDataCerrar,selectedReason.value);
    } else {
        ElMessage.warning('Debe seleccionar una opción de cierre para completar la operación');
    }
};

watch(modalCerrar, (newValue, oldValue) => {
    if (newValue === true) {
        closeModalCerrar();
    }
});
</script>

<template>

<!-- modal de cerrar -->
<div class="modal fade show" v-if="showModalCerrar" tabindex="-1" aria-labelledby="staticBackdrop" aria-hidden="true" style="display: block; background-color: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog modal-cerrar justify-content-center">
        <div class="modal-content modal-width">
        <div class="modal-header">
            <h5 class="modal-title title-color w-100 border-bottom" id="exampleModalLabel">Razón del cierre</h5>
            <button type="button" class="btn-close ms-1" data-bs-dismiss="modal" aria-label="Close" @click="closeModalCerrar"></button>
        </div>
            <div class="modal-body check-boxes">
                <div>
                    <div class="form-check ms-3" v-for="reason in clousureReasons">
                        <input class="form-check-input" style="border-radius: 0;" type="radio" :value="reason.id.toString()" :id="reason.id.toString()" v-model="selectedReason">
                        <label class="form-check-label ms-1" :for="reason.id.toString()">
                            {{ reason.name }}
                        </label>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-center">
                    <button type="button" class="btn btn btn-warning mb-3 mt-2" @click="acceptButtonClick"><p class="text-dark">Aceptar</p></button>
                </div>
            </div>
        
        </div>
    </div>                    
</div>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";

.title-color{
    font-size: 17px;
    color: #2D383C;
}
</style>