<template>
  <div class="pages">
    <c-title :hide="false" text="物流详情"></c-title>

    <div class="map" v-if="details.is_another == 1 && details.another_order && details.another_order.isset_rider != 0 && details.another_order.sf_status != 17" ref="workSessionMap"></div>

    <div class="container" v-if="details.is_another == 1">
      <div class="express_info">
        <div class="express_num">物流单号：{{ details.another_order.another_order_sn }} <span v-clipboard:copy="details.another_order.another_order_sn" v-clipboard:success="onCopy">复制</span></div>
        <div class="clerk" v-if="details.another_order.isset_rider != 0 && details.another_order.sf_status != 17">
          <div class="face">
            <img
              src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F55%2F34%2F61%2F553461a1d8bb07b1026a7eeff17319e0.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644136224&t=09bd897f0fc3a5cbe0352bde9e9b4500"
              alt=""
            />
          </div>
          <div class="clerk-info">
            <div class="clerk-status">
              配送员正在送货
            </div>
            <div class="clerk-distance" v-if="false">
              距您43.9m
            </div>
          </div>
          <div class="call-icon" v-if="details.another_order.rider_phone">
            <a :href="'tel:' + details.another_order.rider_phone"><i class="iconfont icon-hujiaokefu"></i></a>
          </div>
        </div>
      </div>

      <div class="details">
        <template v-for="(item, index) in details.another_order.callback_data">
          <div class="details-item" :class="{ active: index == 0 }" :key="index">
            <div class="icon"></div>
            <div class="desc_text">{{ item.content }}</div>
            <div class="time">{{ item.create_time }}</div>
          </div>
          <div class="hr" v-if="details.another_order.callback_data.length != index + 1" :key="index"></div>
        </template>
      </div>
    </div>

    <div class="no-express" v-else>
      <div class="face">
        <img
          src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F55%2F34%2F61%2F553461a1d8bb07b1026a7eeff17319e0.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644136224&t=09bd897f0fc3a5cbe0352bde9e9b4500"
          alt=""
        />
      </div>
      <div class="clerk-info">
        <div class="clerk-status">
          商家配送
        </div>
        <div class="clerk-distance">
          暂无物流信息
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      details: {}
    };
  },
  mounted() {},
  created() {
    this.getDetails();
  },
  methods: {
    getDetails() {
      $http.get("plugin.city-delivery.frontend.order.getDeliveryMessage", { order_id: this.$route.query.id }).then(res => {
        if (res.result == 1) {
          this.details = res.data;
          this.$nextTick(() => {
            this.setMap();
          });
        }
        console.log(res);
      });
    },
    setMap() {
      console.log(this.$refs.workSessionMap);
      let longitude = this.details.another_order.rider_lng;
      let latitude = this.details.another_order.rider_lat;
      var map = new AMap.Map(this.$refs.workSessionMap, {
        resizeEnable: true,
        zoom: 11, //级别
        center: [longitude, latitude] //中心点坐标
      });
      var icon = new AMap.Icon({
        size: new AMap.Size(33, 45), // 图标尺寸
        image: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/orderLogisticsDetails_position.png", // Icon的图像
        imageOffset: new AMap.Pixel(0, 0), // 图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(33, 45) // 根据所设置的大小拉伸或压缩图片
      });
      var marker = new AMap.Marker({
        position: new AMap.LngLat(longitude, latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        offset: new AMap.Pixel(-17, -25),
        icon: icon, // 添加 Icon 图标 URL
        title: "北京",
        zoom: 13
      });
      var circle = new AMap.CircleMarker({
        center: new AMap.LngLat(longitude, latitude), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        radius: 50,
        fillColor: "#67b5ec",
        fillOpacity: "0.3",
        strokeColor: "#67b5ec",
        strokeWeight: 1
      });
      map.add(circle);
      map.add(marker);
    },
    onCopy() {
      this.$toast({
        message: "复制成功",
        position: "bottom",
        duration: 5000
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.map {
  width: 23.406rem;
  height: 21.875rem;
  margin-bottom: -3.415rem;
  background-color: #ebebeb;
}

.container {
  position: relative;
  z-index: 999;
  padding: 0 0.969rem;
  margin-top: 0.625rem;
  .express_info {
    // height: 6.563rem;
    padding: 0 0.938rem;
    background-color: #ffffff;
    box-shadow: 0rem 0.344rem 0.969rem 0.031rem rgba(136, 136, 136, 0.18);
    border-radius: 0.313rem;
    .express_num {
      display: flex;
      align-items: center;
      height: 2.125rem;
      font-size: 12px;
      color: #121212;
      padding-left: 0.188rem;
      border-bottom: 0.031rem solid #eeeeee;
      span {
        margin-left: 0.563rem;
        font-size: 12px;
        color: #f05152;
      }
    }
    .clerk {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      .face {
        width: 2.188rem;
        height: 2.188rem;
        img {
          width: 2.188rem;
          height: 2.188rem;
          border-radius: 50%;
        }
      }
      .clerk-info {
        flex: 1;
        text-align: left;
        padding-left: 0.469rem;
        .clerk-status {
          font-size: 14px;
          color: #121212;
        }
        .clerk-distance {
          font-size: 20px;
          color: #8e8e8e;
        }
      }
      .call-icon {
        color: #f05152;
      }
    }
  }
  .details {
    padding: 0.6rem 0.938rem;
    margin-top: 0.625rem;
    text-align: left;
    background-color: #ffffff;
    box-shadow: 0rem 0.344rem 0.969rem 0.031rem rgba(136, 136, 136, 0.18);
    border-radius: 0.313rem;
    .details-item {
      display: flex;
      align-items: center;
      padding: 0.625rem 0;
      color: #737373;
      .icon {
        width: 0.625rem;
        height: 0.625rem;

        border: solid 0.031rem #939393;
        border-radius: 50%;
      }
      .desc_text {
        flex: 1;
        padding-left: 0.594rem;
        font-size: 12px;
      }
      .time {
        font-size: 11px;
      }
      &.active {
        color: #333333;
        .icon {
          background-color: #f05152;
          border: none;
        }
      }
    }
    .hr {
      width: 0.063rem;
      height: 0.938rem;
      margin-left: 0.281rem;
      background-color: #cacaca;
    }
  }
}

.no-express {
  display: flex;
  align-items: center;
  padding-left: 0.938rem;
  width: 21.563rem;
  height: 4.438rem;
  margin: 0.625rem auto;
  background-color: #ffffff;
  border-radius: 0.313rem;
  .face {
    width: 2.188rem;
    height: 2.188rem;
    img {
      width: 2.188rem;
      height: 2.188rem;
      border-radius: 50%;
    }
  }
  .clerk-info {
    flex: 1;
    text-align: left;
    padding-left: 0.469rem;
    .clerk-status {
      font-size: 14px;
      color: #121212;
    }
    .clerk-distance {
      font-size: 10px;
      color: #8e8e8e;
    }
  }
}
</style>
