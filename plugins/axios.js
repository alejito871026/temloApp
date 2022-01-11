export default function ({$axios,app}) {  
  $axios.onError(async error => {
    if(error=='ExpiredAuthSessionError: Both token and refresh token have expired. Your request was aborted.'){
      console.log('error al caducar el token')
      if(app.context.route.name=='clientes'){
        app.$auth.$storage.removeUniversal('horaSalida')
        app.$auth.$storage.removeUniversal('carrito')
        console.log('el token expiro para el cliente')
        let r = await app.store.dispatch('$nuxtSocket/emit', {
          label: 'clientes', // Use persisted socket "mySocket"
          evt: 'salioClienteDisconect',
        })
        if(r){
          app.$auth.logout()
          app.router.push('/')
          app.store.commit('storeInicioSesion/estadoAbrirInicioSesion', true)
        }
      }
      if(app.context.route.name=='adminTemlo'){
        app.$auth.$storage.removeUniversal('horaSalidaAdminTemlo')
        console.log('el token expiro para el cliente')
        let r = await app.store.dispatch('$nuxtSocket/emit', {
          label: 'adminTemlo', // Use persisted socket "mySocket"
          evt: 'salioEmpleadoDisconect',
        })
        if(r){
          app.$auth.logout()
          app.router.push('/loguinUsers')
        }
      }
      if(app.context.route.name=='AdminProveedores'){
        app.$auth.$storage.removeUniversal('horaSalidaAdminProveedor')
        console.log('el token expiro para el cliente')
        let r = await app.store.dispatch('$nuxtSocket/emit', {
          label: 'adminProveedor', // Use persisted socket "mySocket"
          evt: 'salioEmpleadoProveedorDisconect',
        })
        if(r){
          app.$auth.logout()
          app.router.push('/loguinUsers')
        }
      }
    }else{
      const code = parseInt(error.response && error.response.status)
      if (code === 402) {
        if(app.context.route.name=='clientes'){
          app.$auth.$storage.removeUniversal('horaSalida')
          app.$auth.$storage.removeUniversal('carrito')
          console.log('el token se daños desde el cliente al realizar una busqueda a la api en la funcion de midelware de autentificacionf')
          let r = await app.store.dispatch('$nuxtSocket/emit', {
            label: 'clientes', // Use persisted socket "mySocket"
            evt: 'salioClienteDisconect',
          })
          if(r){
            app.$auth.logout()
            app.router.push('/')
            app.store.commit('storeInicioSesion/estadoAbrirInicioSesion', true)
          }
        }
        if(app.context.route.name=='adminTemlo'){
          app.$auth.$storage.removeUniversal('horaSalidaAdminTemlo')
          console.log('el token se daños desde el cliente al realizar una busqueda a la api en la funcion de midelware de autentificacionf')
          let r = await app.store.dispatch('$nuxtSocket/emit', {
            label: 'adminTemlo', // Use persisted socket "mySocket"
            evt: 'salioEmpleadoDisconect',
          })
          if(r){
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }
        }
        if(app.context.route.name=='AdminProveedores'){
          app.$auth.$storage.removeUniversal('horaSalidaAdminProveedor')
          console.log('el token se daños desde el cliente al realizar una busqueda a la api en la funcion de midelware de autentificacionf')
          let r = await app.store.dispatch('$nuxtSocket/emit', {
            label: 'adminProveedor', // Use persisted socket "mySocket"
            evt: 'salioEmpleadoProveedorDisconect',
          })
          if(r){
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }
        }
      }
      if (code === 401) {
        console.log('error al dañarse el token desde una actualizacion de pagina o en el logueo')
        if(app.context.route.name=='clientes'){
            app.$auth.$storage.removeUniversal('horaSalida')
            app.$auth.$storage.removeUniversal('carrito')
            app.$auth.logout()
            app.router.push('/')
            app.store.commit('storeInicioSesion/estadoAbrirInicioSesion', true)
        }
        if(app.context.route.name=='adminTemlo'){
          app.$auth.$storage.removeUniversal('horaSalidaAdminTemlo')
          let r = await app.store.dispatch('$nuxtSocket/emit', {
            label: 'adminTemlo', // Use persisted socket "mySocket"
            evt: 'salioEmpleadoDisconect',
          })
          if(r){
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }else{
            console.log('ocurrio un error 104 axios.js pluguins')
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }
        }
        if(app.context.route.name=='AdminProveedores'){
          app.$auth.$storage.removeUniversal('horaSalidaAdminProveedor')
          let r = await app.store.dispatch('$nuxtSocket/emit', {
            label: 'adminProveedor', // Use persisted socket "mySocket"
            evt: 'salioEmpleadoProveedorDisconect',
          })
          if(r){
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }else{
            console.log('ocurrio un error 119 axios.js pluguins')
            app.$auth.logout()
            app.router.push('/loguinUsers')
          }
        }
      }
    }
  })
}