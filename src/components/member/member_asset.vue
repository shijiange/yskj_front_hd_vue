<template>
  <div
    v-if="(Order.part && Order.part.length > 0) || (Order.more && Order.more.length > 0)"
    id="templet_box"
    class="member-designer"
    :style="{
      backgroundColor: Params.assetbgcolor,
      backgroundImage: 'url(' + (Params.assetbg == '2' ? Params.bgimg : '') + ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <div class="extension_plate" v-if="Params.assetstyle == 1">
      <h1 :style="{ color: Params.assettitlecolor }">
        <div class="spare"></div>
        {{ Params.assettitle }}
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

    <template v-if="Params.assetstyle == 2">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title" class="title">
            <div class="spare"></div>
            <h3 :style="{ color: Params.assettitlecolor }">
              {{ Params.assettitle }}
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
  font-size: 1.625rem;
  color: rgb(241, 83, 83);
  margin-right: 0.375rem;
  line-height: 2.5rem;
}

#template02 {
  .iconfont {
    display: inline-block;
    font-size: 1.75rem;
    color: rgb(241, 83, 83);
  }

  .icon-member_integral {
    background: url("../../assets/images/member/member_a(55).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_integral::before {
    content: "";
  }

  .icon-member-credit01 {
    background: url("../../assets/images/member/member_a(44).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-credit01::before {
    content: "";
  }

  .icon-number_assets {
    background: url("../../assets/images/member/member_a(69).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-number_assets::before {
    content: "";
  }

  .icon-member-exchange1 {
    background: url("../../assets/images/member/member_a(1).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-exchange1::before {
    content: "";
  }

  .icon-member-currency1 {
    background: url("../../assets/images/member/member_a(14).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-currency1::before {
    content: "";
  }

  .icon-member-frozen1 {
    background: url("../../assets/images/member/member_a(7).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-frozen1::before {
    content: "";
  }

  .icon-member-extension1 {
    background: url("../../assets/images/member/member_a(38).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member-extension1::before {
    content: "";
  }

  .icon-member_buygroup_orderlist {
    background: url("../../assets/images/member/member_a(118).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_buygroup_orderlist::before {
    content: "";
  }

  .icon-fontclass-xingpinle {
    background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/member/member_a(133).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-xingpinle::before {
    content: "";
  }

  .icon-member_my_buy {
    background: url("../../assets/images/member/member_a(119).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_my_buy::before {
    content: "";
  }

  .icon-member_reward_ranking {
    background: url("../../assets/images/member/member_a(116).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_reward_ranking::before {
    content: "";
  }
}
</style>
