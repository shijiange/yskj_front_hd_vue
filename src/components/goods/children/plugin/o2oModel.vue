<!--
  门店信息模块
  插件：门店拼团 -->
<template>
  <div>
    <div id="store-position">
      <div class="store-box" @click="gotoList">
        <div class="store-name">
          <i class="iconfont icon-dianpu"></i><span>{{ storeName }}</span>
        </div>
        <div style="color: #8c8c8c;" class="flexName">进入门店</div>
      </div>
      <div class="contact-box">
        <div class="contact">
          <a :href="'tel:' + mobile"><i class="iconfont icon-dianhua1"></i><span>联系商家</span></a>
        </div>
        <div style="cursor: pointer;">
          <a @click="showCustomer"> <i class="iconfont icon-service_shop"></i> <span>客服</span></a>
        </div>
        <div class="position" @click="goToAdress">
          <i class="iconfont icon-dingwei"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    storeName: {
      type: String,
      default: ""
    },
    mobile: {
      type: String,
      default: ""
    },
    storeId: {
      type: [String, Number],
      default: 0
    },
    longitude: {
      type: [String, Number],
      default: 0
    },
    latitude: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {};
  },

  // activated: {},

  components: {},

  computed: {},

  methods: {
    gotoList() {
      this.$router.push(
        this.fun.getUrl("o2oStore_v2", {
          store_id: this.storeId
        })
      );
    },
    goToAdress() {
      let point = this.fun.bd_decrypt(this.longitude, this.latitude);
      this.fun.goToWXAdress(point, this.storeName, "详细地址");
    },
    showCustomer() {
      this.$emit("showCustomer");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#store-position {
  .contact-box {
    .position {
      .iconfont {
        font-size: 20px;
        padding-left: 10px;
        border-left: solid 1px #ebebeb;
      }
    }
  }
}

#store-position {
  margin-top: 0.625rem;
  font-size: 14px;
  background: #fff;

  .store-box {
    display: flex;
    justify-content: space-between;
    height: 2.5rem;
    line-height: 2.5rem;
    border-bottom: solid 0.0625rem #e8e8e8;
    margin-left: 0.875rem;
    padding-right: 0.875rem;

    .store-name {
      i {
        color: #999;
        margin-right: 0.375rem;
      }
    }

    .flexName {
      flex: 1;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
      text-align: right;
      padding-left: 0.875rem;
    }
  }

  .contact-box {
    background: #fff;
    height: 2.5rem;
    line-height: 2.5rem;
    display: flex;
    justify-content: space-between;
    margin-left: 0.875rem;
    padding-right: 0.875rem;

    .contact {
      i {
        margin-right: 0.375rem;
        color: #999;
      }
    }

    .position {
      i {
        color: #999;
      }
    }
  }
}
</style>
