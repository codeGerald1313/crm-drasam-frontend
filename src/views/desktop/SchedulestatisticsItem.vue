
<script setup>

const props = defineProps({
    tomorrow: Array,
    late: Array,
    evening: Array,
    totalWeek: Number,
    totalMonth: Number,
    totalPersonzalized: Number,
});

</script>

<template>
    <div class="container-content container-zise3">
        <div class="d-flex w-100 align-items-center title-container-h">
            <div><em class="icon ni ni-clock fs-4 color-text ms-3"></em></div>
            <div>
                <p class="comversaciones-text ms-1">
                    Horario más activo de conversaciones
                </p>
            </div>
            <div class="position-relative icon-info ms-2">
                <em class="ms-3 icon ni ni-info fs-3 opacity-50"></em>
                <span class="tooltip-right position-absolute">
                    Esta tabla te ayuda a ver en que momento
                    tu equipo
                    está
                    más ocupado con los contactos
                </span>
            </div>
        </div>

        <div class="ms-3 d-flex justify-content-start res-fecha">
            <div class="w-horarios1">
                <table class="table table-borderless">
                    <thead>
                        <tr style="height: 42px;">
                            <th scope="col" style="border-right: 1px solid #D2D2D2;"></th>
                            <th scope="col">
                                <div class="d-flex align-items-center flex-column pb-1">
                                    <div>
                                        <p class="text-font color-letters fw-semibold">Día</p>
                                    </div>
                                    <div>
                                        <p class="color-text" style="font-size: 12px;">5 am - 11 am</p>
                                    </div>
                                </div>
                            </th>
                            <th scope="col">
                                <div class="d-flex align-items-center flex-column pb-1">
                                    <div>
                                        <p class="text-font color-letters fw-semibold">Tarde</p>
                                    </div>
                                    <div>
                                        <p class="color-text" style="font-size: 12px;">12 pm - 6 pm</p>
                                    </div>
                                </div>
                            </th>
                            <th scope="col">
                                <div class="d-flex align-items-center flex-column pb-1">
                                    <div>
                                        <p class="text-font color-letters fw-semibold">Noche</p>
                                    </div>
                                    <div>
                                        <p class="color-text" style="font-size: 12px;">7 pm - 11 pm</p>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Domingo</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[0] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[0] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[0] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Lunes</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[1] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[1] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[1] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Martes</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[2] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[2] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[2] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Miércoles</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[3] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[3] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[3] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Jueves</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[4] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[4] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[4] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Viernes</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[5] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[5] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[5] }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="d-flex">
                                    <p class="text-font color-letters fw-semibold">Sabado</p>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.tomorrow[6] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.late[6] }}</div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center">{{ props.evening[6] }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-end">
                    <p class="color-text text-font fw-semibold pe-5" style="font-size: 14px;">Total de
                        conversaciones:
                        {{ props.totalWeek }}
                    </p>
                </div>
            </div>
            <div class="w-horarios2 h-horarios res-fecha-margin">

                <div class="d-flex justify-content-center ">
                    <div class="w-meses">
                        <div class="fw-bold comversaciones-text">Historial</div>
                        <div class="comversaciones-text fw-normal border h-meses">Enero</div>
                        <div class="comversaciones-text fw-normal border h-meses">Febrero</div>
                        <div class="comversaciones-text fw-normal border h-meses">Marzo</div>
                        <div class="comversaciones-text fw-normal border h-meses">Abril</div>
                        <div class="comversaciones-text fw-normal border h-meses">Mayo</div>
                        <div class="comversaciones-text fw-normal border h-meses">Junio</div>
                        <div class="comversaciones-text fw-normal border h-meses">Julio</div>
                        <div class="comversaciones-text fw-normal border h-meses">Agosto</div>
                        <div class="comversaciones-text fw-normal border h-meses">Septiembre</div>
                        <div class="comversaciones-text fw-normal border h-meses">Octubre</div>
                        <div class="comversaciones-text fw-normal border h-meses">Noviembre</div>
                        <div class="comversaciones-text fw-normal border h-meses">Diciembre</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../../assets/css/Desktop.css";
</style>