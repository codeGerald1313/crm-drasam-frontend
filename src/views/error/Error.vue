
<script lang="ts">
import { ref, defineComponent, onMounted } from "vue"

export default defineComponent({
    setup() {

        return {

        }
    }
});
</script>

<template>
    <div class="nk-app-root">
        <div class="nk-main ">
            <div class="nk-wrap nk-wrap-nosidebar">
                <div class="nk-content ">
                    <div class="nk-block nk-block-middle wide-xs mx-auto">
                        <div class="nk-block-content nk-error-ld text-center">
                            <h1 class="nk-error-head" id="err">ERROR</h1>
                            <h3 class="nk-error-title">Oops! No tienes permisos para este contenido.</h3>
                            <p class="nk-error-text">Comunicate con el administrador para que te otorge los permisos necesarios y así puedas acceder al contenido. 🙂</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<style>
    #err {
        background: -webkit-linear-gradient(#f8bc02, #bd8e00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: rgba(0, 0, 0, 0);
    }
</style>