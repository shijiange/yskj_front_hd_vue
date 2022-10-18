<template>
  <div class="history-box">
    <div class="containe">
      <div class="left-text">
        <p class="count">{{countText}}<span class="total"></span></p>
        <p class="total">{{totalText}}</p>
      </div>

      <img class="money-img" src="../../../assets/images/goods/group_money@2x.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: ['countText', 'totalText'],
  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.history-box {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.875rem;

  .containe {
    background-image: linear-gradient(90deg, #fff6e2 0%, #fffae2 100%), linear-gradient(#fffae2, #fffae2);
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    color: #ec6565;
    text-align: left;

    .count {
      font-weight: bolder;
      font-size: 1rem;
    }

    .total {
      margin-top: 0.5rem;
      font-size: 0.8rem;
    }

    .num {
      color: #ff7100;
    }
  }

  .money-img {
    width: 4.19rem;
    height: 3.03rem;
    margin: 0;
  }
}
</style>
