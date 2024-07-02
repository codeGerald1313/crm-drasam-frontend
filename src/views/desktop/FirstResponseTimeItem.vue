
<script setup>

const props = defineProps({
    type_select: String,
    time: String
});

</script>

<template>
    <div class="container-content container-zise1">
        <div class="d-flex w-100 align-items-center title-container-h">
            <div><em class="icon ni ni-clock fs-4 color-text ms-4"></em></div>
            <div>
                <p class="comversaciones-text ms-1">Tiempo de primera respuesta</p>
            </div>
            <div class="position-relative icon-info">
                <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                <span class="tooltip-right position-absolute">Este
                    es un tiempo
                    general que le toma al equipo responder a un nuevo contacto.</span>
            </div>
        </div>

        <div class=" h-25 w-100 d-flex align-items-end mt-2">
            <div class="ms-3">
                <p class="ms-3 fs-3 text-black text-font fw-semibold">{{ props.time }}</p>
            </div>
            <div class="mb-1"><em class="ms-4 icon ni ni-caret-right-fill fecha-color-icon"></em>
            </div>
            <div class="mb-1">
                <p class="ms-1 fecha-color">{{ props.type_select }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";
</style>