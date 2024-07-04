import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuth } from './auth';
import type { Advisor, Conversation, ClousureReason, conversationSelected, Message, Customer, Quickly } from '@/model/Type';
import { ElMessage } from 'element-plus';

export const useConversationStore = defineStore({
  id: 'conversation',
  state: () => ({
    advisors: [] as Advisor[],
    clousureReasons: [] as ClousureReason[],
    conversations: [] as Conversation[],
    uniqueConversations: [] as Conversation[],
    conversationId: null, // Almacena conversation_id aquí

    loading: false,
    loading_message: false,
    messages: [] as Message[],
    quicklyAnswer: [] as Quickly[],
    conversationSelected: undefined as conversationSelected | undefined,
    typeMessage: 'text',
    typeImage: undefined as File | undefined,
    typeFileDocument: undefined as File | undefined,
    messageUrl: '',
    messageFilename: '',
    modalContact: false,
    modalCerrar: false,
    modalReasing: false,
    modalRemenber: false,
    customers: [] as Customer[]
  }),
  actions: {
    async fetchAdvisors() {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/records`, useAuth().headers());
      this.advisors = response.data.advisors;
      this.clousureReasons = response.data.clousureReasons;
    },
    async fetchConversations() {
      try {
        this.loading = true;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/conversations`, useAuth().headers());
        this.conversations = response.data.conversations;
        this.uniqueConversations = response.data.uniqueConversations;

        this.conversations = this.sortConversationsByActivity(this.conversations);

      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async initMessage(conversation_id: any) {
      this.conversationId = conversation_id; // Asignar conversation_id a this.conversationId

      console.log("Gaa Id", this.conversationId);
     try {
        this.loading_message = true;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/messages/${conversation_id}`, useAuth().headers());
        console.log(response);
        this.messages = [];
        let item;
        for(item of response.data.messages){
          if(item.status != 'delete'){
            this.messages.push(item);
          }
        }

        //Ordenar mensajes por fechas
        this.messages.sort(function(a: any,b: any){
          let date1 = new Date(a.created_at).getTime();
          let date2 = new Date(b.created_at).getTime();
          return date1 - date2;
        });
        
     } catch (error) {
      console.log(error);
     } finally {

      this.loading_message = false;
     }
    },
    async selectedConversation(conversation: any){
      this.conversationSelected = conversation;
      if(conversation.count_messages > 0){
        this.updatedRead(conversation.id);
      }
    },
    async selectedConversationAdvisor(conversation: any){
      if(conversation.status_assignments == 1){
        this.asignAdvisor(conversation.id,useAuth().user.id);
      }
    },
    async updatedRead(conversId: any){
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/unread-customer-messages/${conversId}`, useAuth().headers());
      if(response.status==200){
        this.updatedMessagesRead(conversId);
      }else{
        console.log(response)
      }
    },
    async updatedMessagesRead(conversId: any){
      const conversationIndex = this.conversations.findIndex((conversation) => conversation.id === conversId);
      if (conversationIndex !== -1) {
        this.conversations[conversationIndex].count_messages = 0;
      }
    },
    async spliceConversation(conversationId: any){
      const index = this.conversations.findIndex((conversation) => conversation.id === conversationId);
      if (index !== -1) {
        this.conversations.splice(index, 1);
      }
    },
    async existConversation(conversationId: any) {
      const index = this.conversations.findIndex((conver) => conver.id === conversationId);
    
      if (index !== -1) {
        this.conversations = this.sortConversationsByActivity(this.conversations);
      }
    },
    async pushConversation(conversation: any) {
      const index = this.conversations.findIndex((conver) => conver.id === conversation.id);
      if (index === -1) {
        this.conversations.unshift(conversation);
      } else {
        this.conversations[index] = conversation;
      }

      this.conversations = this.sortConversationsByActivity(this.conversations);
    },
    async pushMessages(message: any) {
      const index = this.messages.findIndex((sms) => sms.id === message.id);
      if (index === -1) {
        this.messages.push(message);
      } else {
        this.messages[index] = message;
      }
    },
    sortConversationsByActivity(conversations: any) {
      return conversations.slice().sort((a: any, b: any) => {
        const date1 = new Date(a.last_activity).getTime();
        const date2 = new Date(b.last_activity).getTime();
        return date2 - date1;
      });
    },
    async sendMessage(content_message: any){
      if(this.typeMessage == 'text'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "text",
          "text": {
              "body": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      }
      else if(this.typeMessage == 'audio'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "audio",
          "audio": {
              "link": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      } else if(this.typeMessage == 'note'){
          let sendForm = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": this.conversationSelected?.contact.num_phone,
            "type": "note",
            "text": {
                "body": content_message
            }
          }
          this.sendMesssageContent(sendForm);
      }
    },
    async sendMessageTemplate(content_message: any, type: any){
     
      if(type == 'template'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "template",
          "template": {
              "name": 'hello_world',
              "language": {
                "code": "en_US"
              }
          }
        }
        this.sendMesssageContent(sendForm);
      }else if(type == 'answers'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "text",
          "text": {
              "body": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      }
    },
    async sendMessageFiles(content_message: any, textcaption: any){
      if(this.typeMessage == 'image'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "image",
          "image": {
              "caption": textcaption,
              "link": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      }
      else if(this.typeMessage == 'video'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "video",
          "video": {
              "caption": textcaption,
              "link": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      }
      else if(this.typeMessage == 'document'){
        let sendForm = {
          "messaging_product": "whatsapp",
          "recipient_type": "individual",
          "to": this.conversationSelected?.contact.num_phone,
          "type": "document",
          "document": {
              "caption": textcaption,
              "filename": this.messageFilename,
              "link": content_message
          }
        }
        this.sendMesssageContent(sendForm);
      }
    },
    async sendMesssageContent(sendData: any){
      if (this.conversationId) {
        sendData.conversation_id = this.conversationId;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/wsp/send_message`, sendData, useAuth().headers());
      const requestMessage = await response.data.conversation_id;
      this.initMessage(requestMessage);

      this.updatedRead(requestMessage);

      console.log(sendData);

      this.existConversation(requestMessage);
      
      this.reset();
    },
    async chatbotInit(data: any) {

      console.log(data);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/chatboot/init`,
          { document: data }, // Envía `document` como parte de los datos
          useAuth().headers()
        );        console.log('Respuesta del chatbot:', response.data);

        // Manejo adicional de la respuesta si es necesario
        // Puedes actualizar el estado, disparar eventos, etc.

      } catch (error) {
        console.error('Error en chatbotInit:', error);
        throw error; // Puedes manejar este error como desees en tu componente
      }
    },

    async chatbotWebhook(data: any) {
      console.log(data);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/chatboot/webhook`,
          { message: data }, // Envía `message` como parte de los datos
          useAuth().headers()
        );
        console.log('Respuesta del webhook:', response.data);
    
        // Manejo adicional de la respuesta si es necesario
        // Puedes actualizar el estado, disparar eventos, etc.
    
      } catch (error) {
        console.error('Error en chatbotWebhook:', error);
        throw error; // Puedes manejar este error como desees en tu componente
      }
    },

    async chatbotWebhookTitulacion(data: any) {
      console.log(data);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/chatboot/webhook-titulacion`,
          { message: data }, // Envía `message` como parte de los datos
          useAuth().headers()
        );
        console.log('Respuesta del webhook:', response.data);
    
        // Manejo adicional de la respuesta si es necesario
        // Puedes actualizar el estado, disparar eventos, etc.
    
      } catch (error) {
        console.error('Error en chatbotWebhook:', error);
        throw error; // Puedes manejar este error como desees en tu componente
      }
    },
    
    async chatbotWebhookTitulacionResponse(data: any) {
      console.log(data);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/chatboot/webhook-titulacion-response`,
          { message: data }, // Envía `message` como parte de los datos
          useAuth().headers()
        );
        console.log('Respuesta del webhook:', response.data);
    
        // Manejo adicional de la respuesta si es necesario
        // Puedes actualizar el estado, disparar eventos, etc.
    
      } catch (error) {
        console.error('Error en chatbotWebhook:', error);
        throw error; // Puedes manejar este error como desees en tu componente
      }
    },
    
    async reset(){
      this.typeMessage = 'text';
      this.typeImage = undefined;
      this.typeFileDocument = undefined;
      this.messageUrl = '';
      this.messageFilename ='';
    },
    async getImage(event: any){
      const file = <File>event.target.files[0];
      if(file){
        if((file.type == 'image/jpg' || file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/webp') && file.size <= 5242880){
            this.typeImage = file;
            this.typeMessage = 'image';
            this.uploadFile({file: this.typeImage});
        }else if((file.type == 'video/mp4' || file.type == 'video/3gpp') && file.size <= 16777216){
          this.typeImage = file;
          this.typeMessage = 'video';
          this.uploadFile({file: this.typeImage});
        }else{
          ElMessage.warning('No es un formato valido o el archivo es demasiado grande 5MB Imagen, 16MB Video');
          this.reset();
        }
      }else{
        this.reset();
      }
    },
    async uploadFile(fileimage: any){
      try{
        const formD = new FormData();
        formD.append('file', fileimage.file);
        const headers = useAuth().headersMultipart();
        
        const requestImage = await axios.post(`${import.meta.env.VITE_API_URL}/image/save_image`, formD, {
          headers: headers.headers,
        });

        const response = requestImage;
        
        if (response.data) {
          const img_url = response.data;
          this.getUrlFile(img_url);
        } else {
          console.error('La respuesta no contiene datos válidos.');
        }
        
      }catch (error){
        console.error(error);
      }
    },
    getFileExtension(filename: any) {
      return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
    },
    async getFileDocument(event: any){
      
      const file = <File>event.target.files[0];
      // const extension = this.getFileExtension(file.name);
      // ( extension == 'rar' || extension == 'zip' || extension == 'pdf' || extension == 'mp4' || extension == 'docx' || extension == 'txt'
      //   || extension == 'xlsx' || extension == 'pptx' || extension == 'ogg' || extension == 'mp3' || extension == 'avi')
      if(file){
        if(file.size <= 104857600){
            this.typeFileDocument = file;
            this.typeMessage = 'document';
            this.messageFilename = file.name;
            this.uploadFile({file: this.typeFileDocument});
        }else{
          ElMessage.warning('No es un formato valido o el archivo es demasiado grande, tamaño maximo 100MB');
          this.typeFileDocument = undefined;
          this.messageFilename = ''
        }
      }else{
        this.typeFileDocument = undefined;
        this.messageFilename = ''
      }
    },
    getTypeNote(){
      this.typeMessage = 'note';
    },
    async getFileTypeAudio(){
      this.typeMessage = 'audio';
    },
    async getFileAudio(file: any){
      
      if(file.size <= 16777216){
        this.uploadFile({file: file});
      }else{
        
      }
      
    },
    async getUrlFile(url: string){
      const urlParts = url.split('.');
      const extension: string = urlParts[urlParts.length - 1].toLowerCase();
      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp') {
        const getUrl = `${import.meta.env.VITE_API_URL}/image/files/images/${url}`;
        this.messageUrl = getUrl;

      }else if (extension === 'mp4' || extension === '3gpp') {
        const videoUrl = `${import.meta.env.VITE_API_URL}/image/files/videos/${url}`;
        this.messageUrl = videoUrl;
      }else if (extension === 'mp3' || extension === 'webm') {
        const audioUrl = `${import.meta.env.VITE_API_URL}/image/files/audios/${url}`;
        this.messageUrl = audioUrl;
      }else{
        const documentUrl = `${import.meta.env.VITE_API_URL}/image/files/documents/${url}`;
        this.messageUrl = documentUrl;
      }
    },
    async asignAdvisor(modalId: number, advisorId: number){
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/asign/${modalId}/${advisorId}`, null, useAuth().headers() );
        if(response.status==200){
          ElMessage.success(response.data.message);
        }
      } catch (error) {
        console.log(error)
      }
    },
    async assignIndividual(asignId: any, advisorID: any){
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/asign/chat/${asignId}/${advisorID}`, null, useAuth().headers() );
        if(response.status==200){
          ElMessage.success(response.data.message);
          this.$patch({ modalReasing: true });
          this.conversationSelected = undefined
        }
      } catch (error) {
        console.log(error)
      }
    },
    async asignAdvisorTwo(asignId: any, advisorID: any){
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/asign/chat/contact/${asignId}/${advisorID}`, null, useAuth().headers() );
        if(response.status==200){
          // ElMessage.success(response.data.message);
        }
      } catch (error) {
        console.log(error)
      }
    },
    // FUNCTION CLOSE CONVERSATION
    async closeReasonConversation(asignId: number,selectedReason: string){
      const selectedReasonInt = parseInt(selectedReason, 10);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/close/conversation/${asignId}/${selectedReasonInt}`, null, useAuth().headers() );
      if(response.status==200){
        ElMessage.success(response.data.message);
        this.$patch({ modalCerrar: true });
        this.conversationSelected = undefined;
        this.fetchConversations();
      }
    },
    // OBTENER CLIENTES ASIGNADOS POR ASESOR
    async getCustomers(){
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/reasing/conversation/${useAuth().user.id}`, useAuth().headers());
      if(response.status==200){
        this.customers = response.data.data
      }
    },
    async setAsignAdvisorContact(formData: any){

      const form = formData;

      if (!form.name) {
          ElMessage({
              message: 'Nombre obligatorio.',
              type: 'warning',
          })
          return;
      }

      if (!form.num_phone) {
          ElMessage({
              message: 'Ingrese un número de celular.',
              type: 'warning',
          })
          return;
      }

      if (!form.advisor_id && !form.id) {
          ElMessage({
              message: 'Seleccione un asesor.',
              type: 'warning',
          })
          return;
      }
      
      try {
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/contact/create`, form, useAuth().headers());
          if (response.status === 201) {
              ElMessage.success(response.data.message);
              await this.asignAdvisorTwo(response.data.data.id,response.data.data.advisor_id);
              this.$patch({ modalContact: true });
             
          }else if(response.status === 200){
            await this.asignAdvisorTwo(response.data.data.id,response.data.data.advisor_id);
            ElMessage.success('Registro actualizado');
            this.$patch({ modalContact: true });
          } else {
              ElMessage.error(response.data.message);
          }
      } 
      catch (e: any) {
          if (e.response && e.response.status === 400) {
              ElMessage.warning(e.response.data.message);
          } else {
              console.log("Error al editar el cliente", e);
          }
      }
    },
    // OBETENER RESPUESTAS RAPIDAS
    async getQuicklyAnswers(){
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/data/quickly_answers/list/${useAuth().user.id}`, useAuth().headers());
      if(response.status==200){
        this.quicklyAnswer = response.data.data
      }
    },
    async addSaveRemenber(form: any){
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/data/remenber/create`, form, useAuth().headers());
      if (response.status === 201) {
          ElMessage.success(response.data.message);
          this.$patch({ modalRemenber: true });
          this.selectedConversation(response.data.conversacionExistente);
          this.fetchConversations();
      }
    },
    async addUpdateRemenber(remenbarId: any){
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/data/remenber/update/${remenbarId}`, useAuth().headers());
      if(response.status==200){
        ElMessage.success(response.data.message);
        this.selectedConversation(response.data.conversacionExistente);
        this.fetchConversations();
      }
    },
    setModalContact(value: boolean){
      this.modalContact = value;
    },
    setmodalCerrar(value: boolean){
      this.modalCerrar = value;
    },
    setmodalReasing(value: boolean){
      this.modalReasing = value;
    },
    setmodalRemenber(value: boolean){
      this.modalRemenber = value;
    },
  }
});