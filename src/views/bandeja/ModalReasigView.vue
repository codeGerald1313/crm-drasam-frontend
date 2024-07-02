<script setup lang="ts">
import { computed, toRef, watch, onMounted, reactive } from 'vue';
import { useConversationStore } from '../../stores/conversation';

const useConversation = useConversationStore();
const advisors = computed(() => useConversation.advisors);
const customers = computed(() => useConversation.customers);

const { showModalReasing, formDataReasing } = defineProps(['showModalReasing','formDataReasing']);
const emits = defineEmits(['close-modal-reasing']);

const closeModalReasing = () => {
    useConversation.setmodalReasing(false);
    emits('close-modal-reasing');
}

const modalReasing = toRef(useConversation, 'modalReasing');

const form = reactive({
    selectedAsignId: null,
    selectedAdvisorId: null
});

const setReasonReasing = () => {
    if (form.selectedAsignId !== null) {
        useConversation.assignIndividual(form.selectedAsignId,formDataReasing.id);
    }
}

const getCustomers = () =>{
    useConversation.getCustomers();
}

watch(modalReasing, (newValue, oldValue) => {
    if (newValue === true) {
        closeModalReasing();
    }
});

onMounted(() => {
    getCustomers();
});
</script>

<template>

    <!-- MODAL ASIGNAR -->
    <div class="modal fade show" v-if="showModalReasing" tabindex="-1" aria-labelledby="staticBackdrop" aria-hidden="true" style="display: block; background-color: rgba(0, 0, 0, 0.5)">
        <div class="modal-dialog modal-asignar modal-dialog-top">
            <!-- modal-dialog-top -->
            <form @submit.prevent="setReasonReasing">
                <div class="modal-content">
                    <div class="modal-body p-0 m-1">
                        <div class="m-1">
                            <p class="fw-bold text-black">¿Qué contacto le asignaras a {{ formDataReasing.name + ' ' + formDataReasing.last_name}}?</p>                                               
                        </div>
                        <div class="rounded d-flex align-items-center mb-1" style="border: 1.4px solid #a9a9a9;">
                            <div class="overflow-auto caja-asignar" style="height: 100px !important;">
                                <div v-for="customer in customers">
                                    <div class="border-bottom d-flex justify-content-between me-2" style="padding: 0px 2px 2px 10px;">
                                        <div >
                                            <label class="form-check-label font-label ms-1" >
                                                {{ customer.name }}
                                            </label>
                                        </div>
                                        <div>
                                            <input class="form-check-input" style="border-radius: 50px;" type="radio" :value="customer.asignId.toString()" v-model="form.selectedAsignId">
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                        </div>                        
                        
                    </div> 
                    <div class="modal-fotter pb-1 text-center">
                        <button type="button" class="btn btn-sm btn-secondary mr-2 btn-rou" aria-label="Close" @click="closeModalReasing" style="margin-right: 10px;">
                            <em class="icon ni ni-cross-circle"></em>
                        </button>
                        <button type="submit" class="btn btn-sm btn-warning btn-rou" v-if="advisors.length > 0 && customers.length > 0">
                            <em class="icon ni ni-save"></em>
                        </button>
                    </div>               
                </div>
            </form>
        </div>                    
    </div>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";
.form-check-input:checked {
    background-color: #F8BC02;
}

.btn-rou{
    border-radius: 100%;
    padding-top: 0px;
    padding-bottom: 0px;
    padding-right: 1px;
    padding-left: 1px;
}

.font-label{
    color: #0C0D0D;
}
</style>