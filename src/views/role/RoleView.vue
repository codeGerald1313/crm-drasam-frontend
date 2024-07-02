<script setup lang="ts">

import { ref } from 'vue';
import RolePermissionView from "./RolePermissionView.vue"
import AddRoleView from "./AddRoleView.vue"
import { usePermissionsStore } from '@/stores/permissions'

const hasPermissionTo = usePermissionsStore().hasPermissionTo;
const activeTab = ref('tabItem1');

const changeTab = (tabId: any) => {
    activeTab.value = tabId
}

</script>

<template>
    <div class="nk-content">
        <div class="container-fluid">
            <div class="d-flex">
                <li class="nav-item" :class="{ 'activeTab': activeTab === 'tabItem1' }" @click="changeTab('tabItem1')" v-show="hasPermissionTo(['role.list'])">
                    <a class="btn btn-tab">
                    <span class="fw-semibold d-flex justify-content-center">
                        <p class="text-black">Roles</p>
                    </span>
                    </a>
                </li>
                <li class="nav-item" :class="{ 'activeTab': activeTab === 'tabItem2' }" @click="changeTab('tabItem2')" v-show="hasPermissionTo(['role.create'])">
                    <a class="btn btn-tab">
                    <span class="fw-semibold d-flex justify-content-center" v-show="hasPermissionTo([''])">
                        <p class="text-black">Registrar Roles</p>
                    </span></a>
                </li>
            </div>

            <div class="tab-content">
                <div class="tab-pane" :class="{ 'active': activeTab === 'tabItem1' }" v-show="activeTab === 'tabItem1'">
                    <RolePermissionView/>
                </div>
                <div class="tab-pane" :class="{ 'active': activeTab === 'tabItem2' }" v-show="activeTab === 'tabItem2'">
                    <AddRoleView/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.text-black{
    color: #000;
    font-size: 13px;
}

.activeTab{
    color: #000;
    background-color: #F8BC02;
}

</style>