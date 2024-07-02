<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../stores/auth';
import { ElMessage } from 'element-plus';

export default defineComponent({
	setup() {
		const state = reactive({
			email: '',
			password: '',
		});

		const { login } = useAuth();
		const router = useRouter();

		const emailInput = ref();
		const passwordInput = ref();

		const handleSubmit = async () => {
			const email = emailInput.value.value;
			const password = passwordInput.value.value;
			if (!email || !password) {
				ElMessage.warning('Ingrese sus credenciales');
				return;
			}
			try {
				await login(email, password);
				router.push("/");
			} catch (error) {
				console.log(error);
			}
		};

		// Function password
        const showPassword = ref(false);

        const passwordVisibility = () => {
            showPassword.value = !showPassword.value;
        }

		return {
			email: state.email,
			password: state.password,
			handleSubmit,
			emailInput,
			passwordInput,
			showPassword,
			passwordVisibility
		};
	},
	
});


</script>

<template>

	<div class="nk-wrap nk-wrap-nosidebar">
		<div class="nk-content ">
			<div class="nk-split nk-split-page nk-split-lg">
				<div class="nk-split-content nk-split-stretch bg-lighter d-flex toggle-break-lg toggle-slide toggle-slide-right toggle-screen-lg" data-toggle-body="true" data-content="athPromo" data-toggle-screen="lg" data-toggle-overlay="true">
					<img class="img-presentation" src="../../assets/images/login/1.png" alt="">
					<div class="copyright fw-bold text-center">Copyright@crm2023</div>
				</div>


				<div class="nk-split-content nk-block-area nk-block-area-column nk-auth-container bk-color">
					<div class="nk-block nk-block-middle nk-auth-body">
						<div class="brand-logo pb-5 text-center">
							<a href="#" class="logo-link">
								<img src="../../assets/images/login/th.jpg" alt="logo-dark">
							</a>
						</div>
						<div class="nk-block-head">
							<div class="nk-block-head-content">
								<h5 class="text-center nk-block-title mb-4 title">Iniciar Sesión</h5>
							</div>
						</div>
						<form @submit.prevent="handleSubmit" class="form-validate is-alter" autocomplete="off">
							<div class="form-group">
								<div class="form-label-group">
									<label class="form-label" for="emailRef">Correo Electrónico</label>
								</div>
								<div class="form-control-wrap">
									<input autocomplete="off" type="text" class="form-control-lg form-rounded input-b" id="emailRef" ref="emailInput">
								</div>
							</div>
							<div class="form-group">
								<div class="form-label-group">
									<label class="form-label" for="passwordRef">Contraseña</label>									
								</div>
								<div class="form-control-wrap">
									<input autocomplete="new-password" :type="showPassword ? 'text' : 'password' " class="form-control-lg form-rounded input-b" id="passwordRef" ref="passwordInput">
									<a href="javascript:void(0)" @click="passwordVisibility">
										<em :class=" showPassword ? 'ni ni-eye' : 'ni ni-eye-off'" class="material-icons eye-icon"></em>
									</a>
								</div>
							</div>
							<div class="form-group">
								<div class="">
									<input type="checkbox" class="check-box">
									<label class="label-checkbox">Acepto los <a class="fw-bold letras" href="#">Términos y condiciones</a></label>																		
								</div>
							</div>
							<div class="form-group text-center">
								<button class="btn btn-warning btn-lg btn-block">Ingresar</button>
							</div>
						</form>

						<div class="form-note-s2 pt-4 text-center text-color" > <a  href="#staticBackdrop" data-bs-toggle="modal"  class="letras">¿Olvido la contraseña?</a></div>						
						<!-- Modal -->
						<div class="modal fullscreen-modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
							<div class="modal-dialog modal-sm">
								<div class="modal-content">
								
									<div class="modal-body">
										<span type="button" class="material-icons text-black b-close" aria-label="Close" data-bs-dismiss="modal">highlight_off</span>
																																																							
										<div class="text-center">
											<img src="../../assets/images/lock-icon.png" class="modal-icon">									
											<div class="letras text-center mt-1 text-modal"><p class="fw-bold text-black">¿Olvidaste tu contraseña?</p>Introduce tu email con el que te registraste y enseguida te enviaremos un correo para el cambio de clave</div>
											<div class="form-control-wrap mb-3 mu-3"> 
												<img src="../../assets/images/mail-icon.png" class="mail-icon">
												<input autocomplete="off" type="text" class="form-control-lg form-rounded input-modal mt-3" id="email" placeholder="Correo electrónico">
											</div>
											
											<button class="btn-lg btn-warning btn-block btn" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">Recuperar</button>
										</div>	
									</div>
								
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
					
</template>


<style scoped>

/*Cambios*/

.img-presentation{
	width: 100%;
	height: auto;
}

.letras{
	color: #545454;
}

.bk-color
{
background: #fff;
}
.input-b
{
	background: transparent;
	border:1px solid #A9A9A9;	
	outline: #545454;
	width: 372px;
	height: 42px;
	
}
.input-b:focus
{
 outline: none;
 background: transparent;
}
.form-label
{
	color: #545454;
}
.title
{
	color: #545454;
}
.check-box
{
	appearance: none;
	border: 1.1px solid #F8BC02;
	cursor: pointer;
	border-radius: 3.5px;
	width: 15px;
	height: 15px;
	margin-top: 10px ;
	margin-right: 10px ;	
}
.check-box:checked
{
	background: #F8BC02;
}
.label-checkbox
{	
	vertical-align: middle;	
	margin: 0px 0px 0px 0px;
	vertical-align: middle;
	margin-bottom: 7px;
	color: #545454;
	cursor: default;
}
.btn
{
	width: 182px;
	height: 44px;
	background-color: #F8BC02;
	border-color: #F8BC02;
	color: #000;
}
.btn:hover 
{
	background-color: #fff !important;
	border-color: #F8BC02 !important;
	color: #F8BC02;
}
.btn:visited 
{
	background-color: #545454;
	border-color: #545454;
}
.password-icon
{
  float: right;
  position: relative;
  margin: -25px 10px 0 0;
  cursor: pointer;
}
.eye-icon
{
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 19px;
  z-index: 10;
  opacity: 45%;
  color: #545454;
}
.copyright{
	position: absolute;	
	bottom: 40px;
	margin-left: 43%;
	color: #CBCDCE;
}
.modal-body {
    padding: 1.5rem 1.5rem;
}
.modal-content
{
	width: 319px;
	height: 363px;
	
}
.fullscreen-modal .modal-dialog {
  margin: 0;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
}
@media (min-width: 330px) {
  .fullscreen-modal .modal-dialog {
    width: 300px;
  }
}
@media (min-width: 768px) {
  .fullscreen-modal .modal-dialog {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .fullscreen-modal .modal-dialog {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .fullscreen-modal .modal-dialog {
     width: 1170px;
  }
}
.modal-icon
{
	width: 63px;
	height: 62px;
	margin-left: 3%;
}
.mail-icon
{
	position: absolute;
	z-index: 10px;
	bottom: 11px;
	left: 10px;
	width: 25px;
	height: 20px;
}
.input-modal
{
	background: transparent;
	border:1px solid #A9A9A9;	
	outline: #545454;
	width: 282px;
	height: 42px;
	padding-inline-start: 15%;	
}
.input-modal::placeholder{
	opacity: 50%;
}
.b-close
{
	position: absolute;
	top: 2%;
	left: 91%;
	cursor: pointer;
	color: #F8BC02 !important;
}
.text-modal
{
	padding: 0px 25px 0px 25px;
}


/*Fin Cambios*/

.font-weight-bold {
	font-weight: bold;
}

.nk-auth-body {
    margin-right: auto !important;
}

.form-rounded{
	border-radius: 13px;
}

</style>

