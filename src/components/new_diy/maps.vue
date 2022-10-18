<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--地图静态-->
    <div :id="`wrapper${id}`" class="wrapper"></div>
    <div class="bottom-box">
      <div class="left-location">
        <span v-if="datas.show_business" class="business">{{datas.business_title}}</span>
        <span v-if="datas.show_address" class="address">{{datas.map_position.address}}</span>
      </div>
      <div class="right-icon">
        <div class="icon-bg" v-if="datas.show_address_icon" @click="goToAdress">
          <i class="iconfont icon-zx_map_local"></i>
        </div>
        <a :href="'tel:'+ datas.phone_title" v-if="datas.show_phone_icon">
          <div class="icon-bg">
            <i class="iconfont icon-zx_map_tel"></i>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// import { Toast } from 'vant';
// 自定义样式
const css = function() {
  const {
    map_height,
    address_font_size,
    address_font_color,
    business_font_size,
    business_font_color,
    bg_color,
    icon_color,
    icon_bg_color,
    // phone_title,
  } = this.datas;

  return `
        .component-${this.id} .wrapper {
            width: ${this.fun.getPhoneEnv() == 3 ? '375':this.map_width}px;
            height: ${map_height}px;
        }

        .component-${this.id} .bottom-box {
          background-color: ${bg_color};
        }

        .component-${this.id} .left-location .business{
            color: ${business_font_color};
            font-size: ${business_font_size}px;
        }

        .component-${this.id} .left-location .address{
            color: ${address_font_color};
            font-size: ${address_font_size}px;
        }

        .component-${this.id} .right-icon .icon-bg{
            background-color: ${icon_bg_color};
        }

         .component-${this.id} .right-icon .iconfont{
            line-height: 1.8rem;
            color: ${icon_color};
        }

    `;
};

export default {
  data() {
    return {
      map_width: '375',
      map: null,
      marker: null,
    };
  },
  props: ["id", "datas", "styles"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  watch: {
    datas: {
      deep: true,//深度监听
      handler: function () {
        if(this.datas.map_position.lng) {
          this.map.setZoomAndCenter(15, [this.datas.map_position.lng, this.datas.map_position.lat]); //同时设置地图层级与中心点

          this.map.remove(this.marker);

          this.marker = new AMap.Marker({
            position: new AMap.LngLat(this.datas.map_position.lng, this.datas.map_position.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          });

          this.map.add(this.marker);
        }
      }
    }
  },

  mounted() {
    this.map_width = document.body.clientWidth;
    this.initMap();
  },
  methods: {
    goToAdress() {
      let point = {lng: this.datas.map_position.lng,lat: this.datas.map_position.lat};
      this.fun.goToWXAdress(point, this.datas.business_title, this.datas.map_position.address);
    },
    initMap() {
      this.map = new  AMap.Map(`wrapper${this.id}`,{
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 10  //指定缩放级别
      });

      if(this.datas.map_position.lng) {
        this.map.setZoomAndCenter(15, [this.datas.map_position.lng, this.datas.map_position.lat]); //同时设置地图层级与中心点


        this.marker = new AMap.Marker({
          position: new AMap.LngLat(this.datas.map_position.lng, this.datas.map_position.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });

        this.map.add(this.marker);
      }else {
        // 创建一个 Marker 实例：
        this.marker = new AMap.Marker({
          position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });

        // 将创建的点标记添加到已有的地图实例：
        this.map.add(this.marker);
      }

    }
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
    text-align: left;
  }

  .wrapper {
    width: 375px;
    height: 250px;
  }

  .bottom-box {
    background-color: #5f5f5f;
    color: white;
    display: flex;
    padding: 5px 10px;
  }

  .left-location {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .right-icon {
    flex: 0 0 70px;
    display: flex;
    align-self: center;

    .icon-bg {
      margin-left: 5px;
      width: 2rem;
      height: 2rem;
      padding: 3px;
      background-color: #0090ff;
      border-radius: 50%;
      text-align: center;
    }
  }
</style>
