<!-- 新抽奖 我的抽奖 -->
<template>
  <div id="mydraw">
    <c-title :hide="false" text="我的抽奖"></c-title>
    <div class="member-info">{{ info.nickname }}</div>
    <div class="tabs-box">
      <img :src="info.avatar" alt="" class="member-img" />
      <div class="nav">
        <div class="child" @click.stop="gotoUrl('luckyDraw', { tag: 'my', index: 0 })">
          <div class="nav-btn">
            <i class="iconfont icon-leimupinleifenleileibie2"></i>
          </div>
          全部
        </div>
        <div class="child" @click.stop="gotoUrl('luckyDraw', { tag: 'my', index: 1 })">
          <div class="nav-btn" style="background: #ff9329;">
            <i class="iconfont icon-lishi" style="font-size: 22px;"></i>
          </div>
          进行中
        </div>
        <div class="child" @click.stop="gotoUrl('luckyDraw', { tag: 'my', index: 2 })">
          <div class="nav-btn" style="background: #2aa7fb;">
            <i class="iconfont icon-fontclass-dashang"></i>
          </div>
          已中奖
        </div>
        <div class="child" @click.stop="gotoUrl('luckyDraw', { tag: 'my', index: 3 })">
          <div class="nav-btn" style="background: #ac6fff;">
            <i class="iconfont icon-bc_like" style="font-size: 24px;"></i>
          </div>
          收藏
        </div>
        <div class="child" @click.stop="gotoUrl('luckyDraw', { tag: 'my', index: 4 })">
          <div class="nav-btn" style="background: #f55151;">
            <i class="iconfont icon-fontclass-pinglun1"></i>
          </div>
          评论
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-child" @click.stop="gotoUrl('newDrawMyPrize', {})">
        <i class="icon-fontclass-dashang iconfont" style="color: #fc1d47;"></i>
        <div class="list-name">我的奖品</div>
        <i class="iconfont icon-member_right"></i>
      </div>
      <div class="list-child" @click.stop="gotoUrl('newDrawRecommentReward', {})">
        <i class="icon-fontclass-tuijian1 iconfont" style="color: #ff7f1a;"></i>
        <div class="list-name">中奖推荐奖励</div>
        <i class="iconfont icon-member_right"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}
    };
  },

  // activated: {},

  components: {},

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    gotoUrl(_name, _params) {
      this.$router.push(this.fun.getUrl(_name, _params));
    },
    getData() {
      $http
        .get("plugin.luck-draw.frontend.index.myself", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#mydraw {
  background: #fff;

  .member-info {
    height: 9.375rem;
    background-color: #e74a45;
    color: #fff;
    padding-top: 1.5rem;
    font-size: 16px;
    font-weight: 700;
  }

  .tabs-box {
    width: 90%;
    background-color: #fff;
    box-shadow: 0 0.156rem 0.381rem 0.025rem rgba(222, 71, 66, 0.41);
    border-radius: 0.625rem;
    margin: -3rem auto 0;
    position: relative;

    .member-img {
      width: 4.063rem;
      height: 4.063rem;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #fff;
      position: absolute;
      top: -2rem;
      left: 50%;
      transform: translateX(-50%);
      object-fit: contain;
      background-color: #fac337;
      box-shadow: 0 0.25rem 0.313rem 0 rgba(232, 75, 69, 0.7);
    }

    .nav {
      display: flex;
      justify-content: space-around;
      padding: 3rem 0 1rem;

      .child {
        display: flex;
        flex-direction: column;
        font-size: 10px;

        .nav-btn {
          width: 2.188rem;
          height: 2.188rem;
          line-height: 2.188rem;
          color: #fff;
          background-color: #fac337;
          margin-bottom: 0.375rem;
          border-radius: 50%;

          i {
            font-size: 20px;
          }
        }
      }
    }
  }

  .list {
    padding: 0 0.875rem;
    margin-top: 1rem;

    .list-child {
      display: flex;
      height: 2.875rem;
      line-height: 2.875rem;

      i {
        font-size: 18px;
      }

      .list-name {
        padding: 0 0.5rem;
        flex: 1;
        text-align: left;
        color: #666;
      }
    }
  }
}
</style>
