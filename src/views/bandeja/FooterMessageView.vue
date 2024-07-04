<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useConversationStore } from '../../stores/conversation';
import { ElMessage } from 'element-plus';
import Oscilloscope from '../../utils/Oscilloscope';
import EmojiPicker from '../emojiPicker/EmojiPicker.vue';

const inputValue = ref('');
const textcaptionValue = ref('');
const useConversation = useConversationStore();

const conversation_selected = computed(() => useConversation.conversationSelected);
const quicklyAnswer = computed(() => useConversation.quicklyAnswer);
const type_message = computed(() => useConversation.typeMessage);
const messageUrl = computed(() => useConversation.messageUrl);


let oscilloscope: Oscilloscope | null = null;

const isRecording = ref(false);

const startRecording = async () => {
    await useConversation.getFileTypeAudio();

    if (type_message.value === 'audio') {
        if (oscilloscope === null) {
            oscilloscope = new Oscilloscope('oscilloscopeCanvas');
            await oscilloscope.initialize();
        }
        oscilloscope.startRecording();
        isRecording.value = true;
    }

}

const stopRecording = () => {
    if (oscilloscope !== null) {
        oscilloscope.stopRecording();
        oscilloscope.cleanup();
        oscilloscope.stopDrawingVisualization();
        oscilloscope = null;
        isRecording.value = false;
    }
}

const getImage = (event: any) => {
    useConversation.getImage(event);
}

const getFileDocument = (event: any) => {
    useConversation.getFileDocument(event);
}

const removeImage = () => {
    useConversation.typeMessage = 'text';
    textcaptionValue.value = ''
    messageUrl.value == ''
}

const removeTypeNote = () => {
    useConversation.typeMessage = 'text';
    inputValue.value = ''
}

const sendFormat = (text: string) => {
    let formatted = text.replace(/\n+/g, match => '\n'.repeat(match.length));

    return formatted;
}

const sendMessageFiles = (data: any, textcaption: any) => {
    if (textcaption.trim() === '' && textcaption.length !== 0) {

        ElMessage({
            message: 'No se puede enviar espacios en blanco.',
            type: 'warning',
        })
        return;
    }

    useConversation.sendMessageFiles(data, textcaption);
    messageUrl.value
    textcaptionValue.value = ''

}

const sendMessage = (data: any) => {
    const conversation_selected = computed(() => useConversation.conversationSelected);

    if (type_message.value == 'text') {
        if (!data || data.trim() === '') {
            ElMessage({
                message: 'Ingrese el mensaje a enviar.',
                type: 'warning',
            })
            return;
        }

        let formtTextData = sendFormat(data);

        useConversation.sendMessage(formtTextData);
        inputValue.value = ''
        const currentConversation = conversation_selected.value;


        console.log(currentConversation);

        // Verificar si `data` es un DNI válido (8 dígitos)
        if (typeof data === 'string' && data.trim().length === 8 && !isNaN(parseInt(data.trim(), 10))) {
            useConversation.chatbotInit(data);
        } else if (typeof data === 'string' && data.trim().length > 0) {
            // Si no es un DNI, verificar si es un mensaje válido para el webhook
            if (currentConversation.advisorId === 3) {
                useConversation.chatbotWebhookTitulacionResponse(data);

    } else if (currentConversation.contact_id === 53 ) {
        useConversation.chatbotWebhookTitulacion(data);

    } else {
        useConversation.chatbotWebhook(data);
    }
        }
    } else if (type_message.value == 'audio') {
        useConversation.sendMessage(data);
        messageUrl.value
    } else if (type_message.value == 'note') {
        useConversation.sendMessage(data);
        inputValue.value = ''
    }
}


const addNote = () => {
    useConversation.getTypeNote();
}

const sendAnswerFast = (answerFast: any, type: any) => {
    if (type == "answers") {
        useConversation.sendMessageTemplate(answerFast, type);
    } else {
        useConversation.sendMessageTemplate(answerFast, type);
    }
}

const showEmoji = ref(false);

const closeEmoji = () => {
    showEmoji.value = false;
}

const openEmoji = () => {
    showEmoji.value = true;
}

const handleEmojiValue = (emoji: string) => {
    inputValue.value += emoji;
}

const getQuickly = computed(() => {
    const records = quicklyAnswer.value.filter((quickly: any) => {
        if (quickly.type == 'template') {
            return quickly.type == 'template';
        } else if (quickly.type == 'answers') {
            return quickly.user_id == conversation_selected.value?.advisorId;
        }
        return false;
    });
    return records;
});


onMounted(async () => {
    await useConversation.getQuicklyAnswers();
});

onBeforeUnmount(() => {
    if (oscilloscope !== null) {
        oscilloscope.cleanup();
        oscilloscope = null;
    }
});

</script>

<template>

    <form data-emoji-form="" v-if="conversation_selected != undefined">
        <div class="nk-chat-editor">
            <div class="nk-chat-editor-upload  ms-n1"
                v-if="type_message != 'image' && type_message != 'video' && type_message != 'document'">
                <el-dropdown trigger="click" style="border-radius: 16px;">
                    <span class="el-dropdown-link">
                        <em class="icon ni ni-plus-circle text-black fs-2"></em>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                <label for="fileImage" class="icon-img">
                                    <em class="icon ni ni-img-fill text-color fs-icon-20"></em>
                                    <span class="fs-icon-3">Imagen / Videos</span>
                                </label>
                                <input type="file" @change="getImage($event)" style="display: none;" id="fileImage"
                                    accept="image/png, image/jpg, image/jpeg, video/mp4">
                            </el-dropdown-item>
                            <el-dropdown-item @click.prevent="addNote()">
                                <em class="icon ni ni-files text-color fs-2"></em>
                                <span class="fs-icon-3">Agregar nota</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <label for="fileDocument" class="icon-img p-0">
                                    <em class="icon ni ni-clip-v text-color fs-2"></em>
                                    <span class="fs-icon-3">Adjuntar</span>
                                </label>
                                <input type="file" @change="getFileDocument($event)" style="display: none;"
                                    id="fileDocument" accept="
                                .rar,
                                application/zip,
                                application/pdf,
                                application/vnd.ms-powerpoint,
                                application/msword,
                                application/vnd.ms-excel,
                                application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                application/vnd.openxmlformats-officedocument.presentationml.presentation,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="nk-chat-editor-upload ms-2"
                v-if="type_message != 'image' && type_message != 'video' && type_message != 'document'">
                <el-dropdown ref="dropdown" trigger="click" style="border-radius: 16px;">
                    <span class="el-dropdown-link">
                        <em class="icon ni ni-file-docs text-color fs-2"></em>
                    </span>
                    <template #dropdown v-if="quicklyAnswer.length > 0">
                        <el-dropdown-menu>
                            <h6 class="title mt-2" style="margin-left: 28px;">Plantillas / Respuestas de mensajes</h6>
                            <el-dropdown-item v-for="quickly in getQuickly" :key="quickly.id"
                                @click="sendAnswerFast(quickly.message.replace('{nombre del contacto}', conversation_selected.contact.name), quickly.type)">
                                <a href="javascript:void(0)" class="text-secondary">
                                    <div class="card-inner p-2">
                                        <div class="align-center justify-between">
                                            <div class="g">
                                                <h6 class="title" style="font-size: .9rem;"><em
                                                        class="icon ni ni-whatsapp text-success fs-icon-01"></em> {{
                                                            quickly.title }}</h6>
                                                <p>
                                                    {{ quickly.message.replace('{nombre del contacto}',
                                                        conversation_selected.contact.name) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class="nk-chat-editor-upload ms-2"
                v-if="type_message != 'image' && type_message != 'video' && type_message != 'document'"
                @click.prevent="openEmoji">
                <el-dropdown ref="dropdown" trigger="click">
                    <span class="el-dropdown-link">
                        <em class="icon ni ni-happy text-color fs-2"></em>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu class="p-0">
                            <EmojiPicker v-if="showEmoji" :show-emoji="showEmoji" @close-emoji="closeEmoji"
                                @emoji_value="handleEmojiValue" />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="nk-chat-editor-upload  ms-n1"
                v-if="type_message != 'image' && type_message != 'video' && type_message != 'document'">
                <a href="javascript:void(0)" @click.prevent="startRecording"
                    class="btn btn-sm btn-icon btn-trigger text-primary toggle-opt ms-2" data-target="chat-upload">
                    <em class="text-color ni ni-mic fs-2"></em>
                </a>
            </div>

            <div class="nk-chat-editor-form" v-if="type_message == 'note'">
                <div class="form-control-wrap">
                    <div class="input-group">
                        <input type="text" class="form-control form-control-simple no-resize input-text"
                            id="default-textarea" placeholder="Agregar Nota" v-model="inputValue"
                            @keydown.enter.prevent="sendMessage(inputValue)">
                        <span class="input-group-text">
                            <button
                                style="border-radius: 50px; background-color: #F8BC02; color: #fff; border: 1px solid #F8BC02;"
                                @click.prevent="removeTypeNote">X</button>
                        </span>
                    </div>
                </div>
            </div>

            <div class="nk-chat-editor-form" v-if="type_message == 'text'">
                <div class="form-control-wrap">
                    <textarea class="form-control form-control-simple no-resize input-text" rows="1"
                        id="default-textarea" data-autosize="true" v-model="inputValue"
                        @keydown.enter.prevent="sendMessage(inputValue)">
        </textarea>
                </div>
            </div>

            <div class="nk-chat-editor-form" v-if="type_message === 'image'">
                <div class="form-control-wrap">
                    <div class="demo-image__preview text-center">
                        <div class="image-preview-container" v-if="type_message">
                            <ElImage v-if="messageUrl" :src="messageUrl" :zoom-rate="1.2" :initial-index="4"
                                fit="cover" />
                            <div class="section-spinner" data-index="39" v-else>
                                <span class="loader-spinner"></span>
                            </div>
                            <textarea class="form-control form-control-simple no-resize input-text-multimedia" rows="1"
                                id="default-textarea" data-autosize="true" v-model="textcaptionValue"
                                @keydown.enter.prevent="sendMessageFiles(messageUrl, textcaptionValue)">
                </textarea>
                            <button class="remove-image-button" @click="removeImage">X</button>
                        </div>
                        <div v-else>
                            <input type="file" @change="getImage" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="nk-chat-editor-form" v-if="type_message === 'video'">
                <div class="form-control-wrap">
                    <div class="demo-image__preview text-center">
                        <div class="image-preview-container" v-if="type_message">
                            <video v-if="messageUrl" controls width="320" height="240">
                                <source :src="messageUrl" type="video/mp4">
                            </video>
                            <div class="section-spinner" data-index="39" v-else>
                                <span class="loader-spinner"></span>
                            </div>
                            <textarea class="form-control form-control-simple no-resize input-text-multimedia" rows="1"
                                id="default-textarea" data-autosize="true" v-model="textcaptionValue">
                </textarea>
                            <button class="remove-image-button" @click="removeImage">X</button>
                        </div>
                        <div v-else>
                            <input type="file" @change="getImage" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="nk-chat-editor-form" v-if="type_message === 'document'">
                <div class="form-control-wrap">
                    <div class="demo-image__preview text-center">
                        <div class="image-preview-container" v-if="type_message">
                            <em v-if="messageUrl" class="icon ni ni-file text-color fs-icon-rm"></em>
                            <div class="section-spinner" data-index="39" v-else>
                                <span class="loader-spinner"></span>
                            </div>
                            <textarea class="form-control form-control-simple no-resize input-text-multimedia" rows="1"
                                id="default-textarea" data-autosize="true" v-model="textcaptionValue">
                </textarea>
                            <button class="remove-image-button" @click="removeImage">X</button>
                        </div>
                        <div v-else>
                            <input type="file" @change="getFileDocument" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="nk-chat-editor-form" v-if="type_message === 'audio'">
                <div class="form-control-wrap" style="display: flex;">
                    <canvas id="oscilloscopeCanvas" width="250" height="11"></canvas>
                    <svg @click.prevent="stopRecording" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24"
                        version="1.1" style="height: 2.5rem !important;width: 2.5rem !important; cursor: pointer;">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <rect x="0" y="0" width="24" height="24" />
                            <path
                                d="M8,6 L10,6 C10.5522847,6 11,6.44771525 11,7 L11,17 C11,17.5522847 10.5522847,18 10,18 L8,18 C7.44771525,18 7,17.5522847 7,17 L7,7 C7,6.44771525 7.44771525,6 8,6 Z M14,6 L16,6 C16.5522847,6 17,6.44771525 17,7 L17,17 C17,17.5522847 16.5522847,18 16,18 L14,18 C13.4477153,18 13,17.5522847 13,17 L13,7 C13,6.44771525 13.4477153,6 14,6 Z"
                                fill="#000000" />
                        </g>
                    </svg>
                </div>
            </div>
            <ul class="nk-chat-editor-tools g-2">
                <li>
                    <button type="submit" class="btn btn-round btn-icon" @click.prevent="sendMessage(inputValue)"
                        v-if="type_message === 'text' || type_message === 'note'">
                        <em class="text-color icon ni ni-send-alt fs-2"></em>
                    </button>
                    <button type="submit" class="btn btn-round btn-icon"
                        @click.prevent="sendMessageFiles(messageUrl, textcaptionValue)"
                        v-if="(type_message === 'image' || type_message === 'video' || type_message === 'document') && messageUrl">
                        <em class="text-color icon ni ni-send-alt fs-2"></em>
                    </button>
                    <button type="submit" class="btn btn-round btn-icon" @click.prevent="sendMessage(messageUrl)"
                        v-if="(type_message === 'audio') && messageUrl">
                        <em class="text-color icon ni ni-send-alt fs-2"></em>
                    </button>
                </li>
            </ul>
        </div>
    </form>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";

.section-spinner {
    min-width: 200px;
    width: 33.33%;
    height: 360px;
    padding: 10px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    cursor: pointer;
    transition: .2s linear;
}

.loader-spinner {
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
    border-width: 3px 2px 3px 2px;
    border-style: solid dotted solid dotted;
    border-color: #F8BC02 rgba(255, 255, 255, 0.3) #fff rgba(151, 107, 93, 0.3);
    border-radius: 50%;
    box-sizing: border-box;
    animation: 1s rotate linear infinite;
}

.loader-spinner:before,
.loader-spinner:after {
    content: '';
    top: 0;
    left: 0;
    position: absolute;
    border: 10px solid transparent;
    border-bottom-color: #fff;
    transform: translate(-10px, 19px) rotate(-35deg);
}

.loader-spinner:after {
    border-color: #F8BC02 #0000 #0000 #0000;
    transform: translate(32px, 3px) rotate(-35deg);
}

@keyframes rotate {
    100% {
        transform: rotate(360deg)
    }
}
</style>