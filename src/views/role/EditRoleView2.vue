<template>
  <div class="nk-content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12 p-3" style="background-color: #f9fafb">
          <form
            id="editRoleForm"
            autocomplete="off"
            @submit.prevent="handleSubmit"
          >
            <div class="row">
              <div class="col-md-4">
                <div class="mb-3 d-flex align-items-center">
                  <input
                    v-model="form.name"
                    class="form-control"
                    name="name"
                    type="text"
                    placeholder="Nombre Rol"
                  />
                  <button
                    type="submit"
                    class="btn btn-dim btn-outline-secondary mx-1"
                  >
                    <em class="icon ni ni-save"></em> Actualizar
                  </button>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                class="col-xs-12 col-sm-6 col-md-4 col-lg-3 pt-2"
                v-for="(permissions, modulo) in permissionsAll"
                :key="modulo"
              >
                <div class="card card-bordered">
                  <div
                    class="card-header border-bottom text-uppercase text-white bg-warning"
                  >
                    {{ modulo }}
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="modu in permissions">
                      <div
                        class="custom-control custom-control-sm custom-switch"
                      >
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          v-model="form.permissions"
                          :id="modu.id"
                          :value="modu.id"
                        />
                        <label
                          class="custom-control-label"
                          :for="modu.id"
                          style="font-size: 0.79rem"
                          >{{ modu.description }}</label
                        >
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuth } from "../../stores/auth";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

const headers = useAuth().headers();

const form = ref({
  id: null,
  name: "",
  guard_name: "web",
  permissions: [],
});
const route = useRoute();

const { id } = route.params;

const fetchRoleData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/permissions/permissionAll/${id}`,
      headers
    );
    form.value.name = response.data.data.name;
  } catch (error) {
    console.error(error);
  }
};

const permissionsAll = ref([]);

const fetchAllPermissions = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/permissions/list`,
      headers
    );
    permissionsAll.value = response.data.data;
  } catch (error) {
    console.error(error);
  }
};

const uniqueRolePermissions = ref([]);

const responseArray = ref([]);

const fetchUniqueRoleData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/roles/list/${id}`,
      headers
    );
    responseArray.value = Object.values(response.data);
    uniqueRolePermissions.value = responseArray.value[0].map(
      (el) => el.permission_id
    );

    form.value.permissions = uniqueRolePermissions.value;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchAllPermissions();
  fetchUniqueRoleData();
  fetchRoleData();
});

const handleSubmit = async () => {
  if (!form.value.name) {
    ElMessage({
      message: "Nombre del rol obligatorio.",
      type: "warning",
    });
    return;
  }

  if (!form.value.permissions.length > 0) {
    ElMessage({
      message: "Seleccione al menos un permiso.",
      type: "warning",
    });
    return;
  }

  const formData = JSON.stringify(form.value);

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/roles/edit/${id}`,
      formData,
      headers
    );
    if (res.data.status) {
      ElMessage({ message: res.data.message, type: "success" });
      resetForm();
    } else {
      ElMessage({ message: res.data.message, type: "error" });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style scoped>
.list-group-item {
  background-color: #fff;
  border: 0px;
}

.card-bordered {
  height: 100%;
}
</style>

<style scoped>
.list-group-item {
  background-color: #fff;
  border: 0px;
}

.card-bordered {
  height: 100%;
}
</style>
