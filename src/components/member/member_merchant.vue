<template>
  <div
    v-if="(Order.part && Order.part.length > 0) || (Order.more && Order.more.length > 0)"
    id="templet_box"
    class="member-designer"
    :style="{
      backgroundColor: Params.merchantbgcolor,
      backgroundImage: 'url(' + (Params.merchantbg == '2' ? Params.bgimg : '') + ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="extension_plate" v-if="Params.merchantstyle == 1">
      <h1 :style="{ color: Params.merchanttitlecolor }">
        <div class="spare"></div>
        {{ Params.merchanttitle }}
      </h1>
      <ul class="box" id="template02">
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

    <template v-if="Params.merchantstyle == 2">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1" v-if="Order.part && Order.part.length > 0">
          <div slot="title" class="title">
            <div class="spare"></div>
            <h3 :style="{ color: Params.merchanttitlecolor }">
              {{ Params.merchanttitle }}
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
            <div :key="i" class="list1" v-show="Order.more && Order.more.length > 0" v-for="(item, i) in Order.more" @click="gotoUrl(item)">
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
export default {
  props: ["Order", "Params", "member_item", "notShow"],
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
      } else {
        this.$router.push(this.fun.getUrl(item.url));
      }
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
  line-height: 2.75rem;
}

#template02 {
  .iconfont {
    display: inline-block;
    font-size: 1.75rem;
    color: rgb(241, 83, 83);
  }

  .icon-member-apply1 {
    background: url("../../assets/images/member/member_a(9).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-apply1::before {
    content: "";
  }

  .icon-member-supplier {
    background: url("../../assets/images/member/member_a(53).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-supplier::before {
    content: "";
  }

  .icon-fontclass-cefu {
    background: url("../../assets/images/member/member_a(129).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-cefu::before {
    content: "";
  }

  .icon-fontclass-shipindati {
    background: url("../../assets/images/member/member_a(135).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-shipindati::before {
    content: "";
  }

  .icon-fontclass-manghe {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(139).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-manghe::before {
    content: "";
  }

  .icon-fontclass-zitidian {
    background: url("../../assets/images/member/member_a(130).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-zitidian::before {
    content: "";
  }

  .icon-fontclass-xiaoshoubaobiao {
    background: url("../../assets/images/member/member_a(128).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-xiaoshoubaobiao::before {
    content: "";
  }

  .icon-member-replenishment {
    background: url("../../assets/images/member/member_a(67).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-replenishment::before {
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

  .icon-member_hotel {
    background: url("../../assets/images/member/member_a(56).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_hotel::before {
    content: "";
  }

  .icon-member-hotel-apply {
    width: 1.75rem;
    height: 1.75rem;
    margin-bottom: 0.165em;
  }

  .icon-member-store-apply1 {
    background: url("../../assets/images/member/member_a(27).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-store-apply1::before {
    content: "";
  }

  .icon-member_store {
    background: url("../../assets/images/member/member_a(26).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_store::before {
    content: "";
  }

  .icon-member-cashier {
    background: url("../../assets/images/member/member_a(34).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-cashier::before {
    content: "";
  }

  .icon-fontclass-quntuoke {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(158).png") no-repeat center;
    background-size: 28px;
    width: 100%;
    margin-bottom: 4px;
  }

  .icon-fontclass-quntuoke::before {
    content: "";
  }

  .icon-member-mendian1 {
    background: url("../../assets/images/member/member_a(40).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-mendian1::before {
    content: "";
  }

  .icon-delivery_order {
    width: 1.75rem;
    height: 1.75rem;
    margin-bottom: 0.11em;
  }

  .icon-service_station {
    width: 1.75rem;
    height: 1.75rem;
    margin-bottom: 0.11em;
  }

  .icon-member_voice_center {
    background: url("../../assets/images/member/member_a(75).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_voice_center::before {
    content: "";
  }

  .icon-member_installment_buycar {
    background: url("../../assets/images/member/member_a(80).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_installment_buycar::before {
    content: "";
  }

  .icon-member_place_apply {
    background: url("../../assets/images/member/member_a(77).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_place_apply::before {
    content: "";
  }

  .icon-member_auctionofficer_apply {
    background: url("../../assets/images/member/member_a(96).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_auctionofficer_apply::before {
    content: "";
  }

  .icon-fontclass-anzhuangfuwuhy {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(144).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-anzhuangfuwuhy::before {
    content: "";
  }

  .icon-fontclass-anzhuangshifu1 {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(145).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-anzhuangshifu1::before {
    content: "";
  }

  .icon-member_auctionofficer_admin {
    background: url("../../assets/images/member/member_a(97).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_auctionofficer_admin::before {
    content: "";
  }

  .icon-member_auctionofficer_index {
    background: url("../../assets/images/member/member_a(98).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_auctionofficer_index::before {
    content: "";
  }

  .icon-member_branch {
    background: url("../../assets/images/member/member_a(101).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_branch::before {
    content: "";
  }

  .icon-member_host_application {
    background: url("../../assets/images/member/member_a(91).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_host_application::before {
    content: "";
  }

  .icon-member_meeting_active {
    background: url("../../assets/images/member/member_a(88).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_meeting_active::before {
    content: "";
  }
}
</style>
