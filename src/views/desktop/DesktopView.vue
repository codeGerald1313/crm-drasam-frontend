
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import BarChartItem from './BarChartItem.vue';
import SchedulestatisticsItem from './SchedulestatisticsItem.vue';
import FirstResponseTimeItem from './FirstResponseTimeItem.vue';
import ActivityMonitorItem from './ActivityMonitorItem.vue';
import TeamPerformanceItem from './TeamPerformanceItem.vue';
import FilterItem from './FilterItem.vue';
import type { Contacts } from '@/model/Type';

// Pinia
import { useDesktop } from '../../stores/desktop';
const desktop = useDesktop();

declare const bootstrap: any;

const type_select = computed(() => desktop.type_select_name);

const firtsAnswers = computed(() => desktop.firtsResponseTime);

const t_NewContacts = computed(() => desktop.t_newContacts);
const t_ClosedConversations = computed(() => desktop.t_closedConversations);
const t_InteractionsWithContacts = computed(() => desktop.t_interactionsWithContacts);

const CS_NewContacts = ref([{name: '', data: computed(() => desktop.newContacts.map((element: Contacts) => element.number))}]);
const CS_ClosedConversations = ref([{name: '', data: computed(() => desktop.closedConversations.map((element: Contacts) => element.number))}]);
const CS_InteractionsWithContacts = ref([{name: '', data: computed(() => desktop.interactionsWithContacts.map((element: Contacts) => element.number))}]);

const tomorrow = ref(computed(() => desktop.tomorrow));
const late = ref(computed(() => desktop.late));
const evening = ref(computed(() => desktop.evening));

const t_activeConversationsWeek = ref(computed(() => desktop.t_activeConversations));

console.log(t_activeConversationsWeek);


const ActivityMonitor = computed(() => desktop.closedClients);
const team_performance = computed(() => desktop.teamPerformance);

const activeTab = ref('tabItem1');

const selectDate = ref(1);

const formData = reactive({
    month: 1,
    year: 2023,
});

const openModal = () => {
    const myModalElement = document.getElementById('personalizado');

    if (myModalElement) {
        const myModal = new bootstrap.Modal(myModalElement);
        myModal.show();
        selectDate.value = 1
    }
}

const changeTab = (tabId: any) => {
    activeTab.value = tabId
}

const getData = async (id: number) => {
    if (id == 1) {
        desktop.getWeekData();

    } else if (id == 2) {
        desktop.getMonthData();
    }
};

const personalized_date = async () => {
    desktop.getPersonalizedData(formData);
}

onMounted(() => {
    desktop.getWeekData();
});

</script>

<template>
    <div class="nk-content">

        <div class="container-fluid bg-white m-0 p-0">
            <ul class="nav nav-tabs">

                <div class="d-flex nav-buttons">
                    <li class="nav-item res-nav-item" :class="{ 'activeTab': activeTab === 'tabItem1' }"
                        @click="changeTab('tabItem1')">
                        <a class="btn btn-tab color-bottons">
                            <span class="res-text fw-semibold d-flex justify-content-center">
                                <p class="res-text-2">Nuevas conversaciones</p>
                            </span>
                        </a>
                    </li>
                    <li class="nav-item res-nav-item" :class="{ 'activeTab': activeTab === 'tabItem2' }"
                        @click="changeTab('tabItem2')">
                        <a class="btn btn-tab color-bottons">
                            <span class="res-text fw-semibold d-flex justify-content-center">
                                <p class="res-text-2">Monitoriar actividades</p>
                            </span></a>
                    </li>
                    <li class="nav-item res-nav-item" :class="{ 'activeTab': activeTab === 'tabItem3' }"
                        @click="changeTab('tabItem3')">
                        <a class="btn btn-tab color-bottons">
                            <span class="res-text fw-semibold d-flex justify-content-center">
                                <p class="res-text-2">Rendimiento del equipo
                                </p>
                            </span></a>
                    </li>
                </div>

                <FilterItem :get_data="getData" :open_modal="openModal" />

            </ul>
            <div class="tab-content">

                <div class="tab-pane" :class="{ 'active': activeTab === 'tabItem1' }" v-show="activeTab === 'tabItem1'">

                    <div class="d-flex justify-content-center res-container res-container-top position-relative">
                        <div class="d-flex flex-wrap justify-content-center">
                            <div>
                                <FirstResponseTimeItem :type_select="type_select" :time="firtsAnswers" />

                                <BarChartItem :total="t_NewContacts" :type_select="type_select" :title="'Contactos nuevos'"
                                    :description="'Podrás ver cuántas conversaciones cerró tu equipo en el periodo seleccionado'"
                                    :chartSeries="CS_NewContacts" />
                            </div>

                            <div>
                                <div class="d-flex res-container-2 res-container3-4">
                                    <BarChartItem :total="t_ClosedConversations" :type_select="type_select"
                                        :title="'Conversaciones cerradas'"
                                        :description="'Podrás ver cuántas conversaciones cerró tu equipo en el periodo seleccionado'"
                                        :chartSeries="CS_ClosedConversations" />

                                    <BarChartItem :total="t_InteractionsWithContacts" :type_select="type_select"
                                        :title="'Interacciones con contactos'"
                                        :description="'Se visualizará la cantidad de contactos en el que los asesores interactuaron'"
                                        :chartSeries="CS_InteractionsWithContacts" />
                                </div>

                                <SchedulestatisticsItem  :totalWeek="t_activeConversationsWeek" :tomorrow="tomorrow" :late="late" :evening="evening" id="sche-s" />
                            </div>
                        </div>

                    </div>

                    <div class="d-flex container-5-2 justify-content-center">
                        <SchedulestatisticsItem :tomorrow="tomorrow" :late="late" :evening="evening" />
                    </div>

                </div>

                <div class="tab-pane" :class="{ 'active': activeTab === 'tabItem2' }" v-show="activeTab === 'tabItem2'">
                    <div class="d-flex res-search">
                        <div class="ms-3 d-flex justify-content-end align-items-center" style="width: 262px;">
                            <input type="text" class="input-search" placeholder="Buscar asesor">
                            <em class="icon ni ni-search pe-none position-absolute me-2 mb-1 fs-5 color-text fw-bold"></em>
                        </div>
                    </div>
                    <div class="custom-container">
    <div class="row">
      <div class="col-md-6" v-for="item in ActivityMonitor" :key="item.advisor">
        <ActivityMonitorItem :advisor="item.advisor" :contacts="item.contacts" />
      </div>
    </div>
  </div>
                </div>

                <div class="tab-pane" :class="{ 'active': activeTab === 'tabItem3' }" v-show="activeTab === 'tabItem3'">
                    <TeamPerformanceItem :teamPerformance="team_performance" />
                </div>
            </div>
        </div>

    </div>

    <div class="modal fade " id="personalizado" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-b d-flex justify-content-between">
                    <p class="text-font fw-semibold color-text-2 as" id="exampleModalLabel"
                        style="font-size: 18px; height:28px; margin-top: 17px;">Elija un periodo</p>
                    <em class="icon ni ni-cross-sm fs-2 d-flex color-text"
                        style="cursor: pointer; height:28px; padding:10px;" data-bs-dismiss="modal" aria-label="Close"></em>
                </div>

                <form @submit.prevent="personalized_date">
                    <div class="d-flex justify-content-center aling-items-center">
                        <div class="me-3">
                            <div class="res-text fw-semibold text-font color-54">
                                Mes
                            </div>
                            <div class="d-flex justify-content-end align-items-center  mb-2">
                                <select class="select-perso" aria-label="Default select example" v-model="formData.month">
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                                <em
                                    class="icon ni ni-downward-ios pe-none position-absolute me-3 fs-6 fw-bold color-54"></em>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center aling-items-center">
                        <div class="me-3">
                            <div class="res-text fw-semibold text-font color-54">
                                Año
                            </div>
                            <div class="d-flex justify-content-end align-items-center">
                                <select class="select-perso" aria-label="Default select example" v-model="formData.year">
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2024</option>
                                </select>
                                <em
                                    class="icon ni ni-downward-ios pe-none position-absolute me-3 fs-6 fw-bold color-54"></em>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center align-items-center pt-4 me-3">
                        <button data-bs-dismiss="modal" type="submit" class="b-aceptar fw-semibold"> Aceptar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <br>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";

.custom-container {
  margin-right: auto;
  margin-left: auto;
  max-width: 1200px; 
}
</style>