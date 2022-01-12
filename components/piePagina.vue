<template>
  <div>
      <nav class="navbar fixed-bottom text-white" id="tituloo">
        <div class="container-fluid">
          <div id="textuno" >
            <strong>Visítenos</strong><br>
            <p>Calle 9 # 1 - 74 <br>
            Dosquebradas, Risaralda</p>
          </div>
          <div id="textuno">
              <strong>Ubicación</strong>
              <a href="https://www.google.com/maps/place/temlo/@4.8242374,-75.7037669,17z/data=!3m1!4b1!4m5!3m4!1s0x8e38875f68493b1f:0x6b140f49972bb1dc!8m2!3d4.8242374!4d-75.7015782" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/maps.png"> <p class="text-white pt-2" id="textuno">Mapa</p> 
                </div>
              </a>
          </div>
          <div id="textuno">
            <strong>Contáctenos</strong><br>
            <div class="btn btn-group col-sm-12">
              <a href="https://wa.me/573506553184" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/Whap.png" class="">
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </a> 
              <a href="https://www.facebook.com/Temloatiempo" class="col-sm-3" target="_blank" >
                <div class="btn btn-group col-sm-12">
                  <img id="wap" src="../static/facebook.png" class="">
                  <div class="pt-2 text-white mx-auto" id="textuno">
                  </div>
                </div>
              </a> 
              <a href="https://www.instagram.com/temloatiempo/" class="col-sm-3" target="_blank" >
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
  background-color: #751094;
}
#textuno{
  font-size:10px;
}

#wap{
  height:28px;
  width: 30px;
}
</style>