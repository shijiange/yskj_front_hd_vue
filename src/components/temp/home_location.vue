<template>
  <div class="location-search" :style="{ 'background-color': datas.params.bgcolor, 'border-color':datas.params.bordercolor}"  id="menu">
    <div class="location" :style="{ 'color': datas.params.color2}" @click='tolocation'>
      <i class="fa fa-map-marker" style="margin-right: 2%;"></i>{{address}}<i class="fa fa-chevron-down" style="margin-left: 2%;"></i>
    </div>
    <div @click='tosearch' class="search-form-box"  :style="{'background-color':datas.params.bgcolor,'color':datas.params.color}">
      <i class="fa fa-search"></i> {{datas.params.placeholder || '附近商家商品'}}
    </div>
  </div>
</template>
<script>
//import BMap from 'BMap';

export default {
  props: ['datas'],
  data() {
    return {
      mid:this.fun.getKeyByMid(),
      address:'',
      city:'',
      point:{},
    };
  },
  mounted() {
    console.log('mounted',this.datas);
    this.ready();
  },
  created() {

  },
  activated() {
    console.log('activated');
    this.ready();
  },
  methods:{
    ready: function () {
      //this.getLocation();

      //var myLocation = window.localStorage.getItem('myLocation');
      var myLocation = this.$store.state.o2oLocation;

      this.$store.commit('setReferer', window.location.href);
      //console.log('path::::::', this.$route.path);
      if (myLocation.point) {
        this.address = myLocation.title;
        this.city = myLocation.city;
        this.point = myLocation.point;
        console.log('temp myLocation:', myLocation);

        //初始化数据
        //this.getStores();
        //this.getStoresCategory();
      } else{
        console.log('location不存在');
        this.getLocation();
      }
    },

    getLocation() {
      var that = this;
      var mapObj = new AMap.Map('iCenter');
      mapObj.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
          convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,         // 显示定位按钮，默认：true
          buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,         // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy:true       // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);       // 返回定位出错信息
      });

      function onComplete(obj){
        // var res = '经纬度：' + obj.position +
        //     '\n精度范围：' + obj.accuracy +
        //     '米\n定位结果的来源：' + obj.location_type +
        //     '\n状态信息：' + obj.info +
        //     '\n地址：' + obj.formattedAddress +
        //     '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
        //alert(res);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat:position[1],
          lng:position[0],
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city: obj.addressComponent.province;


        var pos = {
          address:obj.formattedAddress,
          city:that.city,
          title:obj.formattedAddress,
          point:that.point,
        };
        console.log('test pos', pos);
        that.$store.commit('updateLocation', pos);
        that.$store.commit('setLocation', pos);
        window.localStorage.setItem("myLocation",JSON.stringify(pos));

      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        console.log(obj);
      }

      /*var that = this;
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(r.point);
                console.log('您的位置ok：', r);
                that.address = r.address.city;
                that.city = r.address.city;

                that.point = r.point;
                var pos = {
                    address:that.address,
                    city:that.city,
                    title:that.address,
                    point:that.point,
                }
                //this.balance = this.$store.state.balance;
                that.$store.commit('updateLocation', pos);
                that.$store.commit('setLocation', pos);
                window.localStorage.setItem("myLocation",JSON.stringify(pos));
                //that.getStores();
            }
            else {
                //todo, 获取收货地址
                that.getMyAddress();
            }
        },{enableHighAccuracy: true})
   */


      // var geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r){
      //   if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //     var mk = new BMap.Marker(r.point);
      //     console.log('您的位置ok：', r);
      //     that.address = r.address.city;
      //     that.city = r.address.city;
      //
      //     that.point = r.point;
      //     var pos = {
      //       address:that.address,
      //       city:that.city,
      //       title:that.address,
      //       point:that.point,
      //     }
      //     //this.balance = this.$store.state.balance;
      //     that.$store.commit('updateLocation', pos);
      //     that.$store.commit('setLocation', pos);
      //     window.localStorage.setItem("myLocation",JSON.stringify(pos));
      //     //that.getStores();
      //   }
      //   else {
      //     //todo, 获取收货地址
      //     that.getMyAddress();
      //   }
      // },{enableHighAccuracy: true})
    },

    getMyAddress () {
      //todo, 失败则跳转
      this.$router.push(this.fun.getUrl('o2oLocation'));
    },

    tolocation() {
      this.$router.push(this.fun.getUrl('o2oLocation'));
    },
    tosearch() {
      console.log(this.point);
      this.$router.push(this.fun.getUrl('o2oSearch', {city:this.city, point:JSON.stringify(this.point)}));
      //this.$router.push('/search');
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .location-search {
    z-index: 99;
    margin: auto;
    text-align: center;
    width: 100%;
    height: 2.125rem;
    line-height: 2.125rem;
  }

  .location-search .location {
    margin: 0 3%;
    width: 44%;
    color: #fff;
    height: 1.875rem;
    line-height: 1.875rem;
    overflow: hidden;
    text-align: left;
    padding-left: 0.9375rem;
    font-size: 12px;
    float: left;
    box-sizing: border-box;
  }

  .location-search .search-form-box {
    margin: 0 3%;
    width: 34%;
    color: #fff;
    border-radius: 0.9375rem;
    height: 1.875rem;
    line-height: 1.875rem;
    overflow: hidden;
    text-align: left;
    padding-left: 0.9375rem;
    font-size: 12px;
    float: left;
    box-sizing: border-box;
  }
</style>