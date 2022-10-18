<!--  -->
<template>
  <div style="">
    <!-- 酒店模块 -->
    <div class="act-box" v-if="goods_type == 'hotelGoods'">
      <ul class="fee">
        <li>
          <span><i class="iconfont icon-service_l"></i></span>
        </li>
        <li style="margin-left: 0.5rem; color: #000;">
          <span>{{ hotel_info.hotel_name }}</span>
        </li>
      </ul>
      <ul class="fee">
        <li>
          <span><i class="iconfont icon-service_m"></i></span>
        </li>
        <li style="margin-left: 0.5rem; color: #000;">
          <span
            ><a :href="'tel:' + hotel_info.hotel_mobile" style="color: #000;">联系{{ PageNameList.hotels }}:{{ hotel_info.hotel_mobile }}</a></span
          >
        </li>
      </ul>
    </div>
    <!-- 酒店模块 end-->

    <div  v-else>

      <div class="good-item-box" v-if="hasActivity || goods_plugin.fee || (prdocut_market.plugin && prdocut_market.plugin.length > 0) || goods_plugin.selfbuy_discount || activitySwitch || (goods_plugin.label && goods_plugin.label.length > 0)">
        <div class="goods-additional-info">
          <!-- 一口价 -->
          <div class="collect-order" v-if="hasActivity" @click="toFixedPrice()">
            <div class="goods-additional-text">凑单</div>
            <div class="goods-additional-content">{{ pack_price }}元任选{{ goods_count }}件</div>
            <div class="goods-additional-button">去凑单</div>
            <i class="iconfont icon-advertise-next iconfont-button"></i>
          </div>
          <!-- 一口价end -->

          <div class="collect-order" v-if="goods_plugin.fee">
            <div class="goods-additional-text goods-additional-text_diy">{{ goods_plugin.fee.name }}</div>
            <div class="goods-additional-content">{{ $i18n.t("money") }}{{ goods_plugin.fee.money }}</div>
          </div>

          <!--应用市场-->
          <div class="collect-order" @click="PopupShow = true" v-if="prdocut_market.plugin && prdocut_market.plugin.length > 0">
            <div class="goods-additional-text">应用</div>
            <div class="goods-additional-content">{{ prdocut_market.apps }}</div>
            <div class="goods-additional-button">插件</div>
            <i class="iconfont icon-advertise-next iconfont-button"></i>
          </div>
          <div class="service-box" v-if="prdocut_market.is_show==1">赠送售后服务时长 <span style="color: red; margin-left: 0.4rem;">{{prdocut_market.service_time}}天</span>
            <span style="font-size: 12px;">（剩余售后服务时长730天封顶，大于则不再增加）</span>
          </div>

          <!-- 自购省 -->
          <div class="selfbuy-discount" @click="gotohuiyuan" v-if="goods_plugin.selfbuy_discount">
            <div class="goods-additional-text">自省购</div>
            <div class="selfbuy-discount-items">
              <div class="goods-additional-content overflow" v-if="goods_plugin.selfbuy_discount.this_level_discount_price.show == 1">{{ goods_plugin.selfbuy_discount.this_level_discount_price.content }}</div>
              <div class="goods-additional-content overflow" v-if="goods_plugin.selfbuy_discount.next_level_discount_price.show == 1">{{ goods_plugin.selfbuy_discount.next_level_discount_price.content }}</div>
            </div>
            <div class="goods-additional-button">去升级</div>
            <i class="iconfont icon-advertise-next iconfont-button"></i>
          </div>
          <!-- 自购省end -->

          <!--活动-->
          <div class="goods-activity" @click="activityShowFun" v-if="activitySwitch">
            <div class="goods-additional-text">活动</div>
            <div class="goods-activity-items">
              <template v-for="(item, index) in activityArr">
                <div class="goods-activity-item" :key="item.key" v-if="index < 3">
                  <div class="goods-activity-item-label">{{item.name}}</div>
                  <div class="goods-additional-content overflow" v-if="item.value">{{handleValue(item)}}</div>
                </div>
              </template>

              <div class="goods-activity-item" v-for="tag in goodsInfo.marketing">
                <div class="goods-activity-item-label">{{ tag.simple_tag }}</div>
                <div class="goods-additional-content overflow" >{{ tag.tags[0] }}</div>
              </div>

            </div>
            <i style="margin-top: 4px;" class="iconfont icon-advertise-next"></i>
          </div>
        </div>

        <!-- 服务标签 -->
        <div class="server-tag-box" @click="serverShowFun" v-if="goods_plugin.label && goods_plugin.label.length > 0">
          <div class="server-tag-item" v-for="(item, pindex) in goods_plugin.label" :key="pindex" v-if="item.status == 1">
            <div class="server-tag-icon"><img v-if="item.pic" :src="item.pic" alt /></div>
            <div class="server-tab-text">{{ item.name }}</div>
          </div>
        </div>
      </div>

    </div>

    <van-popup v-model="activityShow" class="mint-popup-4 pcStyle_mint" position="bottom" :style="{ height: '60%' }" get-container="#appMain">
      <van-nav-bar title="活动" class="pcStyle_ydT">
        <template #right>
          <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="activityShow = false"></i>
        </template>
      </van-nav-bar>

      <div style="clear: both;" class="pcStyle_ydC">
        <van-cell-group style="border-width: 0;">
          <div v-for="(item, i) in activityArr" :key="i" style=" text-align: left;">
            <div class="activityArr-box">
              <p class="custom-title">{{ item.name }}</p>
              <p v-if="item.type == 'string'">{{ item.value }}</p>
              <p v-if="item.type == 'array'"><span v-for="(value, i) in item.value" :key="i">{{ value }}；</span></p>
            </div>
            <div v-if="item.desc" style="text-align: left; margin-top: 5px; color: rgb(241, 83, 83);">{{ item.desc }}</div>
          </div>

          <div  style=" text-align: left;" v-for="(tagGroup) in tagGroups">
            <div class="activityArr-box">
              <p class="custom-title">{{ tagGroup[0].simple_tag }}</p>
              <div class="activity-detail" v-for="tag in tagGroup"  @click="toGoodsList(tag.link)"><div class="detail"><template >{{ tag.tags.join('，') }}</template></div><div class="detail_more"><i class="iconfont icon-advertise-next"></i></div></div>
            </div>
          </div>

        </van-cell-group>
      </div>
    </van-popup>

    <van-popup v-model="showServer" position="bottom" class="mint-popup-4 pcStyle_mint" :style="{ height: '60%' }" get-container="#appMain">
      <van-nav-bar title="标签" class="pcStyle_ydT">
        <template #right>
          <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="showServer = false"></i>
        </template>
      </van-nav-bar>
      <div style="clear: both;" class="pcStyle_ydC">
        <ul class="parameterClass">
          <li class="server-popup-item" v-for="(item, pindex) in goods_plugin.label" v-if="item.status == 1" :key="pindex" @click="toLink(item)">
            <div class="server-popup-left">
              <div class="server-popup-top">
                <span class="img"><img class="server-icon" v-if="item.pic" :src="item.pic" alt /></span>
                <span class="name">{{ item.name }}</span>
              </div>
             <p class="desc">{{item.desc}}</p>
            </div>
            <div class="server-popup-right">
              <i class="iconfont icon-advertise-next iconfont-button"></i>
            </div>
          </li>
        </ul>
      </div>
    </van-popup>

    <van-popup v-model="PopupShow" closeable position="bottom" get-container="#appMain">
      <p class="popup-title">插件列表</p>
      <div class="popup-box" v-if="prdocut_market.plugin && prdocut_market.plugin.length > 0">
        <p class="popup-item van-hairline--bottom" v-for="(item, index) in prdocut_market.plugin" :key="index">{{ item }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    hasActivity: {
      type: Boolean,
      default: false
    },
    plugindata: {
      default: () => ({})
    },
    goods_type: {
      type: String,
      default: ""
    },
    goods_info: {
      type: Object,
      default: () => ({})
    },
    prdocut_market: {
      type: Object,
      default: () => ({})
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ActivityId: "", //活动id
      // 一口价的数据
      pack_price: "",
      goods_count: "",

      goods_sale: {},
      goods_plugin: {},

      //商城活动默认第一个
      firstActivityBtn: "",
      //商城活动默认第一个内容
      firstActivityCon: "",
      //商城活动点击开关
      activitySwitch: false,
      showServer: false,
      PopupShow: false,
      //活动显示隐藏
      activityShow: false,
      //商城活动数组
      activityArr: [],

      hotel_info: {}, //酒店
      PageNameList: {}, //自定义标题

      tagGroups:[], //标签组
    };
  },
  watch: {
    loading(newVal, oldVal) {
      if(newVal) this.init();
    }
  },
  activated(){

  },
  methods: {
    init() {
      this.pack_price = this.plugindata.pack_price;
      this.goods_count = this.plugindata.goods_count;
      this.ActivityId = this.plugindata.id;

      this.goodsInfo = this.goods_info.get_goods;
      if (this.goods_info.get_hotel_info) this.goodsInfo = { ...this.goods_info.get_goods, ...this.goods_info.get_hotel_info.goods };
      this.goods_plugin = this.goods_info.plugin || {};

      let goodsInfo = this.goods_info.get_goods;
      let tagGroups = {};
      for(let i = 0; i<goodsInfo.marketing.length; i++){
        let tag = goodsInfo.marketing[i];
        if(tagGroups[tag['act_type']] === undefined){
          tagGroups[tag['act_type']] = [];
        }
        tagGroups[tag['act_type']].push(tag);
      }
      this.tagGroups = tagGroups;
      this.goods_sale = this.goodsInfo.goods_sale;

      if (this.goods_type == "hotelGoods") {
        this.hotel_info = this.goods_info.get_hotel_info.hotel;
        this.getCustomizeHotelHead();
      }
      this.firstActivityCon="";  //68369
      //商城活动
      // 拼团商品不显示活动商城活动
      if (this.goods_type != "GroupGoods" && this.goods_type != "zhpGroup") {
        if (this.goods_sale && this.goods_sale.sale_count != 0) {
          this.firstActivityBtn = this.goods_sale.first_strip_key.name;

          if (this.goods_sale.first_strip_key.type == "array") {
            this.goods_sale.first_strip_key.value.forEach((item, index) => {
              if (index == 0) {
                this.firstActivityCon += item;
              } else {
                this.firstActivityCon += "," + item;
              }
            });
          } else {
            this.firstActivityCon = this.goods_sale.first_strip_key.value;
          }
          this.activitySwitch = true;

          this.activityArr = this.goods_sale.sale;
        } else {
          this.activitySwitch = !_.isEmpty(this.tagGroups);
        }
      }
    },
    handleValue(item) {
      let  firstActivityCon = "";
      if (item.type == "array" && item.value) {
        item.value.forEach((value, index) => {
          if (index == 0) {
            firstActivityCon += value;
          } else {
            firstActivityCon += "，" + value;
          }
        });
        return firstActivityCon;
      } else {
        return item.value;
      }
    },
    serverShowFun() {
      this.showServer = true;
    },
    activityShowFun() {
      this.activityShow = true;
    },
    // 一口价点击事件
    toFixedPrice() {
      this.$router.push(this.fun.getUrl("fixedPrice", { id: this.ActivityId }));
    },
    toLink(item) {
      if(item.link) {
        window.location.href = item.link;
      }
    },
    gotohuiyuan() {
      if (this.goods_plugin.selfbuy_discount && this.goods_plugin.selfbuy_discount.link_to_level_page && this.goods_plugin.selfbuy_discount.link_to_level_page.show == 1) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },
    //获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.PageNameList = JSON.parse(localStorage.getItem("customizeHotelHead"));
        this.fun.setWXTitle(this.PageNameList.goods_details);
      } else {
        $http
          .get("plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name", {}, "加载中")
          .then(response => {
            if (response.result == 1) {
              this.PageNameList = response.data;
              this.fun.setWXTitle(response.data.goods_details);
              localStorage.setItem("customizeHotelHead", JSON.stringify(response.data));
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    toGoodsList(url){
      this.$router.push(url);
    }
  }
};
</script>
<style lang="scss" scoped>
.act-box {
  font-size: 14px;
  background-color: #fff;
  margin-top: 0.625rem;
  padding: 0 0.75rem;
  color: #333;

  .fee,
  .act {
    height: 2.625rem;
    line-height: 2.625rem;
    width: 100%;

    li {
      float: left;
      height: 2.75rem;
      text-align: left;
    }

    i {
      text-align: right;
      float: right;
      line-height: 2.75rem;
      font-size: 20px;
      color: #999;
    }
  }

  .iconBox {
    display: flex;
    align-items: center;
    padding-bottom: 1rem;
    flex-wrap: wrap;

    li {
      line-height: 1rem;
      margin-right: 0.75rem;
      padding-top: 0.5rem;

      img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.35rem;
        vertical-align: top;
      }
    }
  }

  .grade {
    height: 2.75rem;

    span {
      border: solid 0.0625rem #f15353;
      padding: 0.125rem 0.625rem;
      color: #f15353;
      margin-right: 0.625rem;
      border-radius: 0.1875rem;
      font-size: 12px;
    }
  }

  .act {
    display: flex;

    .act1 {
      margin-right: 1.25rem;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .act2 span {
      background: #feebeb;
      color: #ed0606;
      padding: 0.125rem 0.625rem;
      border-radius: 0.1875rem;
      font-size: 12px;
    }

    .act3 {
      flex: 2.5;
      margin-left: 0.625rem;
      font-size: 12px;

      span {
        color: #333;
      }

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.pcStyle_ydT {
  width: 375px;
  left: 50% !important;
  margin-left: -187.5px;
}

.pcStyle_ydC {
  width: 375px;
  height: 85%;
  overflow-y: scroll;
  padding: 0 1rem;
  margin: 0 auto;

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.parameterClass {
  li {
    width: 100%;
    display: flex;
    text-align: left;
    padding: 0.75rem 0.75rem;
    position: relative;

    .leftb {
      flex: 0 0 20%;
      margin-right: 1.25rem;
      font-size: 12px;
      color: #000;
    }

    .rightb {
      flex: 1;
      font-size: 14px;
      color: #5d5d5d;
    }
  }

  /*
  li::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -11rem;
    width: 22rem;
    height: 1px;
    background: #e4e4e4;
  }
  */
}

.fee {
  display: flex;
}

.activityArr-box {
  padding: 0.6rem 0;
  display: flex;
  flex-direction: column;

  .custom-title {
    color: #f14e4e;
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  p{
    line-height:2em;
  }
}

.server-popup-item {
  display: flex;
  padding: 0.6rem 0 !important;

  .server-popup-left {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .server-popup-top {
    display: flex;
    align-items: center;
    margin-bottom: 0.3rem;

    .name {
      margin: 0 0 0.2rem 0.5rem;
      font-size: 14px;
      color: #f14e4e;
      font-weight: bold;
    }
  }

  .desc {
    font-size: 12px;
    color: #3a3a3a;
  }

  .server-popup-right {
    flex: 0 0 20px;
  }
}

.good-item-box {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
}

.goods-additional-info {
  text-align: left;
  padding: 0.5rem 0.875rem;

  .goods-additional-text {
    width: 3.156rem;
    font-size: 0.813rem;
    color: #9c9c9c;
  }

  .goods-additional-text_diy {
    width: 4.3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .goods-additional-content {
    flex: 1;
    font-size: 13px;
    font-weight: bold;
    color: #565656;
  }

  .goods-additional-button {
    font-size: 12px;
    margin-left: 0.5rem;
    font-weight: bold;
    color: #f14e4e;
  }

  .iconfont-button {
    color: #f14e4e;
  }

  .collect-order {
    display: flex;
    margin: 0.8rem 0;
  }

  .selfbuy-discount {
    display: flex;
    margin: 0.8rem 0;

    .selfbuy-discount-items {
      flex: 1;
      overflow: hidden;

      .goods-additional-content:not(:first-child) {
        margin-top: 0.8rem;
      }
    }
  }

  .service-box {
    padding: 0 0.75rem 0.5rem 0;
    text-align: left;
    color: #5a5a5a;
    font-size: 13px;
    background: #fff;
  }

  .goods-activity {
    display: flex;
    margin: 0.8rem 0;

    .goods-activity-items {
      flex: 1;
      overflow: hidden;

      .goods-activity-item:not(:first-child) {
        margin-top: 0.75rem;
      }

      .goods-activity-item {
        display: flex;
        align-items: center;

        .goods-activity-item-label {
          padding: 2px 8px;
          font-size: 0.625rem;
          color: #f14e4e;
          background: rgba(241, 78, 78, 0.1);
          border-radius: 15px;
        }

        .goods-additional-content {
          margin-left: 0.406rem;
        }
      }
    }
  }
}

.server-tag-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0.6rem;
  border-radius: 0 0 10px 10px;
  background: rgba(246, 144, 54, 0.1);

  .server-tag-item {
    display: flex;
    margin: 0.3rem;

    .server-tag-icon {
      width: 1rem;
      height: 1rem;
      border-radius: 0.125rem;

      img {
        width: 1rem;
        height: 1rem;
      }
    }

    .server-tab-text {
      margin-left: 0.313rem;
      font-size: 12px;
      font-weight: bold;
      color: #f69036;
    }
  }
}

.server-icon {
  width: 1rem;
  height: 1rem;
}

.popup-title {
  padding: 1rem;
  font-size: 18px;
  font-weight: bold;
}

.popup-box {
  height: 15rem;
  overflow-y: scroll;

  .popup-item {
    padding: 0.5rem;
  }
}
.activity-detail{
  margin-top:15px;
  line-height: 1.5em;
  .detail{
    display: inline-block;
    width:90%;
    white-space: nowrap;/*内容超宽后禁止换行显示*/
    overflow: hidden;/*超出部分隐藏*/
    text-overflow:ellipsis;/*文字超出部分以省略号显示*/
  }
  .detail_more{
    width: 10%;
    white-space: nowrap;/*内容超宽后禁止换行显示*/
    overflow: hidden;/*超出部分隐藏*/
    text-overflow:ellipsis;/*文字超出部分以省略号显示*/
    display: inline-block;
    text-align: right;
  }
}
</style>
