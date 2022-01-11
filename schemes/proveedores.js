import { LocalScheme } from '~auth/runtime'
export default class CustomScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    // Token is required but not available
    if (!this.check().valid) {
      this.$auth.$storage.removeUniversal('horaSalida')
      this.$auth.$storage.removeUniversal('carrito')
      console.log('no sse encuentra validado 3')
      return
    }else{
      console.log('se encuentra validado')
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }
    
    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user,
    ).then((response) => {
      const user = response.data
      // Transform the user object
      const customUser = {
        nombre: user.nombreEP+' '+user.primerApellidoEP+' '+user.segundoApellidoEP,
        celular:user.celularEP,
        email:user.emailEP,
        empresa:user.empresaProveedoraEP.nombreProveedor,
        coordenadas:user.empresaProveedoraEP.coordenadasProveedor,
        idEmpresa:user.empresaProveedoraEP._id,
        rol: user.rol,
        _id:user._id
      }
      // Set the custom user
      // The `customUser` object will be accessible through `this.$auth.user`
      // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
      this.$auth.setUser(customUser)
      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
      console.log('error en el token')
    })
  }
}