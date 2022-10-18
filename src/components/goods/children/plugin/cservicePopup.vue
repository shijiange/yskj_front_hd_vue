<template>
  <div>
    <van-popup v-model="display" round position="center" style="width: 80%;">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cserviceUrl">
                <div class="image">
                  <img src="../../../../assets/images/kf_online_contect@2x.png" />
                </div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`">
                  <img src="../../../../assets/images/kf_tel_contect@2x.png" />
                </a>
              </div>
              <div>{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;" />
          </div>
        </div>
        <i class="iconfont icon-close11" @click="close"></i>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    cservice: {
      //客服
      type: String,
      default: ""
    },
    service_mobile: {
      type: String,
      default: ""
    },
    service_QRcode: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      display: false,
      cserviceUrl: "" //* 芸客服地址
    };
  },
  mounted() {
    this.cserviceUrl = this.cservice;
  },
  watch: {
    show(newV) {
      this.display = newV;
    },
    cservice(newV) {
      if (newV && newV.indexOf("chatWindow") >= 0) {
        this.cserviceUrl = newV + "&goods_id=" + this.$route.params.id;
      } else {
        this.cserviceUrl = newV;
      }
    }
  },
  methods: {
    close() {
      this.display = false;
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.pop-content {
  width: 100%;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}
</style>
