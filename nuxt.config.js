export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'temloApp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    /* script: [{
      src: "//cdn.jsdelivr.net/npm/sweetalert2@11"
    }] */
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/crypto-vue.js' },
    '~/plugins/axios',
    '~/plugins/swetAlert',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://auth.nuxtjs.org/guide/setup#installation
    '@nuxtjs/auth-next',
    // https://nuxt-socket-io.netlify.app/installation
    'nuxt-socket-io',
    // https://sweetalert2.github.io/
    //'nuxt-sweetalert2'
  ],
  bootstrapVue: {
    icons: true
  },
  io: {
    sockets: [ // Required
      { // At least one entry is required
        name: 'temloApp.net',
        url:'https://temlo-app.herokuapp.com',
        default: true,
        namespaces: {
          '/adminTemlo':{},
          '/EjecutivoTemlo':{},
          '/AdminProveedor':{},
          '/ejecutivoProveedor':{},
          '/transportador':{},
          '/clientes':{},
          '/visitorsCatalogo':{},
        }
      },
    ]
  },
  auth: {
    strategies: {
      cliente:{
        scheme: '~/schemes/clientes',
        user: {
          property: 'user',
        },
        endpoints:{
          login: {
            url: '/newlogin/loginCliente',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/newLogin/cliente',
            method: 'get',
            propertyName: 'user'
          }
        },
        tokenRequired: true,
        tokenType: "Bearer",
      },
      adminTemlo:{
        scheme: '~/schemes/adminTemlo',
        user: {
          property: 'user',
        },
        endpoints:{
          login: {
            url: '/newloginAdmintemlo/loginEmpleadoTemlo',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/newloginAdmintemlo/empleadoTemlo',
            method: 'get',
            propertyName: 'user'
          }
        },
        tokenRequired: true,
        tokenType: "Bearer",
      },
      proveedores:{
        scheme: '~/schemes/proveedores',
        user: {
          property: 'user',
        },
        endpoints:{
          login: {
            url: '/newloginProveedor/loginEmpleadoProveedor',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/newloginProveedor/empleadoProveedor',
            method: 'get',
            propertyName: 'user'
          }
        },
      },
      transportador:{
        scheme: '~/schemes/transportador',
        user: {
          property: 'user',
        },
        endpoints:{
          login: {
            url: '/newlogin/loginCliente',
            method: 'post',
            propertyName: 'token'
          },
          logout: false,
          user: {
            url: '/newLogin/cliente',
            method: 'get',
            propertyName: 'user'
          }
        },
      },
    },    
    redirect:false,
    rewriteRedirects: true,
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseUrl:'https://temlo-app.herokuapp.com/server'
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'es'
    }
  },
  serverMiddleware: [
    { path: '/server', handler: '~/server/server.js' } 
  ],
  env:{
    SECRET_KEY_TOKEN: process.env.SECRET_KEY_TOKEN
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  }
}
