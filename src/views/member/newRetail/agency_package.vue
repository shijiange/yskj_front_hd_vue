<!-- 代理套餐 -->
<template>
  <div id="newRetail-agency_package">
    <c-title :hide="false" text="代理套餐"></c-title>
    <div class="main">
      <div class="ewm-bg">
        <img class="img-box" :src="info.url" alt="" />
      </div>
      <div class="main-other">
        <div class="main-text">
          套餐：
          <div class="member-grade">{{ info.level_name }}</div>
        </div>
        <div class="main-text" style="padding-top: 12px;">金额：{{ $i18n.t("money") }}{{ info.money }}</div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn-child" @click.stop="ImgPreview">保存二维码</div>
      <div class="btn-child red-color" @click.stop="showWechatshar = true">分享好友</div>
    </div>
    <div class="remaining-time" v-if="info.remaining_time">等待支付，剩余时间<van-count-down :time="fun.getTimeDifference(info.remaining_time)" /></div>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import yzWechatShareImg from "components/ui_components/yz_wechatShareImg";
import { Toast, ImagePreview } from "vant";
export default {
  data() {
    return {
      info: {},
      showWechatshar: false,
      nowTimes: Date.parse(new Date())
    };
  },
  activated() {
    this.getData();
  },
  components: { yzWechatShareImg },
  methods: {
    getData() {
      let that = this;
      $http
        .get("plugin.new-retail.frontend.index.getSalesRecord", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.fun.wxShare(
              "",
              {},
              {
                title: this.info.goods[0].goods_title,
                imgUrl: this.info.goods[0].goods_thumb,
                link:
                  that.fun.getSiteRoot() +
                  "/addons/yun_shop/?menu#/goodsorder?i=" +
                  that.fun.getKeyByI() +
                  "&mid=" +
                  that.fun.getKeyByMid() +
                  "&sales_id=" +
                  that.info.id +
                  "&retail_state=5&orderType=newRetail&tag=-2&NRLevelId=" +
                  that.info.level_id
              }
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    ImgPreview() {
      ImagePreview([this.info.url]);
      Toast("请长按进行保存！");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-agency_package {
  .main {
    border-radius: 0.625rem;
    overflow: hidden;
    width: 90%;
    margin: 0.875rem auto;

    .ewm-bg {
      width: 100%;
      display: block;
      background-color: #f14e4e;
      padding: 2.25rem 0;

      .img-box {
        background:
          linear-gradient(#fff, #fff) left top,
          linear-gradient(#fff, #fff) left top,
          linear-gradient(#fff, #fff) right top,
          linear-gradient(#fff, #fff) right top,
          linear-gradient(#fff, #fff) right bottom,
          linear-gradient(#fff, #fff) right bottom,
          linear-gradient(#fff, #fff) left bottom,
          linear-gradient(#fff, #fff) left bottom;
        background-repeat: no-repeat;
        background-size: 2px 20px, 20px 2px;
        width: 10.563rem;
        height: 10.563rem;
        padding: 0.5rem;
      }
    }

    .main-other {
      background: #fff;
      padding: 1.375rem;
      font-size: 1.125rem;

      .main-text {
        display: flex;
        align-items: center;

        .member-grade {
          height: 1.563rem;
          border-radius: 0.125rem;
          border: solid 0.031rem #f14e4e;
          line-height: 1.563rem;
          color: #f14e4e;
          font-size: 0.938rem;
          padding: 0 0.625rem;
        }
      }
    }
  }

  .remaining-time {
    display: flex;
    width: 90%;
    margin: 0.75rem auto 0;
  }

  .btn-box {
    display: flex;
    justify-content: space-around;

    .btn-child {
      width: 8.75rem;
      height: 2.188rem;
      line-height: 2.188rem;
      border-radius: 0.313rem;
      border: solid 0.063rem #f14e4e;
      font-size: 16px;
      color: #f14e4e;
    }

    .red-color {
      background: #f14e4e;
      color: #fff;
    }
  }
}
</style>
