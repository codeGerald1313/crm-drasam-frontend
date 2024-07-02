<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useHidePaneltoreStore } from '../../stores/hidePanel';
import PanelAsesor from './AsesorView.vue';
import PanelChat from './PanelChatView.vue';
import PanelMessage from './PanelMessageView.vue';
import { useAuth } from '../../stores/auth'
import { useConversationStore } from '../../stores/conversation';

const useConversation = useConversationStore();

const useHidePanel = useHidePaneltoreStore();
const hidePanel = computed(() => useHidePanel.hidePanelAdvisor);

watch(hidePanel, (newValue, oldValue) => {
    useHidePanel.updatePanelState(newValue);
});

onMounted(async() => {
    window.Echo.channel('listen-message').listen('ListenNewMessage', (conversation: any) => {
        console.log(conversation);
        try {
            if(conversation){
                if(useAuth().user.id != conversation.data.userId){
                    useConversation.updatedMessagesRead(conversation.data.conversation.id);
                }
            }
        } catch (error) {
            console.log(error)
        }
    })
})

</script>
 
<template>
    <div class="nk-content p-0">
        <div class="nk-content-inner">
            <div class="nk-content-body">
                <!-- PANEL ASESORES -->
                <div class="nk-chat asesores-pane">
                    <PanelAsesor v-if="hidePanel"/>
                    
                    <!-- PANEL CHATS -->
                    <PanelChat />
                    
                    <!-- PANEL MESSAGES -->
                    <PanelMessage />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../../assets/css/Bandeja.css";
</style>