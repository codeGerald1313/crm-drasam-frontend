
<script setup lang="ts">

import { ref } from 'vue';

const selectDate = ref(1);
const options = ref([
    {
        id: 1,
        label: 'Últimos 7 días'
    },
    {
        id: 2,
        label: 'Este mes'
    },
    {
        id: 3,
        label: 'Personalizado'
    }
]);

const handleSelectChange = (option_value: number) => {
    if (option_value === 3 && props?.open_modal) {
        props.open_modal();
    }
}

const props = defineProps({
    get_data: Function,
    open_modal: Function
});

</script>

<template>
    <div class="d-flex w-100 position-absolute pe-none align-items-center h-nav">

        <li class="nav-item me-4">
            <div class="h-100">
                <p class="fs-6 opacity-50">FILTRAR POR: </p>
            </div>
        </li>
        <li class="nav-item pe-auto filtrar">
            <div class="h-100 d-flex justify-content-end align-items-center">
                <el-select v-model="selectDate" class="select-filtrar" @change="handleSelectChange">
                    <el-option v-for="item in options" :label="item.label" :value="item.id" :key="item.id"
                    @click="() => props?.get_data?.(item.id)"></el-option>
                </el-select>
            </div>
        </li>

    </div>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";
</style>