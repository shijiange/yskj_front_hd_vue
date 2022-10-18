<!-- 自提点列表样式 -->
<template>
  <div id="selfPickupPointChild">
    <div class="selfPickupPoint-cell" :class="{ 'Selected-box': selected }">
      <div class="cell-top flex-center">
        <div class="cell-top-l flex-center">
          <i class="iconfont icon-fontclass-dianpu"></i>
          <div class="name">{{ datas.deliver_name }}</div>
        </div>
        <div class="status" @click.stop="chooseDeliver(datas.id)" :class="{ 'Selected-status': !selected }">{{ !selected ? "选它" : `当前${pluginName}` }}</div>
      </div>

      <div class="cell-main flex-center">
        <div class="cell-main-l flex-center">
          <div class="phone">联系电话：{{ datas.deliver_mobile || "---" }}</div>
          <div class="address">
            {{ datas.distance }}{{ datas.unit }}
            <div class="line" style="margin: 0 0.25rem;"></div>
            <div class="address-text">{{ datas.full_address || "---" }}</div>
          </div>
        </div>
        <div class="cell-main-r flex-center">
          <div class="round" @click.stop="goToAdress">
            <i class="iconfont icon-supplier_release"></i>
          </div>
          <div class="line" style="margin: 0 0.5rem;"></div>
          <div class="round" style="background-color: #f15353;">
            <a @click.stop :href="`tel:${datas.deliver_mobile}`" style="">
              <i class="iconfont icon-hujiaokefu"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      type: Boolean,
      default: false
    },
    datas: {
      type: Object,
      default: () => {}
    },
    pluginName: {
      type: String,
      default: "自提点"
    }
  },
  data() {
    return {};
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    chooseDeliver(_id) {
      this.$emit("chooseDeliver", _id);
    },
    //跳转地址
    goToAdress() {
      let point = this.fun.bd_decrypt(this.datas.lng, this.datas.lat);
      this.fun.goToWXAdress(point, this.datas.deliver_name, this.datas.full_address);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#selfPickupPointChild {
  padding: 0.875rem 0.875rem 0;

  .selfPickupPoint-cell {
    background: #fff;
    border-radius: 0.375rem;
    padding: 0 0.875rem;
    overflow: hidden;
    border: 1px solid #fff;

    .cell-top {
      width: 100%;
      justify-content: space-between;
      height: 2.5rem;
      border-bottom: 1px solid #f2f2f2;

      .cell-top-l {
        width: 50%;
      }

      .icon-fontclass-dianpu {
        font-size: 20px;
      }

      .name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
      }

      .status {
        color: #f15353;
      }

      .Selected-status {
        background: #f15353;
        color: #fff;
        border-radius: 0.625rem;
        width: 3.125rem;
        height: 1.25rem;
        line-height: 1.25rem;
      }
    }

    .cell-main {
      justify-content: space-between;
      padding: 0.875rem 0;

      .cell-main-l {
        flex: 1;
        margin-right: 2rem;
        align-items: flex-start;
        text-align: left;
        flex-direction: column;

        .address {
          display: flex;
          align-items: baseline;
          color: #929292;
          margin-top: 0.25rem;

          .address-text {
            line-height: 1.25rem;
          }
        }
      }

      .cell-main-r {
        .round {
          width: 1.25rem;
          height: 1.25rem;
          line-height: 1.25rem;
          color: #fff;
          text-align: center;
          background-color: #4a9cff;
          border-radius: 50%;

          i {
            font-size: 12px;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 10px;
      background: #f2f2f2;
    }
  }

  .flex-center {
    display: flex;
    align-items: center;
  }

  .Selected-box {
    border: 1px solid #ffa0a0;
  }
}
</style>
