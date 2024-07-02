import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuth } from './auth';
import type { Date, closedClients } from '@/model/Type';

export const useDesktop = defineStore('', {
    state: () => ({
        type_select_name: '',

        firtsResponseTime: '',
        newContacts: [],
        closedConversations: [],
        interactionsWithContacts: [],
        closedClients: [] as closedClients[],
        teamPerformance: [],

        tomorrow: [],
        late: [],
        evening: [],

        t_activeConversations: 0,

        t_newContacts: 0,
        t_closedConversations: 0,
        t_interactionsWithContacts: 0,
    }),
    actions: {


        async getWeekData() {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/week`, useAuth().headers());
           
            this.firtsResponseTime = response.data.data.firtsResponseTime.original.data[0];
            this.newContacts = response.data.data.newContacts.original.new_contacts;
            this.closedConversations = response.data.data.closedConversations.original.closed_contacts;
            this.interactionsWithContacts = response.data.data.interactionsWithContacts.original.data;
            this.closedClients = response.data.data.closedClients.original.data;
            this.teamPerformance = response.data.data.teamPerformance.original.data;

            this.tomorrow = response.data.data.busiestConversationTime.original.data[0]['tomorrow'];
            this.late = response.data.data.busiestConversationTime.original.data[0]['late'];
            this.evening = response.data.data.busiestConversationTime.original.data[0]['evening'];
            
            this.t_activeConversations = response.data.data.busiestConversationTime.original.data[0]['total_all'];
 
            this.t_newContacts = response.data.data.newContacts.original.total;
            this.t_closedConversations =  response.data.data.closedConversations.original.total;
            this.t_interactionsWithContacts = response.data.data.interactionsWithContacts.original.total;

            this.type_select_name = 'De los 7 días anteriores';
        },
        async getMonthData() {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/month`, useAuth().headers());

            this.firtsResponseTime = response.data.data.firtsResponseTime.original.data[0];
            this.newContacts = response.data.data.newContacts.original.new_contacts;
            this.closedConversations = response.data.data.closedConversations.original.closed_contacts;
            this.interactionsWithContacts = response.data.data.interactionsWithContacts.original.data;
            this.closedClients = response.data.data.closedClients.original.data;
            this.teamPerformance = response.data.data.teamPerformance.original.data;
            
            this.tomorrow = response.data.data.busiestConversationTime.original.data[0]['tomorrow'];
            this.late = response.data.data.busiestConversationTime.original.data[0]['late'];
            this.evening = response.data.data.busiestConversationTime.original.data[0]['evening'];

            this.t_activeConversations = response.data.data.busiestConversationTime.original.data[0]['total_all'];


            this.t_newContacts = response.data.data.newContacts.original.total;
            this.t_closedConversations =  response.data.data.closedConversations.original.total;
            this.t_interactionsWithContacts = response.data.data.interactionsWithContacts.original.total;

            this.type_select_name = 'De todo el mes';
        },
        async getPersonalizedData(data: Date) {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/reports/personalized`, data,useAuth().headers());

            this.firtsResponseTime = response.data.data.firtsResponseTime.original.data[0];
            this.newContacts = response.data.data.newContacts.original.new_contacts;
            this.closedConversations = response.data.data.closedConversations.original.closed_contacts;
            this.interactionsWithContacts = response.data.data.interactionsWithContacts.original.data;
            this.closedClients = response.data.data.closedClients.original.data;
            this.teamPerformance = response.data.data.teamPerformance.original.data;
            
            this.tomorrow = response.data.data.busiestConversationTime.original.data[0]['tomorrow'];
            this.late = response.data.data.busiestConversationTime.original.data[0]['late'];
            this.evening = response.data.data.busiestConversationTime.original.data[0]['evening'];

            this.t_activeConversations = response.data.data.busiestConversationTime.original.data[0]['total_all'];

            this.t_newContacts = response.data.data.newContacts.original.total;
            this.t_closedConversations =  response.data.data.closedConversations.original.total;
            this.t_interactionsWithContacts = response.data.data.interactionsWithContacts.original.total;

            this.type_select_name = 'Mes de ' + months[data.month - 1] + ' del ' + data.year;
        }
    }
});