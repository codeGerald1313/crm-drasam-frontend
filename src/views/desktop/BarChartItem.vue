<script setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from "vue3-apexcharts";

const chartOptions = ref();

const props = defineProps({
    total: Number,
    type_select: String,
    title: String,
    description: String,
    chartOptions: ref(),
    chartSeries: ref(),
});

chartOptions.value = {
    chart: {
        toolbar: {
            show: false,
        }
    },
    dataLabels: {
        enabled: false,
    },
    plotOptions: {
        bar: {
            horizontal: true,
            endingShape: "rounded",
            borderRadius: 2
        }
    },
    grid: {
        padding: {
            top: -27,
            right: 0,
            bottom: -6,
            left: 0
        },
        yaxis: {
            lines: {
                show: false
            },
        },
        xaxis: {
            lines: {
                show: false
            },
        },
    },
    xaxis: {
        labels: {
            show: false,
        },
    },
    yaxis: {
        min: 0,
        max: 100,
        labels: {
            show: true,
            minWidth: 0,
            maxWidth: 160,
            style: {
                colors: [],
                fontSize: '12.5px',
                fontFamily: 'Segoe UI',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
        }
    },
    colors: ['#F8BC02'],
}

onMounted(async () => {
    const salesByMonth = [
        {
            "mes": " Dom",
            "total": 5,
        },
        {
            "mes": "Lun",
            "total": 1,
        },
        {
            "mes": "Mar",
            "total": 8,
        },
        {
            "mes": "Mié",
            "total": 3,
        },
        {
            "mes": "Jue",
            "total": 7,
        },
        {
            "mes": "Vie",
            "total": 2,
        },
        {
            "mes": "Sáb",
            "total": 50,
        },
    ];

    const categories = salesByMonth.map(sale => sale.mes);
    chartOptions.value.xaxis.categories = categories;
});

</script>

<template>
    <div class="container-content container-zise2-5">

        <div class="d-flex w-100 align-items-center title-container-h mt-1 ms-1">
            <div><em class="icon ni ni-users fs-4 color-text ms-3"></em></div>
            <div>
                <p class="comversaciones-text ms-1">{{ props.title }}</p>
            </div>
            <div class="position-relative icon-info">
                <em class="ms-1 icon ni ni-info fs-3 opacity-50"></em>
                <span class="tooltip-right-2 position-absolute">{{ props.description }}</span>
            </div>
        </div>

        <div class="w-100 d-flex align-items-end w-perso">
            <div>
                <p class="ms-4 fs-2 text-black text-font fw-semibold">{{ props.total }}</p>
            </div>
            <div class="mb-1"><em class="ms-2 icon ni ni-caret-right-fill fecha-color-icon"></em></div>
            <div class="mb-1">
                <p class="ms-1 fecha-color">{{ props.type_select }}</p>
            </div>
        </div>

        <div class="h-graficos d-flex align-items-center justify-content-center">
            <div class="w-graficos h-100">
                <div class="w-100 h-100">
                    <div class="h-100">
                        <div class="container">
                            <div class="containerBody">
                                <VueApexCharts type="bar" :options="chartOptions" :series="props.chartSeries"
                                    height="169" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";
</style>