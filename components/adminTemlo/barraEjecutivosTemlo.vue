<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-toggle target="nav-collaps"></b-navbar-toggle>
            <b-collapse id="nav-collaps" is-nav>
                <b-navbar-nav class="ml-auto">
                    <ul class="navbar-nav ">
                        <li class="btn text-white border border-primary sm" @click="estadoAgregarEjecutivoTemlo(true),estadoVerEjecutivos(false)">
                            Agregar Ejecutivo
                        </li>
                    </ul>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <div v-if="agregarEjecutivoTemlo" class="card">
            <div class="card-header"></div>
            <div class="card-body">
                <agregar-ejec-temlo/>
            </div>
            <div class="card-footer">
                <div class="btn btn-block btn-warning" @click="estadoAgregarEjecutivoTemlo(false),estadoVerEjecutivos(true),estadoEjecutivoAeditar(false)"><h3><strong>Cerrar</strong></h3></div>
            </div>
        </div>
        <tabla-ejecutivos-temlo v-if="verEjecutivos"/>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
    computed:{
        ...mapState('storeAdminTemlo',['agregarEjecutivoTemlo','verEjecutivos'])
    },
    async created(){
        
    },
    data(){
        return{
        }
    },
    methods:{
        ...mapMutations('storeAdminTemlo',['estadoAgregarEjecutivoTemlo', 'estadoVerEjecutivos','estadoEjecutivoAeditar']),
    }

}
</script>

<style>

</style>