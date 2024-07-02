<script setup>
import { ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { usePermissionsStore } from '@/stores/permissions'
import { useAuth } from "../../stores/auth";

const headers = useAuth().headers();

const roles = ref([]);

const hasPermissionTo = usePermissionsStore().hasPermissionTo;

const eliminarRol = async (roleId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/roles/delete/${roleId}`,
      headers
    );

    if (response.data.status) {
      ElMessage({ message: response.data.message, type: "success" });
    }

    getData();
  } catch (error) {
    ElMessage({ message: "Error al eliminar el Rol", type: "error" });
  }
};

const activarRol = async (roleId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/roles/active-status/${roleId}`,
      headers
    );

    if (response.data.status) {
      ElMessage({ message: response.data.message, type: "success" });
    }

    getData();
  } catch (error) {
    ElMessage({ message: "Error al eliminar el Rol", type: "error" });
  }
};

const getData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/roles/list`,
      headers
    );
    roles.value = await response.data.data;
  } catch (error) {
    console.log(error);
  }
};

getData();
</script>

<template>
  <div class="card card-bordered card-preview">
    <table class="table table-orders">
      <thead class="tb-odr-head">
        <tr class="tb-odr-item">
          <th class="tb-odr-info">#</th>
          <th class="tb-odr-info">Rol</th>
          <th class="tb-odr-info">Estado</th>
          <th class="tb-odr-info">Accion</th>
        </tr>
      </thead>
      <tbody class="tb-odr-body">
        <tr class="tb-odr-item" v-for="(row, index) in roles" :key="index">
          <td class="tb-odr-info">{{ index + 1 }}</td>
          <td class="text-uppercase">{{ row.name }}</td>
          <td>
            <span class="badge bg-danger" v-if="row.status == 0"
              >Desactivo</span
            >
            <span class="badge bg-success" v-else>Activo</span>
          </td>
          <td>
            <a  v-if="row.status == 0" @click="activarRol(row.id)" v-show="hasPermissionTo(['role.delete'])">
              <em title="Restaurar" class="ni ni-reload text-success fs-4"></em>
            </a>
            <a v-else @click="eliminarRol(row.id)" v-show="hasPermissionTo(['role.delete'])">
              <em class="ni ni-trash text-danger fs-4"></em>
            </a>
            <router-link v-if="row.status == 1" :to="'/edit-role/' + row.id" v-show="hasPermissionTo(['role.edit'])">
              <em class="ni ni-edit text-success fs-4"></em>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
