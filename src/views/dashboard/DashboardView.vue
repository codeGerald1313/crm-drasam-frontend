<script lang="ts">
import {
  ref,
  computed,
  defineComponent,
  onMounted,
  watch,
  reactive,
} from "vue";
import VueApexCharts from "vue3-apexcharts";
import axios from "axios";
import { useAuth } from "../../stores/auth";
import type { WaitTimes } from "@/model/Type";
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from "element-plus";
import { formatTimeAgo } from "../../utils/dateUtils";
import { acitivitiesInLive } from "../../stores/activity";
import type { Activity } from "@/model/Type";

declare const bootstrap: any;

export default defineComponent({
  components: {
    apexchart: VueApexCharts,
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
  },
  setup() {
    const activeTab = ref("tabItem1");
    const chartOptions = ref<any>({
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          endingShape: "rounded",
          borderRadius: 3,
        },
      },
      grid: {
        padding: {
          top: -18,
          right: 0,
          bottom: -6,
          left: 0,
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        tickPlacement: "end",
        categories: [],
        tickAmount: 50,
        axisBorder: {
          show: true,
          height: 0,
          width: "100%",
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        max: 50,
        labels: {
          show: true,
          minWidth: 0,
          maxWidth: 160,
          style: {
            colors: [],
            fontSize: "12px",
            fontFamily: "Segoe UI",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
        },
      },
      maxHeight: 100,

      colors: ["#F8BC02"],
    });

    const chartSeries = ref<any[]>([
      {
        name: "Cantidad de mensajes",
        data: [],
      },
    ]);
    const numeroDelBackend = ref(null);
    const startDate = ref(null);
    const endDate = ref(null);
    const salesByMonth = reactive([]);
    const selectedFilter = ref("ultimos_7_dias");
    const assignmentDetails = ref([] as Activity[]);

    const messageContent = ref("");
    const formattedLastActivity = ref("");

    const tableData = ref([]);

    const contactsNewAndTransfer = ref({
      nuevos: 0,
      transferidos: 0,
    });

    const averageWaitTime = ref(null);


    const useConversation = acitivitiesInLive();

    const waitTimes = ref<Array<WaitTimes>>([]);
      const waitTimes2 = ref([]);

    const headers = useAuth().headers();
    const selectMes = ref(null);
    const selectAnio = ref(null);
    const selectDate = ref(1);

    const applyCustomFilter = () => {
      try {
        const selectedMonthValue = selectMes.value;
        const selectedYearValue = selectAnio.value;

        const customFilterEndpoint = `${
          import.meta.env.VITE_API_URL
        }/dashboard/messages-count/personalizado`;

        const params = {
          selected_month: selectedMonthValue,
          selected_year: selectedYearValue,
        };

        axios
          .get(customFilterEndpoint, { params, ...headers })
          .then((response) => {
            console.log("Respuesta del backend:", response.data);

            if (typeof response.data.data === "object") {
              let data = response.data.data.fechas.map(
                (fecha: any, index: any) => ({
                  x: fecha,
                  y: response.data.data.cantidades[index],
                })
              );

              chartSeries.value[0].data = data;
              numeroDelBackend.value = response.data.total_mensajes;
            } else {
              console.error(
                "La respuesta del backend no contiene un arreglo de datos válido."
              );
            }
          });
      } catch (error) {
        console.error("Error al aplicar el filtro personalizado:", error);
      }
    };

    const fetchData = async () => {
      try {
        const periodo = selectedFilter.value || "";

        const endpoint = `${
          import.meta.env.VITE_API_URL
        }/dashboard/messages-count/${periodo}`;

        
        const options = {
          params: {
            fecha_inicio: startDate.value,
            fecha_fin: endDate.value,
          },
          ...headers,
        };

        const response = await axios.get(endpoint, options);

        let data;
        if (response.data) {
          if (periodo === "ultimos_7_dias") {
            data = response.data.data.map((item: any) => ({
              x: item.fecha,
              y: item.cantidad,
            }));
          } else if (periodo === "este_mes" || periodo === "personalizado") {
            data = response.data.data.fechas.map((fecha: any, index: any) => ({
              x: fecha,
              y: response.data.data.cantidades[index],
            }));
          }

          chartSeries.value[0].data = data;
          numeroDelBackend.value = response.data.total_mensajes;
        } else {
          console.error("La respuesta del backend no contiene datos válidos.");
        }

        const response3 = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/listado-json`,
          headers
        );
        waitTimes2.value = response3.data;

        console.log( waitTimes2.value);

        const response2 = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/wait-times`,
          headers
        );
        waitTimes.value = response2.data;

        console.log( waitTimes.value);


      } catch (error) {
        console.error("Error al obtener los datos del backend", error);
      }
    };

    const openModal = () => {
      const myModalElement = document.getElementById("personalizado");
      if (myModalElement) {
        const myModal = new bootstrap.Modal(myModalElement);
        myModal.show();
        selectDate.value = 1;
      }
    };

    const applyFilter = (filterOption: any) => {
      selectedFilter.value = filterOption;
      if (filterOption === "personalizado") {
        openModal();
      } else {
        fetchData();
      }
    };

    const fetchActivities = async () => {
      try {
        const aca = await useConversation.fetchActivities();

        assignmentDetails.value = aca.data;

        console.log(assignmentDetails.value);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };

    const getAssignmentCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/dashboard/count-all`,
          headers
        );

        contactsNewAndTransfer.value = response.data;

        console.log(contactsNewAndTransfer.value);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchAverageWaitTime = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/contact-wait/calculate-average-wait-time`, headers
        );
        averageWaitTime.value = response.data.average_wait_time;

        console.log(averageWaitTime.value);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchTableData = async () => {
      try {
        const aca = await useConversation.fetchTableData();

        tableData.value = aca;
      } catch (error) {
        console.error("Error al obtener los datos de la tabla:", error);
      }
    };

    watch(assignmentDetails, () => {});

    onMounted(async () => {
      fetchData();
      getAssignmentCount();
      fetchActivities();
      fetchTableData();
      fetchAverageWaitTime(),
      window.Echo.channel("channel-conversation").listen(
        "ConversationCreated",
        (data: any) => {
          console.log(data);

          const existingActivityIndex = assignmentDetails.value.findIndex(
            (activity) => activity.id === data.id
          );

          if (existingActivityIndex !== -1) {
            assignmentDetails.value[existingActivityIndex].advisor_name =
              data.conversation.advisorName;
            assignmentDetails.value[existingActivityIndex].contact_name =
              data.conversation.contact_name;

            assignmentDetails.value[existingActivityIndex].messages =
              data.conversation.messages;

            assignmentDetails.value[existingActivityIndex].last_activity =
              data.conversation.last_activity;
          }
        }
      );
    });

    return {
      activeTab,
      chartOptions,
      chartSeries,
      numeroDelBackend,
      salesByMonth,
      applyFilter,
      tableData,
      waitTimes,
      waitTimes2,
      startDate,
      contactsNewAndTransfer,
      messageContent,
      selectedFilter,
      endDate,
      selectDate,
      averageWaitTime,
      assignmentDetails,
      applyCustomFilter,
      formattedLastActivity,
      selectMes,
      selectAnio,
      formatTimeAgo,
      headers,
    };
  },
});
</script>

<template>
  <div class="nk-content">
    <div class="container-fluid">
      <div class="nk-content-inner">
        <div class="nk-content-body">
          <div class="nk-block">
            <div class="d-flex justify-content-center flex-responsive-sup">
              <div class="d-flex flex-responsive-ph">
                <!-- CARD 1 -->
                <div class="">
                  <div class="w-per border-vg h-vg mr-p">
                    <div class="w-100 head-vg d-flex align-items-center">
                      <div>
                        <em class="icon ni ni-clock color-y fs-4 ms-2"></em>
                      </div>
                      <div>
                        <span class="ms-1 color-f fs-14"
                          >Contactos en espera</span
                        >
                      </div>
                      <div class="position-relative icon-info">
                        <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                        <span class="tooltip-right position-absolute"
                          >Se visualizarán los contactos que aún no han sido
                          atendidos por un asesor</span
                        >
                      </div>
                    </div>
                    <div class="w-100 d-flex border-b" style="height: 25px">
                      <div
                        class="w-100 d-flex justify-content-center color-f fs-14 background-yl"
                      >
                      {{ contactsNewAndTransfer.nuevos }} Nuevos
                      </div>
                      <div
                        class="w-100 d-flex justify-content-center color-f fs-14"
                      >
                        {{ contactsNewAndTransfer.transferidos }} Transferidos
                      </div>
                      <div class="w-25"></div>
                    </div>
                    <div class="content-scroll h-scroll-1 mt-3">
                      <div class="d-flex border-b me-5" style="height: 30px">
                        <div
                          class="w-100 color-f fs-14 fw-semibold d-flex align-items-center"
                        >
                          Contacto
                        </div>
                        <div
                          class="w-100 color-f fs-14 fw-semibold d-flex align-items-center"
                        >
                          Espera
                        </div>
                      </div>
                      <div
                        v-for="(waitTime, index) in waitTimes2"
                        :key="index"
                        class="d-flex border-t me-5"
                        style="height: 30px"
                      >
                        <div
                          class="w-100 color-f fs-14 d-flex align-items-center"
                        >
                          {{ waitTime.Contacto }}
                        </div>
                        <div
                          class="w-100 color-r fs-14 d-flex align-items-center"
                        >
                          {{ waitTime.Espera }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="">
                  <!-- CARD 2 -->
                  <div class="w-per border-vg h-vg-2 card-2">
                    <div class="d-flex align-items-end head-vg-sh">
                      <div>
                        <em class="icon ni ni-clock color-y fs-4 ms-2"></em>
                      </div>
                      <div>
                        <span class="ms-1 color-f fs-14"
                          >Promedio de tiempo de respuesta general</span
                        >
                      </div>
                      <div class="position-relative icon-info">
                        <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                        <span class="tooltip-right position-absolute"
                          >Este es un tiempo general que le toma al equipo
                          responder a un nuevo contacto.</span
                        >
                      </div>
                    </div>
                    <div class="d-flex align-items-end">
                      <div>
                        <span class="fw-semibold color-f fs-22 ms-4">{{ averageWaitTime }}</span>
                      </div>
                      <div class="ms-1">
                        <em
                          class="icon ni ni-caret-right-fill color-arrow"
                        ></em>
                      </div>
            
                    </div>
                  </div>
                  <!-- CARD 3 -->
                  <div class="w-per border-vg h-vg-3 mt">
                    <div class="d-flex align-items-center mt-1 head-vg-sh">
                      <div>
                        <em class="icon ni ni-users color-y fs-4 ms-2"></em>
                      </div>
                      <div>
                        <span class="ms-1 color-f fs-14"
                          >Interacciones con contactos</span
                        >
                      </div>
                      <div class="position-relative icon-info">
                        <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                        <span class="tooltip-right position-absolute"
                          >Se visualizará la cantidad de contactos en el que los
                          asesores interactuaron por día.</span
                        >
                      </div>
                    </div>
                    <div class="d-flex align-items-end">
                      <div>
                        <span class="fw-semibold color-f fs-22 ms-4">{{
                          numeroDelBackend
                        }}</span>
                      </div>
                      <div class="ms-1">
                        <em
                          class="icon ni ni-caret-right-fill color-arrow"
                        ></em>
                      </div>
                      <div class="color-w ms-1 mb-p">
                        <el-dropdown>
                          <span class="el-dropdown-link">
                            Filtrar
                            <el-icon class="el-icon--right"> </el-icon>
                          </span>
                          <template #dropdown>
                            <el-dropdown-item
                              v-model="selectedFilter"
                              value="ultimos_7_dias"
                              @click="applyFilter('ultimos_7_dias')"
                              >Últimos 7 días</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-model="selectedFilter"
                              value="este_mes"
                              @click="applyFilter('este_mes')"
                              >Este mes</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-model="selectedFilter"
                              value="personalizado"
                              @click="applyFilter('personalizado')"
                              >Personalizado</el-dropdown-item
                            >
                          </template>
                        </el-dropdown>
                      </div>
                    </div>
                    <div
                      class="h-graficos d-flex align-items-center justify-content-center"
                    >
                      <div class="w-100 h-100">
                        <div class="w-100 h-100">
                          <div class="h-100">
                            <div class="container">
                              <div class="containerBody">
                                <apexchart
                                  type="bar"
                                  :options="chartOptions"
                                  :series="chartSeries"
                                  height="169"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="">
                <!-- CARD 4 -->

                <div class="w-per-2 border-vg-resp h-vg ml-p card-4">
                  <div class="w-per-2-res border-vg-res">
                    <div class="d-flex align-items-end head-vg-sh ms-2 mt-1">
                      <div class="d-flex align-items-center">
                        <div>
                          <em class="icon ni ni-chat color-y fs-4 ms-2"></em>
                        </div>
                        <div>
                          <span class="ms-1 color-f fs-14"
                            >Actividades en vivo</span
                          >
                        </div>
                        <div class="position-relative icon-info">
                          <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                          <span class="tooltip-right position-absolute"
                            >Se mostrará en tiempo real las actividades en vivo
                            de los asesores y contactos.</span
                          >
                        </div>
                      </div>
                    </div>
                    <div class="content-scroll h-scroll-2 mt-1">
                      <div
                        v-for="(item, index) in assignmentDetails"
                        :key="index"
                        class="d-flex border-b flex-column pe-4 me-4"
                        style="height: 60px"
                      >
                        <div class="w-100 d-flex align-items-center h-50">
                          <div
                            class="d-flex justify-content-between w-100 h-50"
                          >
                            <div class="d-flex">
                              <span
                                class="color-f fs-12 fw-semibold font-family me-1"
                                >{{ item.advisor_name }}</span
                              >
                              <p class="font-family fs-12 me-1">con</p>
                              <span
                                class="color-y fs-12 fw-semibold font-family"
                                >{{ item.contact_name }}
                              </span>
                            </div>
                            <div>
                              <span class="fw-semibold fs-12 color-w">{{
                                formatTimeAgo(item.last_activity)
                              }}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="d-flex align-items-center">
                            <div>
                              <em
                                class="icon ni ni-whatsapp color-w fs-5 me-2"
                              ></em>
                            </div>
                            <div>
                              <em
                                v-if="item.messages.type === 'image'"
                                class="icon ni ni-img-fill color-w fs-14"
                              ></em>
                              <em
                                v-if="item.messages.type === 'text'"
                                class="icon ni ni-text2 color-w fs-14"
                              ></em>
                              <em
                                v-if="item.messages.type === 'audio'"
                                class="icon ni ni-mic color-w fs-14"
                              ></em>
                              <em
                                v-if="item.messages.type === 'video'"
                                class="icon ni ni-video color-w fs-14"
                              ></em>
                              <em
                                v-if="item.messages.type === 'document'"
                                class="icon ni ni-file-doc color-w fs-14"
                              ></em>
                            </div>
                            <div>
                              <span
                                class="font-family color-w fs-12 fw-semibold ms-1"
                              >
                                {{
                                  item.messages.type === "text"
                                    ? item.messages.content.body
                                    : item.messages.type === "image"
                                    ? "Imagen"
                                    : item.messages.type === "audio"
                                    ? "Audio"
                                    : item.messages.type === "video"
                                    ? "Video"
                                    : item.messages.type === "document"
                                    ? "Document"
                                    : "Otro tipo de mensaje"
                                }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- CARD 5 -->
            <div class="d-flex justify-content-center mt-3">
              <div class="border-vg-resp wh-ft">
                <div class="border-vg-res wh-ft-res">
                  <div class="d-flex align-items-end head-vg-sh ms-2 mt-1">
                    <div class="d-flex align-items-center">
                      <div>
                        <em
                          class="icon ni ni-account-setting-fill color-y fs-4 ms-2"
                        ></em>
                      </div>
                      <div>
                        <span class="ms-1 color-f fs-14"
                          >Actividad de los asesores en el día</span
                        >
                      </div>
                      <div class="position-relative icon-info">
                        <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                        <span class="tooltip-right position-absolute"
                          >Se visualizará el resumen de las actividades de los
                          asesores en las últimas 24 horas.</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="border-t border-b d-flex align-items-center justify-content-around background-yl color-f fs-14-res fw-semibold mt-2"
                    style="height: 25px"
                  >
                    <div class="w-50-res ps-3 fs-res">Asesor</div>
                    <div class="w-80-res fs-res">Últ. Actividad</div>
                    <div class="w-50-res d-flex justify-content-center fs-res">
                      Total de Contactos
                    </div>

                    <div class="w-80-res d-flex justify-content-center fs-res">
                      Tiempo de espera a contactos
                    </div>
                    <div class="w-80-res d-flex justify-content-center fs-res">
                      Contactos cerrados por Venta
                    </div>
                    <div></div>
                    <div></div>
                  </div>
                  <div class="h-scroll-3 content-scroll">
                    <div
                      v-for="(asesor, index) in tableData"
                      :key="index"
                      class="d-flex align-items-center justify-content-around h-42 border-b font-family fs-14-res"
                    >
                      <div class="w-50-res ps-3 fs-res">
                        {{ asesor.advisorName }}
                      </div>
                      <div class="w-80-res fs-res">
                        <div
                          :class="{
                            'check-green': asesor.last_activity !== 'Inactivo',
                            'check-red': asesor.last_activity === 'Inactivo',
                          }"
                          class="d-flex justify-content-center w-156 fs-res fs-rs"
                        >
                          {{
                            asesor.last_activity === "Inactivo"
                              ? asesor.last_activity
                              : formatTimeAgo(asesor.last_activity)
                          }}
                        </div>
                      </div>

                      <div
                        class="w-50-res d-flex justify-content-center fs-res"
                      >
                        {{ asesor.total_contactos }}
                      </div>
                      <div
                        class="w-80-res d-flex justify-content-center fs-res"
                      >
                        {{ asesor.tiempo_espera_promedio }}
                      </div>
                      <div
                        class="w-80-res d-flex justify-content-center fs-res"
                      >
                        {{ asesor.contactos_cerrados }}
                      </div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="card card-bordered h-100">
                                <div class="card-inner mb-n2">
                                    <div class="card-title-group">
                                        <div class="card-title card-title-sm">
                                            <h6 class="title">Traffic Channel</h6>
                                            <p>Top traffic channels metrics.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="nk-tb-list is-loose traffic-channel-table">
                                    <div class="nk-tb-item nk-tb-head">
                                        <div class="nk-tb-col nk-tb-channel">
                                            <span>Channel</span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-sessions">
                                            <span>Sessions</span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-prev-sessions">
                                            <span>Prev Sessions</span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-change">
                                            <span>Change</span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-trend tb-col-sm text-end">
                                            <span>Trend</span>
                                        </div>
                                    </div>
                                    <div class="nk-tb-item">
                                        <div class="nk-tb-col nk-tb-channel">
                                            <span class="tb-lead">Organic Search</span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-sessions">
                                            <span class="tb-sub tb-amount"><span>4,305</span></span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-prev-sessions">
                                            <span class="tb-sub tb-amount"><span>4,129</span></span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-change">
                                            <span class="tb-sub"><span>4.29%</span>
                                                <span class="change up"><em
                                                        class="icon ni ni-arrow-long-up"></em></span></span>
                                        </div>
                                        <div class="nk-tb-col nk-tb-trend text-end">
                                            <div class="traffic-channel-ck ms-auto">
                                                <canvas class="analytics-line-small" id="OrganicSearchData"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Personalizado -->
  <div
    class="modal fade"
    id="personalizado"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-b d-flex justify-content-between">
          <p
            class="text-font fw-semibold color-text-2 as"
            id="exampleModalLabel"
            style="font-size: 18px; height: 28px; margin-top: 17px"
          >
            Elija un periodo
          </p>
          <em
            class="icon ni ni-cross-sm fs-2 d-flex color-text"
            style="cursor: pointer; height: 28px; padding: 10px"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></em>
        </div>
        <div class="d-flex justify-content-center aling-items-center">
          <div class="me-3">
            <div class="res-text fw-semibold text-font color-54">Mes</div>
            <div class="d-flex justify-content-end align-items-center mb-2">
              <select
                class="select-perso"
                v-model="selectMes"
                aria-label="Default select example"
              >
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="8">Agosto</option>

                <option value="9">Setiembre</option>

                <!-- Agrega las opciones restantes para los meses aquí -->
              </select>
              <em
                class="icon ni ni-downward-ios pe-none position-absolute me-3 fs-6 fw-bold color-54"
              ></em>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center aling-items-center">
          <div class="me-3">
            <div class="res-text fw-semibold text-font color-54">Año</div>
            <div class="d-flex justify-content-end align-items-center">
              <select
                class="select-perso"
                v-model="selectAnio"
                aria-label="Default select example"
              >
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
              <em
                class="icon ni ni-downward-ios pe-none position-absolute me-3 fs-6 fw-bold color-54"
              ></em>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-center align-items-center pt-4 me-3">
          <button
            class="b-aceptar fw-semibold"
            data-bs-dismiss="modal"
            @click="applyCustomFilter"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-y {
  color: #f6bb02;
}

.color-f {
  color: #2d383c;
}

.color-w {
  color: #a9a9a9;
}

.color-r {
  color: #d22b2b;
}

.color-arrow {
  color: #fff1c7;
}

.font-family {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.fs-12 {
  font-size: 12px;
}

.fs-14 {
  font-size: 14px;
}

.fs-14-res {
  font-size: 14px;
}

.fs-17 {
  font-size: 18px;
}

.fs-22 {
  font-size: 22px;
}

.border-vg {
  border: 1px solid #d2d2d2;
  border-radius: 15px;
}

.border-vg-resp {
  border: 1px solid #d2d2d2;
  border-radius: 15px;
}

.background-yl {
  background: #fff4d7;
}

.check-green {
  border: 1px solid #16ad09;
  border-radius: 9px;
  background: #ceffb7;
  height: 27px;
  color: #16ad09;
  align-items: center;
}

.check-red {
  border: 1px solid #d22b2b;
  border-radius: 9px;
  background: #ffd4d4;
  height: 27px;
  color: #d22b2b;
  align-items: center;
}

/* cards height y width */
.h-vg {
  height: 353px;
}

.h-vg-2 {
  height: 74px;
}

.h-vg-3 {
  height: 272px;
}

.w-vg-4 {
  width: 484px;
}

.w-per {
  width: 378px;
}

.w-per-2 {
  width: 484px;
}

.w-156 {
  width: 156px;
}

.w-110 {
  width: 110px;
}

.h-graficos {
  height: 194.5px;
}

.wh-ft {
  width: 1270px;
  height: 368px;
}

.w-80-res {
  width: 190px;
}

.w-50-res {
  width: 160px;
}

.border-b {
  border-bottom: 1px solid #d2d2d2;
}

.border-t {
  border-top: 1px solid #d2d2d2;
}

.head-vg {
  height: 48px;
  border-bottom: 1px solid #d2d2d2;
}

.head-vg-nb {
  height: 48px;
}

.head-vg-sh {
  height: 34px;
}

/* margin */
.mt {
  margin-top: 7px;
}

.mr-p {
  margin-right: 14px;
}

.h-42 {
  height: 42px;
}

.ml-p {
  margin-left: 14px;
}

.mb-p {
  margin-bottom: 3px;
}

/* overflow scroll */
.h-scroll-1 {
  height: 212px;
  padding-left: 30px;
}

.h-scroll-2 {
  height: 260px;
  padding-left: 27px;
}

.h-scroll-3 {
  height: 280px;
}

.content-scroll {
  overflow-y: auto;
}

.content-scroll::-webkit-scrollbar {
  width: 13px;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: #d2d2d2;
  border-radius: 20px;
}

/* chart */
.container {
  width: 500px;
  max-width: 338px;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 0px;
  height: 100%;
}

.container::-webkit-scrollbar {
  width: 13px;
  border: 1px solid #d2d2d2;
  border-radius: 20px;
}

.container::-webkit-scrollbar-thumb {
  background: #d2d2d2;
  border-radius: 20px;
}

.containerBody {
  height: 169px;
  width: 1300px;
}

.chartBox {
  width: 338px;
  padding: 20px;
}

/* Tooltip */
.tooltip-right {
  font-family: "Segoe UI";
  width: 240px;
  font-size: 15px;
  background: white;
  border: 1px solid #d2d2d2;
  border-radius: 10px;
  padding: 12px 13px;
  position: absolute;
  visibility: hidden;
  opacity: 0;
}

.icon-info:hover .tooltip-right {
  visibility: visible;
  opacity: 100%;
  transition: 0.3s;
}

.icon-info:hover .tooltip-right-2 {
  visibility: visible;
  opacity: 100%;
  transition: 0.3s;
}

/* responsive */

@media (max-width: 805px) {
  .flex-responsive-ph {
    flex-direction: column;
  }

  .border-vg-resp {
    border: none;
    display: flex;
    justify-content: center;
  }

  .border-vg-res {
    border: 1px solid #d2d2d2;
    border-radius: 10px;
  }

  .w-per-2-res {
    width: 378px;
    margin-right: 15px;
  }

  .wh-ft-res {
    width: 378px;
  }

  .fs-res {
    font-size: 8px;
    text-align: center;
  }

  .w-156 {
    width: 80px;
  }

  .w-110 {
    width: 50px;
  }

  .fs-rs {
    text-align: center;
  }

  .fs-14 {
    font-size: 13.5px;
  }

  .card-2 {
    margin-top: 9px;
  }
}

@media (max-width: 1380px) {
  .flex-responsive-sup {
    flex-direction: column;
    align-items: center;
  }

  .card-4 {
    margin-top: 12px;
  }

  .w-per-2 {
    width: 770px;
  }

  .wh-ft {
    width: 770px;
  }

  .fs-rs {
    font-size: 8px;
  }

  .w-156 {
    width: 80px;
  }

  .w-110 {
    width: 50px;
  }

  .fs-14-res {
    font-size: 10px;
  }

  .ml-p {
    margin-left: 0px;
  }
}

.modal-dialog {
  width: 262px;
}

.modal-content {
  height: 300px;
}

.modal-b {
  padding-left: 24px;
}
.select-perso {
  width: 199px;
  height: 42px;
  border: 2px solid #d2d2d2;
  background: transparent;
  font-size: 16px;
  color: #545454;
  border-radius: 7px;
  padding: 0px 0px 0px 8px;
  appearance: none;
  outline: none;
}

.b-aceptar {
  width: 130px;
  height: 44px;
  background: #f8bc02;
  border: none;
  font-size: 16px;
  color: #2d383c;
  border-radius: 7px;
  outline: none;
}

.b-aceptar:hover {
  border: 1.7px solid #f8bc02;
  background: transparent;
  color: #f8bc02;
}
</style>
