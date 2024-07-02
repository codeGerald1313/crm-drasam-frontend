<script lang="ts">
import { reactive, defineComponent, toRef, computed, watch } from "vue"
import { useConversationStore } from '../../../stores/conversation';

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

        const useConversation = useConversationStore();
        
        const modalContact = toRef(useConversation, 'modalContact');

        const form = reactive(props.formData);

        const show = toRef(props, 'showModal');

        const closeModal = () => {
            useConversation.setModalContact(false);
            emit('closeModal');
        }
        
        const advisors = computed(() => useConversation.advisors);

        const addChannel = async () => {
            useConversation.setAsignAdvisorContact(form);
        }

        if (!form.check) {
            form.check = false;
        }

        watch(modalContact, (newValue, oldValue) => {
            if (newValue === true) {
                closeModal();
            }
        });

        return {
            show,
            closeModal,
            form, 
            addChannel,
            modalContact,
            advisors
        }
    }
});
</script>

<template>

<!-- Modal agregar usuarios/datos -->
<div class="modal fade show" v-if="show" tabindex="-1" aria-labelledby="staticBackdrop" aria-hidden="true" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-editar-dialog">
        <form autocomplete="off" @submit.prevent="addChannel"> 
        <div class="modal-content modal-width justify-content-end modal-editar">
            
                <div class="modal-header">
                    <h5 class="modal-title w-100 border-bottom" id="exampleModalLabel">
                        <span v-if="!!form.id">Editar contacto</span>
                        <span v-else>Agregar nuevo contacto</span>
                    </h5>
                    <button type="button" class="btn-close ms-1" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>                    
                </div>
                <div class="ms-4 fs-5 text-black">Datos del contacto:</div>       
                <div class="modal-body form-editar me-3">                    
                    <div class="mb-2">                        
                        <li class="text-black fs-6 mb-1">Nombre Completo</li>                        
                        <div class="form-control-wrap">
                            <input type="text" v-model="form.name" class="form-control editar-input">                            
                        </div>                        
                    </div>
                    <div class="mb-2">                        
                        <li class="text-black fs-6 mb-1">Numero de WhatsApp</li>                        
                        <div class="form-control-wrap">
                            <input type="text" v-model="form.num_phone" class="form-control editar-input">                            
                        </div>                        
                    </div>
                    <div class="mb-2">                        
                        <li class="text-black fs-6 mb-1">Correo Electronico</li>                        
                        <div class="form-control-wrap">
                            <input type="text" v-model="form.email" class="form-control editar-input">                            
                        </div>                        
                    </div>
                    <div class="mb-2">                        
                        <li class="text-black fs-6 mb-1">Interés/consulta sobre</li>                        
                        <div class="form-control-wrap">
                            <input type="text" v-model="form.interes_en" class="form-control editar-input">                            
                        </div>                        
                    </div>

                    <div class="mb-2" v-if="!form.id">                        
                        <li class="text-black fs-6 mb-1">Asignar a</li>                        
                        <div class="form-control-wrap d-flex w-100">
                            <el-select class="form-select form-select-sm select-agregar w-100" v-model="form.advisor_id" placeholder="Seleccione Asesor">
                                <el-option
                                v-for="item in advisors"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                />
                            </el-select>
                            
                        </div>                                               
                    </div>

                    <div class="form-check" v-if="!!form.id">
                        <input class="form-check-input" type="checkbox" :value="form.check ? 1 : 0" v-model="form.check" id="flexCheck5">
                        <label class="form-check-label ms-1" for="flexCheck5">
                            Actualizar Interés/consulta del contacto
                        </label>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <button type="submit" class="btn btn btn-warning mb-3 mt-2 b-aceptar d-flex align-items-center justify-content-center text-dark fs-6">Guardar</button>
                    </div>
                </div>
        </div>
    </form>
    </div>                    
</div>
</template>
<style scoped>
@import "../../../assets/css/Bandeja.css";
.modal-content {
    height: 100% !important;
}
</style>