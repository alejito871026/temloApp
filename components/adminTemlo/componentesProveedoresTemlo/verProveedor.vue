<template>
    <div>
        <div class="p-4">
            verProveedor
            {{empresa}}
            <div class="btn btn-block btn-outline-warning p-3" @click="estadoVerProveedor(false)"><h4>Cerrar proveedor</h4></div>
        </div>  
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    props:['empresa'],
    methods: {
        ...mapMutations('storeAdminTemlo',['estadoVerProveedor']),
    }
}
</script>

<style>

</style>