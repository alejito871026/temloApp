<template>
  <div>
      <nav class="navbar fixed-bottom text-white" id="tituloo">
        <div class="container-fluid">
          <div id="textuno" >
            <strong>Visítenos</strong><br>
            <p>Cra 6 # 16 - 57 <br>
            Barrio el llano, Cartago Valle</p>
          </div>
          <div id="textuno">
              <strong>Ubicación</strong>
              <a href="https://www.google.com/maps/place/Convenios+APSA/@4.7477875,-75.920989,17z/data=!3m1!4b1!4m5!3m4!1s0x8e3871a7adbbedf1:0xe7555388e498826b!8m2!3d4.7477875!4d-75.9188003" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/maps.png"> <p class="text-white pt-2" id="textuno">Mapa</p> 
                </div>
              </a>
          </div>
          <div id="textuno">
            <strong>Contáctenos</strong><br>
            <div class="btn btn-group col-sm-12">
              <a href="https://wa.me/573116793772" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/Whap.png" class="">
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </a> 
              <a href="https://www.facebook.com/Convenios-APSA-106662688362396" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/facebook.png" class="">
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </a> 
              <a href="https://l.wl.co/l?u=https%3A%2F%2Finstagram.com%2Fconveniosapsa%3Figshid%3D14g38o76ihvbd" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/insta.png" class="">
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </a> 
              <router-link to="/loguinUsers" target="_blank">
                <div class="btn btn-group col-sm-12">
                  <b-icon-person-badge-fill variant="white" font-scale="2.6"></b-icon-person-badge-fill>
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </nav>
  </div>
</template>

<script>
export default {

}
</script>
<style>
#imagen {
    width: 100%;
    height: 200px;
}
#tituloo {
  background-color: #163c92;
}
#textuno{
  font-size:10px;
}

#wap{
  height:28px;
  width: 30px;
}
</style>