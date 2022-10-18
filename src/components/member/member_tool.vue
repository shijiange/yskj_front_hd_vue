<template>
  <div v-if="Order.part && Order.part.length > 0 || Order.more && Order.more.length > 0"
       id="tool"
       class="member-designer"
       :style="{
      backgroundColor: Params.toolbgcolor,
      backgroundImage:
        'url(' + (Params.toolbg == '2' ? Params.bgimg : '') + ')',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat'
    }">
    <div class="title"
         v-if="Params.toolstyle == 1">
      <div class="spare"></div>
      <h3 :style="{ color: Params.tooltitlecolor }">{{ Params.tooltitle }}</h3>
    </div>

    <ul class="tool-box"
        id="template02"
        v-if="Params.toolstyle == 1">
      <li v-for="(item,index) in Order.part" :key="index"
          v-show="Order.part && Order.part.length > 0 && notShow.indexOf(item.url)<0">
        <router-link :to="fun.getUrl(item.url)">
          <i class="iconfont"
             :class="item.class"></i>
          <div>{{ item.title }}</div>
        </router-link>
      </li>

      <li v-for="(item,index) in Order.more" :key="index"
          v-show="Order.more && Order.more.length > 0"
          @click="gotoUrl(item)">
        <img class="imgurl"
             :src="item.imgurl"
             alt="" />
        <div>{{ item.title }}</div>
      </li>

      <li v-if="fun.isApp()">
        <router-link :to="fun.getUrl('message', { selected: '1' })">
          <i class="iconfont icon-icon"></i>
          <div>消息通知</div>
        </router-link>
      </li>
    </ul>

    <template v-if="Params.toolstyle == 2">
      <van-collapse v-model="activeNames">
        <van-collapse-item name="1">
          <div slot="title"
               class="title"
               id="template">
            <div class="spare"></div>
            <h3 :style="{ color: Params.tooltitlecolor }">
              {{ Params.tooltitle }}
            </h3>
          </div>

          <div class="cart">
            <router-link v-if="fun.isApp()"
                         :to="fun.getUrl('message', { selected: '1' })">
              <div class="list1">
                <i slot="icon"
                         class="iconfont icon-icon"
                         style="margin-right: 0.375rem; font-size: 1.3rem; color: #f15353;"></i>
                <span slot="text">消息通知</span>
                <i class="fa fa-angle-right"></i>
              </div>
            </router-link>
            <template v-if="Order.part && Order.part.length > 0 && notShow.indexOf(item.url)<0"
                      v-for="(item,index) in Order.part">
              <div class="list1" :key="index"
                   @click="pluginGoto(item)">
                <i slot="icon"
						class="iconfont"
                         :class="item.class"
                         style="margin-right: 0.375rem; font-size: 1.3rem; color: #f15353;"></i>
                <span slot="text">{{ item.title }}</span>
                <i class="fa fa-angle-right"></i>
              </div>
            </template>
            <div class="list1"
                 v-show="Order.more && Order.more.length > 0"
                 v-for="(item,i) in Order.more"
                 :key='i'
                 @click="gotoUrl(item)">
              <i class="more-icon"
                 :class="item.icon"></i>
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
  props: ["member_item", "Order", "Params","notShow"],
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
        this.$router.push(this.fun.getUrl(item.url, { selected: "1" }));
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
  margin-right: 0.375rem;
  line-height: 2.8rem;
}

#template02 {
  .iconfont {
    display: inline-block;
    font-size: 1.75rem;
    color: rgb(241, 83, 83);
  }
  // 工具图标
  .icon-fontclass-1 {
    background: url("../../assets/images/member/tool_a(6).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-1::before {
    content: "";
  }

  .icon-fontclass-zuji2 {
    background: url("../../assets/images/member/tool_a(8).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-zuji2::before {
    content: "";
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

  .icon-fontclass-dizhi {
    background: url("../../assets/images/member/tool_a(1).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-dizhi::before {
    content: "";
  }

  .icon-fontclass-shezhi {
    background: url("../../assets/images/member/tool_a(5).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-shezhi::before {
    content: "";
  }

  .icon-fontclass-wangjimima2 {
    background: url("../../assets/images/member/member_a(124).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-wangjimima2::before {
    content: "";
  }

  .icon-icon {
    background: url("../../assets/images/member/tool_a(9).png") no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-icon::before {
    content: "";
  }

  .icon-shenghuojiaofei {
    background:
      url("../../assets/images/member/member_a(49).png") no-repeat
      center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-shenghuojiaofei::before {
    content: "";
  }

  .icon-yinhangqia {
    background:
      url("../../assets/images/member/tool_a(10).png") no-repeat
      center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-yinhangqia::before {
    content: "";
  }

  .icon-member_pospay_validation {
    background:
      url("../../assets/images/member/member_a(82).png") no-repeat
      center;
    background-size: 2.5rem;
  }

  .icon-member_pospay_validation::before {
    content: "";
  }

  .icon-fontclass-hangbanxinxi {
    background:
      url("../../assets/images/member/member_a(156).png") no-repeat
      center;
    background-size: 2.5rem;
  }

  .icon-fontclass-hangbanxinxi::before {
    content: "";
  }

  .icon-member_advertise_market {
    background:
      url("../../assets/images/member/member_a(84).png") no-repeat
      center;
    background-size: 2.5rem;
  }

  .icon-member_advertise_market::before {
    content: "";
  }

  .icon-member_posvip_cardnum {
    background:
      url("../../assets/images/member/member_a(83).png") no-repeat
      center;
    background-size: 2.5rem;
  }

  .icon-member_posvip_cardnum::before {
    content: "";
  }

  .icon-member_quickpay {
    background: url('../../assets/images/member/member_a(95).png') no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_quickpay::before {
    content: '';
  }

  .icon-member_massage_remind {
    background: url('../../assets/images/member/member_a(115).png') no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_massage_remind::before {
    content: '';
  }

  .icon-fontclass-yiingyongguanli {
    background: url('../../assets/images/member/member_a(131).png') no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-yiingyongguanli::before {
    content: '';
  }

  .icon-member_mycontract {
    background: url('../../assets/images/member/member_a(89).png') no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-member_mycontract::before {
    content: '';
  }

  .icon-fontclass-yibaodaifu {
    background: url('../../assets/images/member/member_a(161).png') no-repeat center;
    background-size: 1.75rem;
    width: 1.75rem;
    height: 1.75rem;
  }

  .icon-fontclass-yibaodaifu::before {
    content: '';
  }
}
</style>
