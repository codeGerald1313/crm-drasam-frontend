import axios from "axios";
import Swal from 'sweetalert2';
import { ElMessage, ElMessageBox } from "element-plus/lib";

export const deletable = {
  methods: {
    destroy(url: string): Promise<void> {
      return new Promise((resolve) => {
            Swal.fire({
                title: '¿Eliminar registro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!',
                reverseButtons: true
            })
          .then(() => {
              axios.post(url, { _method: "DELETE" })
                .then((res) => {
                  if (res.status === 200) {
                    ElMessage.success(
                      "Se eliminó correctamente el registro"
                    );
                    resolve();
                  }
                })
                .catch((error) => {
                  if (error.response && error.response.status === 500) {
                    ElMessage.error("Error al intentar eliminar");
                  } else if (error.response && error.response.data.message) {
                    console.log(error.response.data.message);
                  }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};