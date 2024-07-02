<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useConversationStore } from '../../stores/conversation';
import ModalReasigView from './ModalReasigView.vue';
import { useAuth } from '@/stores/auth'

const useConversation = useConversationStore();

const searchAdvisor = ref('');

const advisors = computed(() => useConversation.advisors);

const advisorFilter = computed(() => {
    let search = searchAdvisor.value.toLowerCase().trim();

    if (search !== '') {
        return advisors.value.filter((a) => {

            let name = a.name || '';
            let last_name = a.last_name || '';
            let fullName = (name + ' ' + last_name).toLowerCase();
            return fullName.indexOf(search) !== -1;
        });
    }
    return advisors.value;
});

// ABRIR MODAL REASIGNACIÓN DE CLIENTES

const formDataReasing = ref({});
const showModalReasing = ref(false);

const closeModalReasing = () => {
    showModalReasing.value = false;
}

const openModalReasing = (advisor: any) => {
    formDataReasing.value = advisor;
    showModalReasing.value = true;
}

const isCurrentUser = (advisor: any) => {
    return advisor.id === useAuth().user.id;
}

onMounted(async() => {

    window.Echo.channel('online-users').listen('UserStatusUpdated', (e: any) => {
        if (e.status === 1) {
            if (!advisorFilter.value.find((advisor) => advisor.id === e.user.id)) {
                advisorFilter.value.push(e.user);
            }
        } else {
            const index = advisorFilter.value.findIndex((advisor) => advisor.id === e.user.id);
            if (index !== -1) {
                advisorFilter.value.splice(index, 1);
            }
        }
    });

    await useConversation.fetchAdvisors();
})

</script>

<template>

    <ModalReasigView v-if="showModalReasing" :show-modal-reasing="showModalReasing" :form-data-reasing="formDataReasing" @close-modal-reasing="closeModalReasing"/>
    <div class="nk-ibx-aside toggle-screen-lg hide-aside asesores-pane mr-" data-content="inbox-aside" data-toggle-overlay="true" data-toggle-screen="lg">                        
        <div class="nk-ibx-head asesores-pane">
            <div class="asesores-border">
            <div class="me-n1"><a class="link link-text" data-bs-toggle="modal"
                    href="javascript:void(0);"><span class="fs-5 text-black">Asesores</span></a> </div>
            </div>
        </div>
        <div class="nk-chat-aside-search pl-0 pr-0">
            <div class="form-group">
                <div class="form-control-wrap">
                    <input type="text" v-model="searchAdvisor" class="form-control input-search mt-2" placeholder="Buscar asesores">
                    <div class="form-icon form-icon-right">
                        <em class="icon ni ni-search text-color"></em>
                    </div>
                </div>
            </div>
        </div>
        <div class="nk-ibx-nav" data-simplebar="init">
            <div class="simplebar-wrapper" style="margin: 0px;">
                <div class="simplebar-height-auto-observer-wrapper">
                    <div class="simplebar-height-auto-observer"></div>
                </div>
                <div class="simplebar-mask">
                    <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                        <div class="simplebar-content-wrapper" tabindex="0" role="region"
                            aria-label="scrollable content" style="height: 100%; overflow: hidden scroll;">
                            <div class="simplebar-content" style="padding: 0px;">
                                <div class="nk-ibx-nav-head asesores-data ms-4" v-for="advisor in advisorFilter">
                                    <span class="lead-text">{{ advisor.name + ' ' + advisor.last_name}}</span>
                                    <a v-if="!isCurrentUser(advisor)" @click="openModalReasing(advisor)" class="btn btn-asignar btn-outline-warning">
                                        Asignar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="simplebar-placeholder" style="width: auto; height: 899px;"></div>
            </div>
            <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                <div class="simplebar-scrollbar" style="width: 0px; display: none;"></div>
            </div>
            <div class="simplebar-track simplebar-vertical" style="visibility: visible;">
                <div class="simplebar-scrollbar"
                    style="height: 706px; transform: translate3d(0px, 0px, 0px); display: block;"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../../assets/css/Bandeja.css";
</style>