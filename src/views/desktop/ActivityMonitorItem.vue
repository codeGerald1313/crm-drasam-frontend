
<script setup>

import { ref } from 'vue';

const props = defineProps({
    advisor: String,
    contacts: ref(),
});

</script>

<template>
    <div class="actividades-pane">
        <div class="d-flex align-items-center border-bottom border-1" style="height: 48px;">
            <p class="text-black fs-5 fw-semibold text-font w-100 ms-4">
                Asesor: {{ props.advisor }}
            </p>
        </div>

        <div class="d-flex align-items-center ms-4" style="height: 40px;">
            <div class="w-FCA me-3">
                <p class="text-font fw-semibold color-letters">Fecha:</p>
            </div>
            <div class="w-FCA">
                <p class="text-font fw-semibold color-letters">Cliente:</p>
            </div>
            <div class="w-FCA">
                <p class="text-font fw-semibold color-letters">Actividad:</p>
            </div>
        </div>

        <div class="mt-0 ms-4 overflow-auto over-perso" style="height: 57%;">
            <div class="mt-2">

                <div>
                    <div class="d-flex align-items-center margin-res" style="height: 30px;" v-for="ele in props.contacts">
                        <div class="w-FCA me-4">
                            <p class="text-font color-letters res-text-2 align-res">{{ ele.date_closed
                            }}</p>
                        </div>

                        <div class="w-FCA">
                            <p class="text-font color-letters res-text-2">{{ ele.contact }}</p>
                        </div>

                        <div class="w-FCA">
                            <p class="text-font font-size-text color-text res-text-2">Cerró el cliente
                            </p>
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