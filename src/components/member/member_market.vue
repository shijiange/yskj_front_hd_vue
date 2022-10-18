<template>
  <div
    v-if="(Order.part && Order.part.length > 0) || (Order.more && Order.more.length > 0)"
    id="templet_box"
    class="member-designer"
    :style="{
      backgroundColor: Params.marketbgcolor,
      backgroundImage: 'url(' + (Params.marketbg == '2' ? Params.bgimg : '') + ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="extension_plate" v-if="Params.marketstyle == 1">
      <h1 :style="{ color: Params.markettitlecolor }">
        <div class="spare"></div>
        {{ Params.markettitle }}
      </h1>
      <ul class="box" id="template02">
        <!--<li v-if="relation_switch" @click="openQrCode('block')">-->
        <!--<i class="iconfont icon-erweima" style="width: 1.7rem;"></i>-->
        <!--<span>二维码</span>-->
        <!--</li>-->

        <!--<li>-->
        <!--<router-link :to="fun.getUrl('myEvaluation', { selected: '1' })">-->
        <!--<i class="iconfont icon-pinglun" style="width: 1.7rem;"></i>-->
        <!--<span>评论</span>-->
        <!--</router-link>-->
        <!--</li>-->
        <!--<li>-->
        <!--<router-link :to="fun.getUrl('myRelationship', { selected: '1' })">-->
        <!--<i class="iconfont icon-guanxi" style="width: 1.7rem;"></i>-->
        <!--<span>客户</span>-->
        <!--</router-link>-->
        <!--</li>-->
        <!--<li>-->
        <!--<router-link :to="fun.getUrl('coupon', { selected: '1' })">-->
        <!--<i class="iconfont icon-youhuiquan1" style="width: 1.7rem;"></i>-->
        <!--<span>优惠券</span>-->
        <!--</router-link>-->
        <!--</li>-->

        <template v-if="Order.part && Order.part.length > 0 && notShow.indexOf(item.url) < 0" v-for="(item, index) in Order.part">
          <li @click="pluginGoto(item)" :key="index">
            <i class="iconfont" :class="item.class"></i>
            <span>{{ item.title }}</span>
          </li>
        </template>
        <li v-for="(item, i) in Order.more" :key="i" v-show="Order.more && Order.more.length > 0" @click="gotoUrl(item)">
          <img class="imgurl" :src="item.imgurl" alt="" />
          <span>{{ item.title }}</span>
        </li>
      </ul>
    </div>

    <template v-if="Params.marketstyle == 2">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title" class="title">
            <div class="spare"></div>
            <h3 :style="{ color: Params.markettitlecolor }">
              {{ Params.markettitle }}
            </h3>
          </div>

          <div class="cart">
            <template v-if="Order.part && Order.part.length > 0 && notShow.indexOf(item.url) < 0" v-for="(item, index) in Order.part">
              <div class="list1" @click="pluginGoto(item)" :key="index">
                <i slot="icon" class="iconfont" :class="item.class" style="margin-right: 0.375rem; font-size: 1.625rem; color: #f15353;"></i>
                <span slot="text">{{ item.title }}</span>
                <i class="fa fa-angle-right"></i>
              </div>
            </template>
            <div class="list1" v-show="Order.more && Order.more.length > 0" v-for="(item, i) in Order.more" :key="i" @click="gotoUrl(item)">
              <i class="more-icon" :class="item.icon"></i>
              <span slot="text">{{ item.title }}</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>
    </template>
  </div>
</template>

<script>
// import { Toast } from 'vant';
export default {
  props: ["Order", "Params", "notShow"],
  data() {
    return {
      activeNames: ["1"]
    };
  },
  methods: {
    gotoUrl(item) {
      if (item.hrefurl) {
        window.location.href = item.hrefurl;
      }
    },
    pluginGoto(item) {
      if (item.name == "article") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            id: "0"
          })
        );
      } else if (item.name == "courier") {
        window.localStorage.setItem("couriername", item.title);
        this.$router.push(this.fun.getUrl(item.url));
      } else if (item.name == "supplier") {
        this.$router.push(
          this.fun.getUrl(item.url, {
            uid: this.member_item.uid
          })
        );
      } else if (item.name == "m-erweima") {
        this.openQrCode("block");
      } else if (item.name == "qq-advertise") {
        //跳转客户app观看广告
        this.gotoAppRevardVideo(item);
      } else {
        this.$router.push(this.fun.getUrl(item.url, { selected: "1" }));
      }
    },
    gotoAppRevardVideo(_data) {
      //看广告视频方案：点击入口按钮，跳转到原生APP里看视频广告。
      //传参：会员ID和会员的token
      let _uid = window.localStorage.getItem("uid") || "0";
      let _token = _data.member_token || "0";
      if (this.fun.getPhoneEnv() == "1") {
        // 调用IOS方法
        let _iosUid = "uid=" + _uid;
        let _iosToken = "token=" + _token;
        window.webkit.messageHandlers.revardVideo.postMessage(_iosUid, _iosToken);
      } else if (this.fun.getPhoneEnv() == "2") {
        //  调用安卓方法
        revardVideo.revardVideoClick(_uid, _token);
      }
    },
    openQrCode(e) {
      this.$emit("openQrCode", e);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tool-box {
  display: -webkit-box;
  display: -webkit-flex;
}

.more-icon {
  font-size: 1.3rem;
  color: rgb(241, 83, 83);
  margin-left: 0.1rem;
  margin-right: 0.375rem;
  line-height: 2.5rem;
}

#template02 {
  .iconfont {
    display: inline-block;
    font-size: 1.75rem;
    color: rgb(241, 83, 83);
  }

  .icon-member-bank-list1 {
    background: url("../../assets/images/member/member_a(29).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-bank-list1::before {
    content: "";
  }

  .icon-member-collect1 {
    background: url("../../assets/images/member/member_a(41).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-collect1::before {
    content: "";
  }

  .icon-member-get-up {
    background: url("../../assets/images/member/member_a(47).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-get-up::before {
    content: "";
  }

  .icon-member-act-signup1 {
    background: url("../../assets/images/member/member_a(15).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-act-signup1::before {
    content: "";
  }

  .icon-member-course3 {
    background: url("../../assets/images/member/member_a(22).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-course3::before {
    content: "";
  }

  .icon-member_goods {
    background: url("../../assets/images/member/member_a(52).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_goods::before {
    content: "";
  }

  .icon-card {
    background: url("../../assets/images/member/member_a(57).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-card::before {
    content: "";
  }

  .icon-fontclass-shouquanma-01 {
    background: url("../../assets/images/member/member_a(148).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-shouquanma-01::before {
    content: "";
  }

  .icon-member-recharge1 {
    background: url("../../assets/images/member/member_a(3).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-recharge1::before {
    content: "";
  }

  .icon-member_my-friend {
    background: url("../../assets/images/member/member_a(63).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_my-friend::before {
    content: "";
  }

  .icon-member_card1 {
    background: url("../../assets/images/member/member_a(58).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_card1::before {
    content: "";
  }

  .icon-fontclass-tuoke {
    background: url("../../assets/images/member/member_a(136).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-tuoke::before {
    content: "";
  }

  .icon-extension_goods_order {
    background: url("../../assets/images/member/member_a(59).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-extension_goods_order::before {
    content: "";
  }

  .icon-member_my-card {
    background: url("../../assets/images/member/member_a(64).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_my-card::before {
    content: "";
  }

  .icon-member_material {
    background: url("../../assets/images/member/member_a(65).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_material::before {
    content: "";
  }

  .icon-member-help {
    background: url("../../assets/images/member/member_a(2).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-help::before {
    content: "";
  }

  .icon-member-clock1 {
    background: url("../../assets/images/member/member_a(30).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-clock1::before {
    content: "";
  }

  .icon-member-express-list {
    background: url("../../assets/images/member/member_a(68).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-express-list::before {
    content: "";
  }

  .icon-declaration_system {
    background: url("../../assets/images/member/member_a(66).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-declaration_system::before {
    content: "";
  }

  .icon-order_system {
    background: url("../../assets/images/member/member_a(70).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-order_system::before {
    content: "";
  }

  .icon-erweima {
    background: url("../../assets/images/member/tool_a(2).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-erweima {
    background: url("../../assets/images/member/tool_a(2).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-erweima::before {
    content: "";
  }

  .icon-pinglun {
    background: url("../../assets/images/member/tool_a(4).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-erweima::before {
    content: "";
  }

  .icon-fontclass-pinglun {
    background: url("../../assets/images/member/tool_a(4).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-pinglun::before {
    content: "";
  }

  .icon-youhuiquan1 {
    background: url("../../assets/images/member/tool_a(7).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-pinglun::before {
    content: "";
  }

  .icon-fontclass-youhuiquan {
    background: url("../../assets/images/member/tool_a(7).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-youhuiquan1::before {
    content: "";
  }

  .icon-fontclass-youhuiquan::before {
    content: "";
  }

  .icon-member_mygroup {
    background: url("../../assets/images/member/member_a(72).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_mygroup::before {
    content: "";
  }

  .icon-extension_video {
    background: url("../../assets/images/member/member_a(73).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-extension_video::before {
    content: "";
  }

  .icon-member_changer_centre {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(60).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_changer_centre::before {
    content: "";
  }

  .icon-member_live_normal {
    background: url("../../assets/images/member/member_a(92).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_live_normal::before {
    content: "";
  }

  .icon-member_community {
    background: url("../../assets/images/member/member_a(74).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_community::before {
    content: "";
  }

  .icon-member_advertise_market {
    background: url("../../assets/images/member/member_a(84).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_advertise_market::before {
    content: "";
  }

  .icon-member_bonus_pools {
    background: url("../../assets/images/member/member_a(81).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_bonus_pools::before {
    content: "";
  }

  .icon-member_ejiayou {
    background: url("../../assets/images/member/member_a(103).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_ejiayou::before {
    content: "";
  }

  .icon-member_bonus_pools::before {
    content: "";
  }

  .icon-member_area_search {
    background: url("../../assets/images/member/member_a(121).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_area_search::before {
    content: "";
  }

  .icon-member_mygroupbuy {
    background: url("../../assets/images/member/member_a(122).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_mygroupbuy::before {
    content: "";
  }

  .icon-member_questionsurvey {
    background: url("../../assets/images/member/member_a(111).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_questionsurvey::before {
    content: "";
  }

  .icon-member_groupbuy {
    background: url("../../assets/images/member/member_a(123).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_groupbuy::before {
    content: "";
  }

  .icon-fontclass-tuanduifenxiaoshang {
    background: url("../../assets/images/member/member_a(126).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-kehu {
    background: url("../../assets/images/member/tool_a(3).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-kehu::before {
    content: "";
  }

  .icon-fontclass-tuanduifenxiaoshang::before {
    content: "";
  }

  .icon-fontclass-tihuoka {
    background: url("../../assets/images/member/member_a(127).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-tihuoka::before {
    content: "";
  }

  .icon-fontclass-anliku {
    background: url("../../assets/images/member/member_a(132).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-anliku::before {
    content: "";
  }

  .icon-fontclass-waikan {
    background: url("../../assets/images/member/member_a(153).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-waikan::before {
    content: "";
  }

  .icon-member_installserver {
    background: url("../../assets/images/member/member_a(114).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_installserver::before {
    content: "";
  }

  .icon-fontclass-shengjima {
    background: url("../../assets/images/member/member_a(141).jpeg") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-shengjima::before {
    content: "";
  }

  .icon-fontclass-lingshou {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member_a(152).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-xinyongzhi {
    background: url("../../assets/images/member/member_a(159).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-lingshou::before {
    content: "";
  }

  .icon-fontclass-miandan {
    background: url("../../assets/images/member/member_a(165).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-miandan::before {
    content: "";
  }

  .icon-fontclass-xinyongzhi::before {
    content: "";
  }

  .icon-fontclass-mendianhexiao {
    background: url("../../assets/images/member/member_a(162).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-mendianhexiao::before {
    content: "";
  }

  .icon-fontclass-xinyongzhi::before {
    content: "";
  }

  .icon-fontclass-quan {
    background: url("../../assets/images/member/member_a(170).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-quan::before {
    content: "";
  }
}
</style>
