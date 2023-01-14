<template>
  <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-toggle target="nav-collaps"></b-navbar-toggle>
            <b-collapse id="nav-collaps" is-nav>
                <b-navbar-nav class="ml-auto">
                    <ul class="navbar-nav ">
                        <li class="btn text-white border border-primary sm" @click="estadoAgregarTransportador(true)">
                            Agregar transportador
                        </li>
                        <li class="btn text-white border border-primary sm" @click="estadoAgregarVehiculo(true),estadoVerVehiculos(false)">
                            Agregar Vehiculo
                        </li>
                        <li class="btn text-white border border-primary sm" @click="estadoVerTiposVehiculos(true)">
                            Tipos vehiculos
                        </li>
                    </ul>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div v-if="verTiposVehiculos">
            <tipos-vehiculos/>
        </div>
        <div class="row">
            <tabla-transportadores-temlo class="col-md-6 pr-1 ml-2"/>
            <tabla-vehiculos-inscritos class="col md-6 pl-1 mr-2"/>
        </div>
        <b-modal v-model="agregarTransportador" centered hide-footer hide-header no-close-on-backdrop no-close-on-esc size="md">
            <agregar-transp-temlo/>
        </b-modal>
        <b-modal v-model="agregarVehiculo" centered hide-footer hide-header no-close-on-backdrop no-close-on-esc size="md">
            <agregar-vehiculo/>
        </b-modal>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import agregarTranspTemlo from '../../components/adminTemlo/agregarTranspTemlo.vue'
import tablaTransportadoresTemlo from '../../components/adminTemlo/tablaTransportadoresTemlo.vue'
import tablaVehiculosInscritos from '../../components/adminTemlo/tablaVehiculosInscritos.vue'
import tiposVehiculos from '../../components/adminTemlo/tiposVehiculos.vue'
import agregarVehiculo from '../../components/adminTemlo/agregarVehiculo.vue'
export default {
    components : {
        agregarTranspTemlo,tablaTransportadoresTemlo,tablaVehiculosInscritos,tiposVehiculos,agregarVehiculo
    },
    computed:{
        ...mapState('storeAdminTemlo',['agregarTransportador','verTransportadores','agregarVehiculo','verVehiculos','verTiposVehiculos']),
    },
    async created(){
        
    },
    data(){
        return{
        }
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarTransportador', 'estadoVerTransportadores','estadoAgregarVehiculo','estadoVerVehiculos','estadoVerTiposVehiculos']),
    }
}
</script>

<style>

</style>