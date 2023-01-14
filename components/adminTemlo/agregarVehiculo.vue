<template>
    <div class="card">
        <div class="card-header">
            agregarVehiculo
        </div>
        <div class="card-body">
            agregarVehiculo
        </div>
        <div class="card-footer">
            <div class="btn btn-block btn-warning" @click="estadoAgregarVehiculo(false),estadoVerVehiculos(true)"><h3><strong>Cerrar</strong></h3></div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {

    data(){
        return {
        }
    },
    computed:{
        //...mapState('storeAdminTemlo',['agregarTransportador','verTransportadores','agregarVehiculo','verVehiculos','verTiposVehiculos']),
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarVehiculo','estadoVerVehiculos']),
    }

}
</script>

<style>

</style>