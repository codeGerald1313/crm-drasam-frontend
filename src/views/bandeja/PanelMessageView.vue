<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { useConversationStore } from '../../stores/conversation';
import { useAuth } from '../../stores/auth'
import ContactModal from './registercontact/ContactModal.vue';
import ModalCerrarView from './ModalCerrarView.vue';
import ModalRemenberView from './ModalRemenberView.vue';
import FooterMessageView from './FooterMessageView.vue';
import { formatTime } from '../../utils/dateUtils';
import moment from 'moment';
import axios from 'axios';
import type { Quickly } from '@/model/Type';

const chatContainer = ref(null);
const useConversation = useConversationStore();
const loading_message = computed(() => useConversation.loading_message);
const conversation_selected = computed(() => useConversation.conversationSelected);

// ADVISORES LIST
const advisors = computed(() => useConversation.advisors);

const searchAdvisor = ref('');
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
// END ADVISOR LIST 

// Función para actualizar la barra de desplazamiento
const updateScrollbar = async () => {
    const chatDiv = document.getElementById('chat-scroll');

    if (chatDiv) {
        chatDiv.scrollTop = chatDiv.scrollHeight;
    }
}

const messages = computed(() => useConversation.messages);



watch(messages, () => {
    console.log(messages);
    // comentando settimeout se envian rapido, si lo descomento me dmoran en llegar los mensaje con conteido
    setTimeout(() => {
        nextTick(() => {

            updateScrollbar();
        });
    }, 1000);
}, { deep: true });

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

// ABRIR MODAL PARA CERRAR CONVERSACIONES

const formDataCerrar = ref({});
const showModalCerrar = ref(false);

const closeModalCerrar = () => {
    showModalCerrar.value = false;
}

const openModalCerrar = (idAsign: number) => {
    formDataCerrar.value = idAsign;
    showModalCerrar.value = true;
}

// END ABRIR MODAL REGISTRO DE CONTACTO

// MODAL RECORDAR

const formDataRemenber = ref({});
const showModalRemenber = ref(false);

const closeModalRemenber = () => {
    showModalRemenber.value = false;
}

const openModalRemenber = (idConver: number) => {
    formDataRemenber.value = idConver;
    showModalRemenber.value = true;
}

const selectedOptions: Record<string, string> = ref({});

const enviarRespuestaInteractiva = (messageId) => {
    const selectedValue = selectedOptions.value[messageId];
    if (selectedValue) {
        console.log(`Valor seleccionado para el mensaje ${messageId}: ${selectedValue}`);

        const payload = {
            mensaje_id: messageId,
            opcion_id: selectedValue
        };

        let endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion`;

        // Determinar el endpoint en base a la opción seleccionada

        // Determinar el endpoint en base a la opción seleccionada
        if (selectedValue.startsWith('opea_opcion_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-opea`;
        } else if (selectedValue.startsWith('dtrtycr_opcion_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-dtrtycr`;
        } else if (selectedValue.startsWith('rating_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/webhook-encuesta`;
        }else if (selectedValue.startsWith('ddca_opcion_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-ddca`;
        } else if (selectedValue.startsWith('doa_opcion_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-doa`;
        } else if (selectedValue.startsWith('mesa_de_partes_opcion_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-mesa-de-partes`;
        } else if (selectedValue.startsWith('doa_area_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/guardar-seleccion-oficina-doa-administrativa`;
        }else if (selectedValue.startsWith('office_')) {
            endpoint = `${import.meta.env.VITE_API_URL}/chatboot/webhook-level-2`;


            useConversation.selectedConversation(conversation_selected);

            useConversation.initMessage(conversation_selected._value.id)


            console.log(conversation_selected);
        }

        axios.post(endpoint, payload, {
            ...useAuth().headers()
        })
            .then(response => {
                console.log('Success:', response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        alert('Por favor selecciona una opción antes de enviar.');
    }
};

// END MODAL RECORDAR

const assignIndividual = (asignId: any, advisorID: any) => {
    useConversation.assignIndividual(asignId, advisorID);
}

const addUpdateRemenber = (remenbarId: number) => {
    useConversation.addUpdateRemenber(remenbarId);
}

const getIconForFileType = (filename: any) => {
    const extension = filename.split('.').pop()?.toLowerCase();

    const iconMappings: { [key: string]: string } = {
        pdf: '../../assets/icon-files/pdf.png',
        xlsx: '../../assets/icon-files/xlsx.png',
        pptx: '../../assets/icon-files/pptx.png',
        docx: '../../assets/icon-files/docx.png'
    };

    return iconMappings[extension] || '../../assets/icon-files/default.png';
}

const shouldDownloadPDF = (filename: any) => {
    return filename.endsWith('.pdf');
}

const handleFileClick = (itemVBar: any) => {
    if (shouldDownloadPDF(itemVBar.content.filename)) {
        window.open(itemVBar.content.link, '_blank');
    } else {
        window.location.href = itemVBar.content.link;
    }
}

const formatText = (text: string) => {
    let formatted = text;

    formatted = formatted.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

    formatted = formatted.replace(/\n+/g, match => '<br>'.repeat(match.length));

    return formatted;
}

const templateData = ref<Quickly[]>([]);

const getTemplate = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/template`, useAuth().headers());
    templateData.value = response.data.template;
}

const formatTextTemplate = (content: any) => {
    let name = content.name;
    const template = templateData.value.find((item) => item.title === name);
    if (template) return template.message;
    return '';
};

onMounted(async () => {
    await useConversation.fetchConversations();
    await updateScrollbar();
    await getTemplate();
});

</script>

<template>

    <ContactModal v-if="showModal" :show-modal="showModal" :form-data="formData" @close-modal="closeModal" />

    <ModalCerrarView v-if="showModalCerrar" :show-modal-cerrar="showModalCerrar" :form-data-cerrar="formDataCerrar"
        @close-modal-cerrar="closeModalCerrar" />

    <ModalRemenberView v-if="showModalRemenber" :show-modal-remenber="showModalRemenber"
        :form-data-remenber="formDataRemenber" @close-modal-remenber="closeModalRemenber" />

    <div class="nk-chat-body nk-chat-panel-none" v-if="conversation_selected == undefined"></div>
    <div class="nk-chat-body" v-if="conversation_selected != undefined">
        <!-- CHAT HEADER -->
        <div class="nk-chat-head">
            <ul class="nk-chat-head-info">
                <li class="nk-chat-body-close"><a href="#" class="btn btn-icon btn-trigger nk-chat-hide ms-n1"><em
                            class="icon ni ni-arrow-left"></em></a></li>
                <li class="nk-chat-head-user">
                    <div class="user-card">
                        <div class="user-avatar bg-user"><span class="text-black fw-bold">SG</span></div>
                        <div class="user-info">
                            <div class="lead-text">
                                {{ conversation_selected.contact.name }}
                                <span v-if="conversation_selected.contact.student == 1"><em
                                        class="ni ni-award text-warning fs-5"></em></span>
                            </div>
                            <div class="sub-text" v-if="conversation_selected.status != 'close'">
                                <a style="cursor: pointer;"
                                    @click.prevent="openModalContact(conversation_selected.contact)"
                                    class="d-none d-sm-inline me-1 opacity-75 text-black">Editar datos</a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="d-flex w-100 asignacion-chat align-items-center justify-content-end me-4"
                v-if="conversation_selected.status != 'close'">
                <div class="me-1">Asignado a</div>
                <li>
                    <div class="dropdown">
                        <!-- <a href="javascript:void(0)" v-if="conversation_selected.status=='close'" class="dropdown-toggle text-color" >
                        {{ conversation_selected.advisorName }}
                    </a>                                                                    -->
                        <el-select v-model="conversation_selected.advisorId"
                            @change="assignIndividual(conversation_selected.id_asignacion, conversation_selected.advisorId)"
                            filterable placeholder="Select" class="dropdown-toggle text-color"
                            style="font-size: 155px !important;">
                            <el-option v-for="item in advisorFilter" :key="item.id"
                                :label="item.name + ` ` + item.last_name" :value="item.id" />
                        </el-select>
                    </div>
                </li>
            </div>

            <ul class="nk-chat-head-tools">

                <div v-if="conversation_selected.status != 'close'">
                    <button type="button" class="btn btn-outline-warning me-1 rounded-pill"
                        @click="openModalCerrar(conversation_selected.id_asignacion)"><em
                            class="icon ni ni-calendar-check me-1"></em>Cerrar</button>
                </div>
                <div v-if="conversation_selected.status != 'close'">
                    <button type="button" v-if="!conversation_selected.date_remenber?.date_to_remenber"
                        class="btn btn-outline-warning me-2 rounded-pill"
                        @click="openModalRemenber(conversation_selected.id)"><em
                            class="icon ni ni-clock me-1"></em>Recordar</button>
                </div>
            </ul>
            <div class="nk-chat-head-search">
                <div class="form-group">
                    <div class="form-control-wrap">
                        <div class="form-icon form-icon-left"><em class="icon ni ni-search"></em></div>
                        <input type="text" class="form-control form-round" id="chat-search"
                            placeholder="Search in Conversation">
                    </div>
                </div>
            </div>
        </div>
        <!-- END CHAT HEADER -->

        <!-- CHAT -->
        <div class="nk-chat-panel" data-simplebar="init" v-if="loading_message">
            <div class="col-12 d-flex align-items-center justify-content-center" style="height: 70vh;">
                <div class="lds-spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="nk-chat-panel" data-simplebar="init" v-if="!loading_message">
            <div class="simplebar-wrapper" style="margin: -20px -28px;">
                <div class="simplebar-height-auto-observer-wrapper">
                    <div class="simplebar-height-auto-observer"></div>
                </div>
                <div class="simplebar-mask">
                    <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
                        <div class="simplebar-content-wrapper" tabindex="0" role="region"
                            aria-label="scrollable content" ref="chatContainer" id="chat-scroll">
                            <div class="simplebar-content" style="padding: 20px 28px;">
                                <div class="w-100 justify-content-center d-flex mb-3">
                                    <div class="estado-dia d-flex justify-content-center align-items-center">
                                        <p>Creado el {{ moment(conversation_selected.start_date).format('DD/MM/YYYY') }}
                                        </p>
                                    </div>
                                </div>
                                <div v-for="item in messages" :key="item.id">
                                    <!-- CHAT ADVISOR -->
                                    <div class="chat is-me" v-if="item.emisor == 'Advisor'">
                                        <div class="chat-content">
                                            <div class="chat-bubbles">
                                                <div class="chat-bubble">
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'text'">
                                                        <p v-html="formatText(item.content.body)"></p>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'template'">
                                                        <p>{{ formatTextTemplate(item.content) }}</p>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'note'">
                                                        <span class="text-warning"
                                                            v-if="useAuth().user.id === item.emisor_id && useAuth().user.validate === 1">Observación:
                                                        </span>
                                                        <span class="text-warning"
                                                            v-else-if="useAuth().user.id === item.emisor_id && useAuth().user.validate === 0">Nota:
                                                        </span>
                                                        <span class="text-warning"
                                                            v-else-if="useAuth().user.validate === 1">Nota: </span>
                                                        <span class="text-warning" v-else>Observación: </span>
                                                        <p>{{ item.content.body }}</p>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'interactive'">
                                                        <div class="interactive-message">
                                                            <p>{{ item.content.interactive.body.text }}</p>
                                                            <div v-for="section in item.content.interactive.action.sections"
                                                                :key="section.title" class="interactive-section">
                                                                <h4>{{ section.title }}</h4>
                                                                <ul>
                                                                    <li v-for="row in section.rows" :key="row.id"
                                                                        class="interactive-option">
                                                                        <label>
                                                                            <input type="radio"
                                                                                :name="'option-' + item.id"
                                                                                :value="row.id"
                                                                                v-model="selectedOptions[item.id]">
                                                                            {{ row.title }}
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <button v-if="selectedOptions[item.id]"
                                                                class="interactive-send-button"
                                                                @click="enviarRespuestaInteractiva(item.id)">
                                                                ESCOGER
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'audio'">
                                                        <audio controls>
                                                            <source :src="item.content.link" type="audio/ogg">
                                                        </audio>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'image'">
                                                        <img :src="item.content.link" data-action="zoom" alt="" />
                                                        <p v-if="item.content.caption"
                                                            v-html="formatText(item.content.caption)"></p>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded p-0 m-0"
                                                        v-if="item.type === 'video'">
                                                        <video controls width="320" height="240">
                                                            <source :src="item.content.link" type="video/mp4">
                                                        </video>
                                                        <p v-if="item.content.caption"
                                                            v-html="formatText(item.content.caption)"></p>
                                                    </div>
                                                    <div class="color-chat chat-msg shadow rounded"
                                                        v-if="item.type === 'document'">
                                                        <a @click.prevent="handleFileClick(item)">
                                                            <div class="document-info"
                                                                :title="`Descargar ` + item.content.filename">
                                                                <img :src="getIconForFileType(item.content.filename)"
                                                                    class="size-img">
                                                                <div class="c-name">
                                                                    <span class="document-name">{{ item.content.filename
                                                                        }}</span>
                                                                </div>
                                                                <button class="button-download"><em
                                                                        class="ni ni-download"></em></button>
                                                            </div>
                                                            <p v-if="item.content.caption"
                                                                v-html="formatText(item.content.caption)"></p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="chat-meta">
                                                <li>{{ formatTime(item.date_of_issue) }}</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <!-- CHAT CUSTOMER -->
                                    <div class="chat is-you" v-if="item.emisor == 'Customer'">
                                        <div class="chat-content">
                                            <div class="chat-bubbles">
                                                <div class="chat-bubble">
                                                    <div class="chat-msg shadow rounded" v-if="item.type === 'text'">
                                                        <p v-html="formatText(item.content.body)"></p>
                                                    </div>
                                                    <div class="" v-if="item.type === 'interactive'">
                                                        <div class="interactive-message">
                                                            <p>{{ item.content.interactive.body.text }}</p>
                                                            <div v-for="section in item.content.interactive.action.sections"
                                                                :key="section.title" class="interactive-section">
                                                                <h5>{{ section.title }}</h5>
                                                                <ul>
                                                                    <li v-for="row in section.rows" :key="row.id"
                                                                        class="interactive-option">
                                                                        <label>
                                                                            <input type="radio"
                                                                                :name="'option-' + item.id"
                                                                                :value="row.id"
                                                                                v-model="selectedOptions[item.id]">
                                                                            {{ row.title }}
                                                                        </label>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <button v-if="selectedOptions[item.id]"
                                                                class="interactive-send-button"
                                                                @click="enviarRespuestaInteractiva(item.id)">
                                                                ESCOGER
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="" v-if="item.type === 'audio'">
                                                        <audio controls>
                                                            <source :src="item.content.link" type="audio/ogg">
                                                        </audio>
                                                    </div>
                                                    <div class="chat-msg shadow rounded" v-if="item.type === 'image'">
                                                        <img :src="item.content.link" data-action="zoom" alt="" />
                                                        <p v-if="item.content.caption"
                                                            v-html="formatText(item.content.caption)"></p>
                                                    </div>
                                                    <div class="" v-if="item.type === 'video'">
                                                        <video controls width="320" height="240">
                                                            <source :src="item.content.link" type="video/mp4">
                                                        </video>
                                                        <p v-if="item.content.caption"
                                                            v-html="formatText(item.content.caption)"></p>
                                                    </div>
                                                    <div class="chat-msg shadow rounded"
                                                        v-if="item.type === 'document'">
                                                        <a @click.prevent="handleFileClick(item)">
                                                            <div class="document-info"
                                                                :title="`Descargar ` + item.content.filename">
                                                                <img :src="getIconForFileType(item.content.filename)"
                                                                    class="size-img">
                                                                <div class="c-name">
                                                                    <span class="document-name">{{ item.content.filename
                                                                        }}</span>
                                                                </div>
                                                                <button class="button-download"><em
                                                                        class="ni ni-download"></em></button>
                                                            </div>
                                                            <p v-if="item.content.caption"
                                                                v-html="formatText(item.content.caption)"></p>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="chat-meta">
                                                <li>{{ formatTime(item.date_of_issue) }}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>



                                <div class="w-100 justify-content-center d-flex mb-3"
                                    v-if="conversation_selected.status == 'close'">
                                    <div class="d-flex align-items-center close-conver">
                                        <p>
                                            <span style="margin-right: 100px">
                                                Cerrado: {{ conversation_selected.lastAssignment.name }}
                                            </span>
                                            <span>
                                                {{ formatTime(conversation_selected.last_assign.time) }}
                                            </span>
                                        </p>

                                    </div>
                                </div>

                                <div class="w-100 justify-content-center d-flex mb-3"
                                    v-if="conversation_selected.date_remenber">
                                    <div class="d-flex align-items-center "
                                        style="border: 1px solid #4B69B6; padding: 5px; border-radius: 50px;">
                                        <p>
                                            <span style="margin-right: 100px; color: #4B69B6;">
                                                Agendado: {{ conversation_selected.date_remenber?.date_to_remenber }}
                                            </span>
                                            <span style="color: #4B69B6;">
                                                {{ conversation_selected.date_remenber?.time_to_remenber }}
                                            </span>
                                            <a @click="addUpdateRemenber(conversation_selected.date_remenber.id)"
                                                class="btn btn-sm" style="color: #4B69B6; font-size: 16px;">
                                                <em class="ni ni-cross-circle"></em>
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="simplebar-placeholder" style="width: auto; height: 887px;"></div>
            </div>
            <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
                <div class="simplebar-scrollbar" style="width: 0px; display: none;"></div>
            </div>
            <div class="simplebar-track simplebar-vertical" style="visibility: visible;">
                <div class="simplebar-scrollbar"
                    style="height: 161px; transform: translate3d(0px, 216px, 0px); display: block;"></div>
            </div>
        </div>

        <!-- END CHAT -->

        <!-- CHAT FOOTER -->
        <FooterMessageView />
        <!-- END CHAT FOOTER -->
    </div>

</template>

<style scoped>
@import "../../assets/css/Bandeja.css";

.close-conver {
    padding: 15px;
    height: 30px;
    background: #ffffff;
    color: #16ac09;
    border-radius: 11px;
    outline: 1px solid #16ac09;
}

.interactive-message {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
}

.interactive-section {
    margin-top: 10px;
}

.interactive-section h4 {
    font-weight: bold;
    margin-bottom: 5px;
}

.interactive-option {
    list-style-type: none;
    margin-bottom: 5px;
}

.interactive-option label {
    display: flex;
    align-items: center;
}

.interactive-option input[type="radio"] {
    margin-right: 10px;
}

.interactive-send-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #25D366;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}


.icon-img {
    padding-left: 3px;
}

.document-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}

.size-img {
    color: #F34646;
    width: 26px;
    height: 30px;
}

.c-name {
    flex-grow: 1;
    margin-right: 10px;
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.document-name {
    font-size: 13px;
    color: #000;
}

.button-download {
    background-color: #b6b6b6;
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 5px 10px;
}

.button-download:hover {
    background-color: #b6b6b6;
}

#note-message {
    background-color: #FFFAEC;
    border: 1px solid #F8BC02;
}
</style>