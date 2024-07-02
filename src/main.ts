import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuth } from '@/stores/auth'
import mitt from 'mitt'
import App from './App.vue'
import router from './router'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

//Sweet Alert

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
//DataTable
import DataTable from 'datatables.net-vue3';

// ELEMENT PLUS
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import es from 'element-plus/dist/locale/es.mjs'

import './assets/base.css'

const emitter = mitt();

const app = createApp(App)

app.use(createPinia())

// LOCAL
 /*window.Echo = new Echo({
    broadcaster: 'pusher',
     key: 'ASDASD2121',
     wsHost: '127.0.0.1',
     wsPort: 6001,
     cluster: 'mt1',
     forceTLS: false,
     disableStats: true,
    encrypted: false,
     authEndpoint: import.meta.env.VITE_API_URL + '/custom-broadcasting-auth',
     auth:{
         headers: {
             'Content-Type': 'application/json',
             Authorization: 'Bearer ' + useAuth().token
         }
    },
     logToConsole: true
 });*/

// SERVER

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'd84b62278648c7c95ce9',
    wsHost: 'crm-drasam-backend-production.up.railway.app',
    wsPort: 443,
    cluster: 'us2s',
    forceTLS: false,
    disableStats: true,
    encrypted: false,
    authEndpoint: import.meta.env.VITE_API_URL + '/custom-broadcasting-auth',
    auth:{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + useAuth().token
        }
    },
    logToConsole: true
});

app.provide('emitter', emitter);
app.use(router)
app.use(VueSweetalert2)
app.use(DataTable)

// ELEMENT PLUS
app.use(ElementPlus, {
    locale: es
})

app.mount('#app')