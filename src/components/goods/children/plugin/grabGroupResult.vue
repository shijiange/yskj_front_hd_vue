<!-- 玩法介绍 步骤条组件 -->
<template>
  <div class="container">
    <div class="stepItem">
      <div class="img"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/grab_group_result1.png" alt="" /></div>
      <div class="text">参与抢团</div>
      <div class="text">
        <span class="red" v-if="goods_info.goods">{{ goods_info.goods.limit_num }}</span
        >人成团
      </div>
    </div>
    <div class="block">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="stepItem">
      <div class="img"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/grab_group_result2.png" alt="" /></div>
      <div class="text">
        <span class="red" v-if="goods_info.goods"> {{ goods_info.goods.limit_num - 1 }}</span
        >人未中退款
      </div>
      <div class="text"><span class="red">1</span>人拼中发货</div>
    </div>
    <div class="block">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="stepItem">
      <div class="img"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/grab_group_result3.png" alt="" /></div>
      <div class="text c1">未拼中获得奖励</div>
      <div class="text c2">
        <span class="red" v-if="goods_info.goods"> {{ goods_info.goods.transport_reward }}</span
        >红包
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },

  // activated: {},

  components: {},

  computed: {},

  mounted() {
    console.log(this.goods_info);
  },

  methods: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 5.969rem;
  margin-top: 0.625rem;
  background-color: #fff;

  .stepItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .img {
      width: 2.25rem;
      height: 2.25rem;

      img {
        width: 2.25rem;
        height: 2.25rem;
      }
    }

    .text {
      font-size: 0.688rem;
      color: #424141;
    }

    .red {
      color: #ff4848;
    }

    .c1 {
      margin-top: 0.4rem;
    }

    .c2 {
      margin-top: 0.2rem;
    }
  }

  .block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1.2rem;

    div {
      width: 0.156rem;
      height: 0.156rem;
      background-color: #b0b0b0;
      border-radius: 50%;
    }
  }
}
</style>
