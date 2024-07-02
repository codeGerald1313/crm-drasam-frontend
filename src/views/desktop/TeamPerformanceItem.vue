
<script setup>

const props = defineProps({
    teamPerformance: Array,
});

</script>

<template>
    <div
        class="w-100 rendimiento-tab d-flex justify-content-around fw-semibold align-items-center border-top border-bottom res-text">
        <div class="rendimiento-text">Asesor</div>
        <div class="rendimiento-text">Contactos totales</div>
        <div class="rendimiento-text">Conversaciones cerradas</div>
        <div class="rendimiento-text">Responde en</div>
        <div class="rendimiento-text">Satisfacción del cliente</div>
    </div>
    <div class="container-height mt-4" v-for="item in props.teamPerformance">

        <div class="w-100 d-flex rendimiento-bottom justify-content-around align-items-center res-text"
            v-for="ele in item.advisor_inf">
            <div class="color-text-2 text-font rendimiento-text font-size-text2">{{ ele.advisor }}</div>
            <div class="color-text-2 text-font rendimiento-text font-size-text2">{{ ele.total_contacts }}
            </div>
            <div class="color-text-2 text-font rendimiento-text font-size-text2">{{ ele.closed_conversations}}</div>
            <div class="color-text-2 text-font rendimiento-text font-size-text2">{{ ele.wait_time}} s</div>
            <div class="text-font rendimiento-text font-size-text2 color-red">Insatisfecho</div>
        </div>

    </div>
    <div class="w-100 border-top border-bottom d-flex rendimiento-bottom justify-content-around fw-semibold align-items-center border-top border-bottom res-text mb-4"
        v-for="item in props.teamPerformance">
        <div class="color-text rendimiento-text">TOTAL</div>
        <div class="rendimiento-text">{{ item.t_contacts }}</div>
        <div class="rendimiento-text">{{ item.t_closed_conversations }}</div>
        <div class="rendimiento-text">...</div>
        <div class="rendimiento-text">...</div>
    </div>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";
</style>