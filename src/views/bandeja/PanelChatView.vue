<script setup lang="ts">
import { computed, ref, watch,onMounted } from 'vue';
import { useConversationStore } from '../../stores/conversation';
import { useHidePaneltoreStore } from '../../stores/hidePanel';
import ContactModal from './registercontact/ContactModal.vue';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useAuth } from '../../stores/auth'

// MODAL ASIGNACION CLIENTE
const activeTab = ref('tabItem1');
const title = ref('Tú');
const modalId = ref();

const useConversation = useConversationStore();
const useHidePanel = useHidePaneltoreStore();

const modalVisible = ref(false);

const conversations = computed(() => useConversation.conversations);
const conversation_selected = computed(() => useConversation.conversationSelected);
const uniqueConversations = computed(() => useConversation.uniqueConversations);
const loading = computed(() => useConversation.loading);
const advisors = computed(() => useConversation.advisors);

const colors = ref([
    { text: 'Frio', color: 'blue'},
    { text: 'Tibio', color: 'green'},
    { text: 'Caliente', color: 'red'},
]);

const changeTab = (tabId: any, name: string) => {
    title.value = name
    activeTab.value = tabId;
}

const handleOpenModal = (id: any) => {
    modalId.value = id;
    openModal();
}

const openModal = () => {
    modalVisible.value = true;
}

const cerrarModal = () => {
    modalVisible.value = false;
}

const asignAdvisor = (modalId: number, advisorId: number) => {
    useConversation.asignAdvisor(modalId, advisorId);
    cerrarModal();
}

// END MODAL ASIGNACION CLIENTE

// ABRIR MODAL REGISTRO DE CONTACTO

const showModal = ref(false);
const formData = ref({});

const closeModal = () => {
    showModal.value = false;
}

const openModalContact = (data: {}) => {
    formData.value = data ? { ...data } : {};
    showModal.value = true;
}

const selectedConversation = (conversation: any) => {
    useConversation.selectedConversation(conversation);

    useConversation.initMessage(conversation.id)
}

const selectedConversationAdvisor = (conversation: any) => {
    useConversation.selectedConversationAdvisor(conversation);
}

const hidePanelTab = ref(true);

const togglePanelAdvisor = () => {
    hidePanelTab.value = !hidePanelTab.value;
    useHidePanel.updatePanelState(hidePanelTab.value);
}

const hidePanelClass = computed(() => {
    return hidePanelTab.value ? 'icon ni ni-back-ios' : 'icon ni ni-forward-ios';
})


const chatsStatus = ref([
    { id: 1, name: 'Abiertos'},
    { id: 2, name: 'Agenda'},
    { id: 3, name: 'Cerrados'},
]);

const statusId = ref(1);

const selectedChat = () => {

}


const CONVERSATION_STATUS = {
  ASSIGNED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
};

const searchConversation = ref('');

const filteredConversations = computed(() => {
  const user = useAuth().user;
  const userIsAdmin = user.validate === 1;
  const searchKeyword = searchConversation.value;

  return conversations.value.filter((conversation: any) => {

    const userIsAssignedAdvisor = conversation.advisorId === useAuth().user?.id;
    const doesNameMatchSearch = () => {
      const conversationName = conversation.contact_name.toLowerCase();
      return conversationName.includes(searchKeyword.toLowerCase());
    }

    const doesPhoneMatchSearch = () => {
      const conversationPhone = conversation.contact.num_phone.toLowerCase();
      return conversationPhone.includes(searchKeyword.toLowerCase());
    }

    switch (statusId.value) {
      case CONVERSATION_STATUS.ASSIGNED:
      if ((userIsAdmin || userIsAssignedAdvisor) && (doesNameMatchSearch() || doesPhoneMatchSearch())) {
            return (
                conversation.status_assignments == CONVERSATION_STATUS.ASSIGNED ||
                conversation.status_assignments == CONVERSATION_STATUS.IN_PROGRESS
            )
        } else {
            return (
                (conversation.status_assignments == CONVERSATION_STATUS.ASSIGNED) &&
                (doesNameMatchSearch() || doesPhoneMatchSearch())
            )
        }

      case CONVERSATION_STATUS.IN_PROGRESS:

      case CONVERSATION_STATUS.COMPLETED:
        if (userIsAdmin && (doesNameMatchSearch() || doesPhoneMatchSearch())) {
          return conversation.status_assignments == CONVERSATION_STATUS.COMPLETED;
        } else {
            return (
                userIsAssignedAdvisor &&
                conversation.status_assignments == CONVERSATION_STATUS.COMPLETED &&
                (doesNameMatchSearch() || doesPhoneMatchSearch())
            )
        }

      default:
        return doesNameMatchSearch() || doesPhoneMatchSearch();
    }
  });
});

const unreadMessagesCount = computed(() => {
  return filteredConversations.value.reduce((count, conversation) => {
    if (conversation.status_assignments == 1) {
      return count + 1;
    }
    return count;
  }, 0);
});


const unreadMessagesCountTab1 = computed(() => {
  return filteredConversations.value.reduce((count, conversation) => {
   
    if (conversation.status_assignments == 2 && conversation.count_messages > 0){
        return count + 1;
    }
   
    return count;
  }, 0);
});


const filteredUniqueConversations = computed(() => {
    if (!uniqueConversations.value) {
        return [];
    }

    return uniqueConversations.value.filter((conversation: any) => {
        if (statusId.value == 1) {
            if (useAuth().user.validate === 1) {
                return conversation.status === 'open';
            }else{
                return conversation.advisorId === useAuth().user?.id && (conversation.status === 'open');
            }
            
        } else if (statusId.value == 2) {
            
        } else if (statusId.value == 3) {
            if (useAuth().user.validate === 1) {
                return conversation.status === 'close';
            }else{
                return conversation.advisorId === useAuth().user?.id && (conversation.status === 'close');
            }
        }
    });
});

watch(statusId, () => {
    
});

onMounted(async() => {

    window.Echo.channel('channel-conversation').listen('ConversationCreated', (newConversation: any) => {
        try {
            
            const sendMessage = newConversation.conversation.sendAdvisor;

            if(newConversation.conversation.status_assignments==1){
                useConversation.pushConversation(newConversation.conversation);
            }
            if(newConversation.conversation && newConversation.conversation.status_assignments == 2){
                const conversationIndex = filteredConversations.value.findIndex((conversation) => conversation.id === newConversation.conversation.id);
                if (conversationIndex !== -1) {
                    filteredConversations.value[conversationIndex].count_messages = newConversation.conversation.count_messages;
                    filteredConversations.value[conversationIndex].last_activity = newConversation.conversation.last_activity;
                    filteredConversations.value.unshift(filteredConversations.value.splice(conversationIndex, 1)[0]);

                    if(newConversation.conversation.messages){
                        if(newConversation.conversation.id == conversation_selected.value?.id){
                            useConversation.pushMessages(newConversation.conversation.messages);
                        }
                    }
                }
            }
            if(sendMessage){
                const conversationIndex = filteredConversations.value.findIndex((conversation) => conversation.id === sendMessage.id);
                if (conversationIndex !== -1) {
                    filteredConversations.value[conversationIndex].last_activity = sendMessage.last_activity;
                    filteredConversations.value.unshift(filteredConversations.value.splice(conversationIndex, 1)[0]);
                }

                if(sendMessage.messages){
                    if(sendMessage.id == conversation_selected.value?.id){
                        useConversation.pushMessages(sendMessage.messages);
                    }
                }

            }

            if(newConversation.conversation.notes){
                
                if(conversation_selected != undefined){
                    if(newConversation.conversation.notes == conversation_selected.value?.id){
                        useConversation.initMessage(newConversation.conversation.notes);
                    }
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    });

    window.Echo.channel('asign-advisor').listen('AsignAdvisorUpdated', (newAssignIndividual: any) => {
        try {
            if(newAssignIndividual.asing.statusConversation==1){

                const isAssignedToCurrentUser = newAssignIndividual.asing.assignedToUserId === useAuth().user.id;
                const isAssignedByCurrentUser = parseInt(newAssignIndividual.asing.assignedByUserId) === newAssignIndividual.asing.assignedToUserId;

                if (isAssignedToCurrentUser && isAssignedByCurrentUser) {
                    useConversation.selectedConversation(newAssignIndividual.asing.asing);
                    useConversation.initMessage(newAssignIndividual.asing.asing.id);
                    useConversation.pushConversation(newAssignIndividual.asing.asing)
                    activeTab.value = 'tabItem1';
                }else{
                    useConversation.pushConversation(newAssignIndividual.asing.asing)
                }
            }
            else{
                const conversationId = newAssignIndividual.asing.asing.id;
                if (useAuth().user.validate === 1) {
                    const conversationIndex = filteredConversations.value.findIndex((conversation) => conversation.id === conversationId);
                    if (conversationIndex !== -1) {
                        filteredConversations.value[conversationIndex].advisorName = newAssignIndividual.asing.asing.advisorName;
                    }else{
                        useConversation.pushConversation(newAssignIndividual.asing.asing)
                    }
                }else{
                    if(useAuth().user.id === newAssignIndividual.asing.asing.advisorId){
                        useConversation.pushConversation(newAssignIndividual.asing.asing)
                    }else{
                        useConversation.spliceConversation(conversationId)
                    }
                }

                
            }

        } catch (error) {
            console.log(error)
        }
    });
})

</script>

<template>

<div class="nk-chat-aside">
    <div class="nk-chat-aside-head b-search-add">                            
        <div class="nk-chat-aside-user">
            <div class="fs-5 fw-bold text-black opacity-75">
               <a class="c-ptr" @click="togglePanelAdvisor">
                    <em class="text-color fw-bold" :class="hidePanelClass"></em>
               </a>
                {{ title }}
            </div> 
        </div>

        <ul class="nk-chat-aside-tools g-2">
            <li>
                <a @click.prevent="openModalContact" class="btn btn-round btn-icon">
                    <em class="icon ni ni-user-add-fill text-color fs-3"></em>
            </a></li>
        </ul>
    </div>

    <div class="nk-chat-aside-head b-todo-asig">
        <div class="toggle-wrap nk-block-tools-toggle w-100">                            
            <div class="row">
                <div class="col b-toggle">
                    <li>
                        <a class="btn" :class="{ 'btn-active-chat': activeTab === 'tabItem1', 'btn-inactive-chat': activeTab !== 'tabItem1' }" @click="changeTab('tabItem1','Tú')">
                            <span>Tú</span>
                            <span class="badge bg-warning" v-if="unreadMessagesCountTab1 > 0" style="border-radius: 50px; margin-left: 10px;">{{ unreadMessagesCountTab1 }}</span>
                        </a>
                    </li>
                </div>
                <div class="col b-toggle">
                    <li>
                        <a class="btn" :class="{ 'btn-active-chat': activeTab === 'tabItem2', 'btn-inactive-chat': activeTab !== 'tabItem2' }" @click="changeTab('tabItem2','Sin Asignar')">
                            <span>Sin Asignar</span>
                            <span class="badge bg-warning" v-if="unreadMessagesCount > 0" style="border-radius: 50px; margin-left: 10px;">{{ unreadMessagesCount }}</span>
                        </a>
                    </li>
                </div>
                <div class="col b-toggle">
                    <li>
                        <a class="btn" :class="{ 'btn-active-chat': activeTab === 'tabItem3', 'btn-inactive-chat': activeTab !== 'tabItem3' }" @click="changeTab('tabItem3','Todo')">
                            <span>Todo</span>
                        </a>
                    </li>
                </div>
            </div>
        </div>
    </div>

    <div class="nk-chat-aside-body" data-simplebar="init">
        <div class="simplebar-wrapper" style="margin: 0px;">
            <div class="simplebar-height-auto-observer-wrapper">
                <div class="simplebar-height-auto-observer"></div>
            </div>
            <div class="simplebar-mask">
                <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                    <div class="nk-chat-aside-search mb-2 p-2">
                        <div class="form-group">
                            <div class="form-control-wrap">
                            <div class="form-icon form-icon-left">
                                <em class="icon ni ni-search"></em>
                            </div>
                            <input type="text" v-model="searchConversation" class="form-control form-round" id="default-03" placeholder="Buscar Chats"/>
                            </div>
                        </div>
                    </div>

                    <div class="text-chat justify-content-between">
                        <div class="d-flex"><h6 class="">Chats</h6></div>    
                        <div class="text-select">                                                        
                                <div class="me-1">
                                    <p class="opacity-25">FILTRAR POR:</p>
                                </div>                                                            
                                <select v-model="statusId" class="form-estado form-select" @change="selectedChat">
                                    <option v-for="status in chatsStatus" :value="status.id" :key="status.id">
                                        {{ status.name }} 
                                    </option>
                                </select>
                                <em class="icon ni ni-chevron-down select-icon fs-4" ></em>
                        </div>                                                
                    </div>

                    <div class="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content" style="height: 100%; overflow-x: scroll;">
                        <div class="simplebar-content" style="padding: 0px;">
                            
                            <!-- TUS CHAT -->
                            <div class="nk-chat-list me-1">
                                <!--Usuarios de chat-->
                                <ul class="chat-list">
                                    <li class="chat-item" v-for="(conversation, index) in filteredConversations" :key="index">
                                        <a v-if="loading" class="chat-link chat-open current">
                                            <ElSkeleton :rows="1" animated />
                                        </a>
                                        <!-- Conversacion Asignada -->
                                        <div class="" v-show="activeTab === 'tabItem1'" v-if="conversation.status_assignments==2">
                                            <a v-if="!loading" class="chat-link chat-open current" @click.prevent="selectedConversation(conversation)">
                                                <div class="chat-media user-avatar bg-user">
                                                    <span class="text-black fw-bold text-uppercase">{{ conversation.contact.name[0] }}</span>
                                                    <!-- <span class="status dot dot-lg dot-warning"></span> -->
                                                </div>
                                                <div class="chat-info">
                                                    <div class="chat-from">
                                                        <div class="name"> {{ conversation.contact.name }}</div>
                                                        <span class="time opacity-75">{{ formatTimeAgo(conversation.last_activity) }}</span>
                                                    </div>

                                                    <div class="chat-context estado justify-content-between">
                                                        <div class="text text-estado">Tomado por {{ conversation.advisorName }}</div>                                                                                                                                                
                                                    </div>
                                                </div>
                                            </a>
                                            
                                            <div class="chat-actions">
                                                <div class="unread" v-if="conversation.count_messages > 0" >
                                                    <span class="badge bg-warning" style="border-radius: 50px;">{{ conversation.count_messages }}</span>
                                                </div>
                                                <div class="dropdown">
                                                    <a href="#" class="btn btn-icon btn-sm btn-trigger dropdown-toggle"
                                                        data-bs-toggle="dropdown"><em class="icon ni ni-downward-ios text-color"></em>
                                                    </a>
                                                    <div class="dropdown-menu dropdown-menu-end chat-estados" >
                                                        <ul class="link-list-opt no-bdr">
                                                            <li v-for="(color, index) in colors" :key="index">
                                                                <a href="javascript:void(0)">
                                                                    <em class="icon ni ni-bullet-fill ms-1" :style="{ color: color.color }"></em>
                                                                    <p class="text-black">{{ color.text }}</p>
                                                                </a>
                                                            </li>                                                                               
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Conversacion sin asignar -->
                                        <div class="" v-show="activeTab === 'tabItem2'" v-if="conversation.status_assignments==1">
                                            <a v-if="!loading" class="chat-link chat-open current" @click.prevent="useAuth().user.validate === 0 && selectedConversationAdvisor(conversation)">
                                                <div class="chat-media user-avatar bg-user">
                                                    <span class="text-black fw-bold text-uppercase">{{ conversation.contact.name[0] }}</span>
                                                    <!-- <span class="status dot dot-lg dot-gray"></span> -->
                                                </div>
                                                <div class="chat-info">
                                                    <div class="chat-from">
                                                        <div class="name"> + {{ conversation.contact.num_phone }}</div>
                                                        <span class="time opacity-75">{{ formatTimeAgo(conversation.last_activity) }}</span>
                                                    </div>

                                                    <div class="chat-context estado justify-content-between">
                                                        <div class="text text-estado">{{ conversation.messages.content.mensaje }}</div>                                                                                                                                                
                                                    </div>
                                                </div>
                                            </a>
                                            <div class="chat-actions">
                                                <div class="unread" v-if="conversation.count_messages > 0" >
                                                    <span class="badge bg-warning" style="border-radius: 50px; margin-right: 5px;">{{ conversation.count_messages }}</span>
                                                </div>
                                                <button class="btn btn-asignar btn-outline-warning" @click.prevent="handleOpenModal(conversation.id)" v-if="useAuth().user.validate === 1">
                                                    Asignar
                                                </button>
                                            </div>

                                        </div>
                                    </li>

                                    <li class="chat-item" v-for="(conversation, index) in filteredUniqueConversations" :key="index" v-show="activeTab === 'tabItem3'">
                                        <a v-if="loading" class="chat-link chat-open current">
                                            <ElSkeleton :rows="1" animated />
                                        </a>

                                        <!-- Conveersacion culminada -->
                                        <a v-if="!loading" class="chat-link chat-open current" @click.prevent="selectedConversation(conversation)">
                                            <div class="chat-media user-avatar bg-user">
                                                <span class="text-black fw-bold text-uppercase">{{ conversation.contact.name[0] }}</span>
                                            </div>
                                            <div class="chat-info">
                                                <div class="chat-from">
                                                    <div class="name"> {{ conversation.contact.name }}</div>
                                                    <span class="time opacity-75">{{ formatTimeAgo(conversation.last_activity) }}</span>
                                                </div>
                                                
                                                <div class="chat-context estado justify-content-between">
                                                    <div class="text text-estado"></div>    
                                                </div>
                                            </div>
                                        </a>
                                        <div class="chat-actions">
                                            <div class="dropdown">
                                                <a href="#" class="btn btn-icon btn-sm btn-trigger dropdown-toggle"
                                                    data-bs-toggle="dropdown"><em class="icon ni ni-downward-ios text-color"></em>
                                                </a>
                                                <div class="dropdown-menu dropdown-menu-end chat-estados" >
                                                    <ul class="link-list-opt no-bdr">
                                                        <li v-for="(color, index) in colors" :key="index">
                                                            <a href="javascript:void(0)">
                                                                <em class="icon ni ni-bullet-fill ms-1" :style="{ color: color.color }"></em>
                                                                <p class="text-black">{{ color.text }}</p>
                                                            </a>
                                                        </li>                                                                               
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                </ul>
                            </div>

                            <div class="w-100 h-100 border-bottom">
                                <p hidden></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="simplebar-placeholder" style="width: auto; height: 874px;"></div>
        </div>
        <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
            <div class="simplebar-scrollbar simplebar-visible" style="width: 0px; display: none;"></div>
        </div>
        <div class="simplebar-track simplebar-vertical" style="visibility: visible;">
            <div class="simplebar-scrollbar simplebar-visible"
                style="height: 189px; transform: translate3d(0px, 0px, 0px); display: block;"></div>
        </div>
    </div>
</div>

    <!-- MODAL ASIGNAR -->
    <div class="modal fade show" v-if="modalVisible" style="display: block; background-color: rgb(24 24 24 / 40%)" tabindex="-1" aria-labelledby="staticBackdrop" data-bs-placement="start" aria-hidden="true">
        <div class="modal-dialog modal-asignar">
            <div class="modal-content">     
                <div class="modal-body p-0 m-1">
                    <div class="m-1">
                        <p class="fw-bold text-black">¿A qué asesor le asignarás el contacto?</p>                                               
                    </div>
                    <div class="rounded d-flex align-items-center mb-1" style="height: 100px; border: 1.4px solid #a9a9a9;">
                        <div class="overflow-auto caja-asignar" >
                            <div class="border-bottom ms-1 d-flex justify-content-between me-2" v-for="advisor in advisors">
                                <div>{{ advisor.name }}</div>
                                <div>
                                    <a @click.prevent="asignAdvisor(modalId, advisor.id)" class="asign-asesor">
                                        <em class="icon ni ni-check-circle me-3 text-cl fs-6"></em>
                                    </a>
                                </div>                                    
                            </div>
                        </div>
                    </div> 
                </div>
                <div class="modal-close">
                    <a type="button" class="modal-close-icon" aria-label="Close" @click="cerrarModal">
                        <em class="icon ni ni-cross-circle"></em>
                    </a>
                </div>
            </div>
        </div>                    
    </div>

<ContactModal v-if="showModal" :show-modal="showModal" :form-data="formData" @close-modal="closeModal"/>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";

.chat-actions {
    /* background-color: #fff; */
    opacity: inherit;
    top: auto;
}

.chat-item:hover {
    background-color: #ebeef2;
}

.asign-asesor{
    cursor: pointer;
}

.text-cl{
    color: #F8BC02;
}

.modal-close{
    text-align: center;
    font-size: 20px;
    
}
.modal-close-icon{
    border-radius: 5px;
    color: #F8BC02;
}



</style>