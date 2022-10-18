<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--优惠券静态-->
    <div class="coupon">
      <template>
        <div style="text-align: center; font-size: 16px; height: 50px; line-height: 50px;" v-if="coupons_list.length<=0">
          暂无设置优惠券
        </div>
        <!-- 样式一，一张购物卷 -->
        <div class="coupon_one" v-if="coupons_list.length === 1 && coupons_list[0].id && datas.coupons_style == '1'">
          <div class="couponBox" @click.stop="selectedcoupon(coupons_list[0],0)">
            <div class="couponLeft">
              <span style="font-size: 26px; font-weight: bold;">{{coupons_list[0].coupon_method == 1?`${$i18n.t('money')}${coupons_list[0].deduct}`:`${coupons_list[0].discount}折`}}</span>
              <div class="couponName">
                <span style="font-size: 16px;">{{coupons_list[0].name}}</span>
                <span>{{coupons_list[0].enough == 0 ? '无门槛' : `满${coupons_list[0].enough}立减`}}</span>
              </div>
            </div>
            <div class="coouponRight">
              <div class="line">
                <div class="crl"></div>
                <div class="crl"></div>
              </div>
              <span style="font-size: 18px;" v-if="coupons_list[0].api_availability === 3">已抢光</span>
              <span style="font-size: 18px;" v-if="coupons_list[0].api_availability === 2">已领取</span>
              <span style="font-size: 18px;" v-if="coupons_list[0].api_availability !== 2 && coupons_list[0].api_availability !== 3">立即领取</span>
              <div class="cir_top"></div>
              <div class="cir_bottom"></div>
            </div>
          </div>
        </div>
        <div class="coupon_two" v-if="coupons_list.length === 1 && coupons_list[0].id && datas.coupons_style == '2'">
          <div class="cir_top"></div>
          <div class="cir_bottom"></div>
          <div class="cir_topLeft"></div>
          <div class="cir_bottomRight"></div>
          <div class="couponBox"  @click.stop="selectedcoupon(coupons_list[0],0)">
            <div class="linebox">
              <div class="couponLeft">
                <span style="font-size: 24px; font-weight: bold;">{{coupons_list[0].coupon_method == 1?`${$i18n.t('money')}${coupons_list[0].deduct}`:`${coupons_list[0].discount}折`}}</span>
                <div class="couponName">
                  <span style="font-size: 16px;">{{coupons_list[0].name}}</span>
                  <span>{{coupons_list[0].enough == 0 ? '无门槛' : `满${coupons_list[0].enough}立减`}}</span>
                </div>
              </div>
              <div class="coouponRight">
                <div class="line"></div>
                <span style="font-size: 18px;" v-if="coupons_list[0].api_availability === 3">已抢光</span>
                <span style="font-size: 18px;" v-if="coupons_list[0].api_availability === 2">已领取</span>
                <span style="font-size: 18px;" v-if="coupons_list[0].api_availability !== 2 && coupons_list[0].api_availability !== 3">立即领取</span>
              </div>
            </div>
          </div>
        </div>
        <div class="coupon_thr" v-if="coupons_list.length === 1 && coupons_list[0].id && datas.coupons_style == '3'">
          <div class="couponBox"  @click.stop="selectedcoupon(coupons_list[0],0)">
            <div class="couponLeft">
              <span style="font-size: 24px; font-weight: bold;">{{coupons_list[0].coupon_method == 1?`${$i18n.t('money')}${coupons_list[0].deduct}`:`${coupons_list[0].discount}折`}}</span>
              <div class="couponName">
                <span style="font-size: 16px;">{{coupons_list[0].name}}</span>
                <span>{{coupons_list[0].enough == 0 ? '无门槛' : `满${coupons_list[0].enough}立减`}}</span>
              </div>
            </div>
            <div class="coouponRight">
              <span  v-if="coupons_list[0].api_availability === 3">已抢光</span>
              <span  v-if="coupons_list[0].api_availability === 2">已领取</span>
              <span  v-if="coupons_list[0].api_availability !== 2 && coupons_list[0].api_availability !== 3">立即领取</span>
            </div>
          </div>
        </div>
      </template>

      <template v-if="coupons_list.length > 1">
        <!-- 样式一，两张购物卷 -->
        <div class="one_coupon_one ofset" v-if="datas.coupons_style == '1'" @scroll="orderScroll">
          <div :class="`couponBox couponBox-${id}`" v-for="(item, index) in coupons_list" :key="index" v-if="item.id"  @click.stop="selectedcoupon(item,index)">
            <div class="couponLeft">
              <span style="font-size: 28px; margin-bottom: 8px; line-height: 28px;">{{item.coupon_method == 1?`${$i18n.t('money')}${item.deduct}`:`${item.discount}折`}}</span>
              <div class="couponName">
                <span>{{item.enough == 0 ? '无门槛' : `满${item.enough}立减`}}</span>
              </div>
            </div>
            <div class="coouponRight">
              <div class="line">
                <div class="crl"></div>
                <div class="crl"></div>
              </div>
              <div class="rigbox">
                <div style="width: 14px;">
                  <span  v-if="item.api_availability === 3">已抢光</span>
                  <span  v-if="item.api_availability === 2">已领取</span>
                  <span  v-if="item.api_availability !== 2 && item.api_availability !== 3">立即领取</span>
                </div>
              </div>
              <div class="cir_top"></div>
              <div class="cir_bottom"></div>
            </div>
          </div>
        </div>
        <!-- 样式二，两张购物卷 -->
        <div class="two_coupon_two ofset" v-if="datas.coupons_style == '2'" @scroll="orderScroll">
          <div :class="`couponBox couponBox-${id}`" v-for="(item, index) in coupons_list" :key="index" v-if="item.id" @click.stop="selectedcoupon(item,index)">
            <div class="cir_top"></div>
            <div class="cir_bottom"></div>
            <div class="cir_topLeft"></div>
            <div class="cir_bottomRight"></div>
            <div class="linebox">
              <div class="couponLeft">
                <span style="font-size: 28px; margin-bottom: 8px; line-height: 28px;">{{item.coupon_method == 1?`${$i18n.t('money')}${item.deduct}`:`${item.discount}折`}}</span>
                <div class="couponName">
                  <span>{{item.enough == 0 ? '无门槛' : `满${item.enough}立减`}}</span>
                </div>
              </div>
              <div class="coouponRight">
                <div class="line"></div>
                <div class="rigbox">
                  <div style="width: 14px;">
                    <span  v-if="item.api_availability === 3">已抢光</span>
                    <span  v-if="item.api_availability === 2">已领取</span>
                    <span  v-if="item.api_availability !== 2 && item.api_availability !== 3">立即领取</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 样式三，两张购物卷 -->
        <div class="thr_coupon_thr ofset" v-if="datas.coupons_style == '3'" @scroll="orderScroll">
          <div :class="`couponBox couponBox-${id}`" v-for="(item, index) in coupons_list" :key="index" v-if="item.id" @click.stop="selectedcoupon(item,index)">
            <div class="couponLeft">
              <span style="font-size: 28px; margin-bottom: 8px; line-height: 28px;">{{item.coupon_method == 1?`${$i18n.t('money')}${item.deduct}`:`${item.discount}折`}}</span>
              <div class="couponName">
                <span>{{item.enough == 0 ? '无门槛' : `满${item.enough}立减`}}</span>
              </div>
            </div>
            <div class="coouponRight">
              <span  v-if="item.api_availability === 3">光</span>
              <span  v-if="item.api_availability === 2">已</span>
              <span  v-if="item.api_availability !== 2 && item.api_availability !== 3">领</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";
// 自定义样式
const css = function() {
  const {
    preview_color,
    coupons_font_color,
    coupons_color,
    coupons_border_color
  } = this.datas;

  return `
        .component-${this.id} .coupon_one, .component-${this.id} .coupon_two, .component-${this.id} .coupon_thr, .component-${this.id} .one_coupon_one,
        .component-${this.id}  .two_coupon_two, .component-${this.id} .thr_coupon_thr, .component-${this.id} .coupon .cir_top,
         .component-${this.id} .coupon .cir_bottom, .component-${this.id} .coupon .cir_topLeft, .component-${this.id} .coupon .cir_bottomRight{
            background-color: ${preview_color};
        }
        .component-${this.id} .couponBox{
            background-color: ${coupons_color.color};
            background-image: url(${coupons_color.isColor == 2? coupons_color.image || emptyImage: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            color: ${coupons_font_color};
        }
        .component-${this.id} .one_coupon_one .couponName, .component-${this.id} .two_coupon_two .couponName {
            border-top: 1px solid ${coupons_border_color};
        }

        .component-${this.id} .thr_coupon_thr .couponName{
            border-top: 1px dotted ${coupons_border_color};
        }

        .component-${this.id} .thr_coupon_thr .coouponRight, .component-${this.id} .coupon_thr .coouponRight{
            background-color: ${coupons_border_color};
        }

        .component-${this.id} .coupon_one .line, .component-${this.id} .coupon_two .line, .component-${this.id} .one_coupon_one .line,
        .component-${this.id}  .two_coupon_two .line {
            border: dotted ${coupons_border_color} 2px;
        }

        .component-${this.id} .coupon_two .linebox, .component-${this.id}  .two_coupon_two .linebox{
            border: solid 1px ${coupons_border_color};
        }

    `;
};

export default {
  data() {
    return {
      isLoadMore: true, //true 可以加载更多
      page: 1,
      total_page: 0,
    };
  },
  props: ["page_id","id", "datas", "component_key"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
    coupons_list() {
      return this.datas.list.data || this.datas.list;
    }
  },
  mounted() {
    if(this.datas.list.data) {
      this.total_page = this.datas.list.last_page;
      if(this.total_page <= this.page) {
        this.isLoadMore = false;
      }
      if(this.datas.list.data.length > this.datas.get_number) {
        this.datas.list.data.splice(this.datas.get_number,this.datas.list.data.length-this.datas.get_number);
        this.isLoadMore = false;
      }
    }else {
      if(this.datas.list.length <= 0) {
        this.isLoadMore = false;
      }
    }
  },
  methods: {
    selectedcoupon(item, index) {

      if (item.api_availability == 3) {
        return;
      }
      //领取
      const that = this;
      $http.get('coupon.member-coupon.get-coupon', {coupon_id: item.id}, '正在抢').then(function (response) {

        if (response.result === 1) {
          let temp = response.data;
          that.$set(that.coupons_list, index, temp);
          that.$dialog.confirm({
            title: "提示",
            message: "已领取，可到个人中心--优惠券查看"
          }).then(() => {
            that.$router.push(that.fun.getUrl('coupon'));
            // on confirm
          }).catch(() => {
            // on cancel
          });

        } else {
          if(response.data.reason){
            that.$dialog.alert({message:response.data.reason,title:response.msg});
          }else{
            that.$dialog.alert({message:response.msg});
          }
        }
      }, function (response) {
      });
    },
    orderScroll() {
      let fixedDom = document.getElementsByClassName(`couponBox-${this.id}`)[0];
      if(fixedDom.getClientRects()[0].x-fixedDom.offsetLeft < -(this.coupons_list.length-2)*170) {
        // 加载更多
        if (this.isLoadMore && this.datas.get_style == 1) {
          this.getMoreData();
        } else {
          // console.log("没有数据了");
        }
      }
    },
    // 获取更多数据
    getMoreData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page ||this.coupons_list.length > this.datas.get_number) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "home-page.get-decorate-page",
            {
              page: this.page,
              decorate_id: this.page_id || this.$store.state.temp.item.id,
              component_id: this.id,
              component_key: this.component_key
            },'loading')
          .then((response)=> {
            this.isLoadMore = true;
            if (response.result === 1) {
              this.datas.list.data =this.datas.list.data.concat(response.data.data);//数组拼接
              if(this.datas.list.data.length > this.datas.get_number) {
                this.datas.list.data.splice(this.datas.get_number, this.datas.list.data.length-this.datas.get_number);
                this.isLoadMore = false;
              }
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            console.error(response);
            // error callback
          }
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
  }

  .ofset {
    overflow-x: scroll;
  }

  .thr_coupon_thr {
    width: 100%;
    padding: 10px 0;
    display: flex;
    white-space: nowrap;

    .couponBox {
      width: 180px;
      height: 75px;

      /* background: #b6b6b6; */
      border-radius: 0 37.5px 37.5px 0;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .couponLeft {
        // margin-left: 16.5px;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin-right: 7px;
        flex: 1;

        .couponName {
          display: flex;
          flex-direction: column;
          font-size: 12px;

          /* border-top: 1px dotted #ebebee; */
          // margin-left: 18px;
        }
      }

      .coouponRight {
        width: 50px;
        height: 50px;
        font-size: 16px;
        flex: 0 0 50px;
        margin-right: 10px;

        /* background: #ffffff; */
        position: relative;
        display: flex;
        align-items: center;
        border-radius: 50%;
        justify-content: center;
      }
    }
  }

  .two_coupon_two {
    width: 100%;
    // height: 92px;

    /* background: #ffffff; */
    padding: 10px 0;
    display: flex;
    white-space: nowrap;

    .couponBox {
      position: relative;
      width: 170px;
      height: 75px;

      /* background: #b6b6b6; */
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;
      padding: 4px;
      flex-shrink: 0;

      .cir_top {
        position: absolute;
        z-index: 2;
        width: 14px;
        height: 14px;

        /* background: #ffffff; */
        border-radius: 50%;
        left: -3px;
        top: -3px;
      }

      .cir_bottom {
        position: absolute;
        z-index: 2;
        width: 14px;
        height: 14px;

        /* background: #ffffff; */
        border-radius: 50%;
        left: -3px;
        bottom: -3px;
      }

      .cir_topLeft {
        position: absolute;
        z-index: 2;
        width: 14px;
        height: 14px;

        /* background: #ffffff; */
        border-radius: 50%;
        right: -3px;
        top: -3px;
      }

      .cir_bottomRight {
        position: absolute;
        z-index: 2;
        width: 14px;
        height: 14px;

        /* background: #ffffff; */
        border-radius: 50%;
        right: -3px;
        bottom: -3px;
      }

      .linebox {
        // margin-left: 16.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;

        /* border: solid 1px #e3e3e3; */
      }

      .couponLeft {
        width: 127px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .couponName {
          display: flex;
          flex-direction: column;

          /* border-top: 1px solid #ffffff; */
        }
      }

      .coouponRight {
        position: relative;
        width: 40px;
        display: flex;
        height: 100%;
        align-items: center;

        .rigbox {
          width: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 100%;
          white-space: pre-wrap;
        }

        .line {
          height: 90%;
          width: 2px;

          /* border: dotted  #ffffff 2px; */
          border-radius: 1px;
        }
      }
    }
  }

  .one_coupon_one {
    width: 100%;
    // height: 92px;

    /* background: #ffffff; */
    padding: 10px 0;
    display: flex;

    .couponBox {
      width: 170px;
      height: 75px;

      /* background: #b6b6b6; */
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;

      .couponLeft {
        width: 127px;
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;

        .couponName {
          display: flex;
          flex-direction: column;

          /* border-top: 1px solid #ffffff; */
        }
      }

      .coouponRight {
        position: relative;
        width: 40px;
        // margin-right: 22.5px;
        display: flex;
        height: 100%;
        align-items: center;

        .rigbox {
          width: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 100%;
        }

        .cir_top {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;

          /* background: #ffffff; */
          border-radius: 50%;
          left: -5px;
          top: -7px;
        }

        .cir_bottom {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;

          /* background: #ffffff; */
          border-radius: 50%;
          left: -5px;
          bottom: -7px;
        }

        .line {
          height: 70%;
          // width: 2px;

          /* border: dotted  #ffffff 1px; */
          border-radius: 1px;
        }
      }
    }
  }

  .coupon_one {
    width: 100%;
    // height: 92px;

    /* background: #ffffff; */
    overflow: hidden;
    padding: 10px 0;

    .couponBox {
      width: 95%;
      height: 75px;

      /* background: #b6b6b6; */
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;

      .couponLeft {
        margin-left: 16.5px;
        display: flex;
        align-items: center;
        font-size: 14px;

        .couponName {
          display: flex;
          flex-direction: column;
          margin-left: 18px;
        }
      }

      .coouponRight {
        position: relative;
        margin-right: 22.5px;
        display: flex;
        height: 100%;
        align-items: center;

        .cir_top {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;

          /* background: #ffffff; */
          border-radius: 50%;
          left: -5px;
          top: -7px;
        }

        .cir_bottom {
          position: absolute;
          z-index: 2;
          width: 14px;
          height: 14px;

          /* background: #ffffff; */
          border-radius: 50%;
          left: -5px;
          bottom: -7px;
        }

        .line {
          height: 100%;
          width: 2px;

          /* border: dotted  #ffffff 2px; */
          border-radius: 1px;
        }

        span {
          margin-left: 23px;
        }
      }
    }
  }

  .coupon_two {
    width: 100%;
    // height: 92px;

    /* background: #ffffff; */
    overflow: hidden;
    padding: 10px 0;
    position: relative;

    .cir_top {
      position: absolute;
      z-index: 2;
      width: 14px;
      height: 14px;

      /* background: #ffffff; */
      border-radius: 50%;
      left: 5px;
      top: 5px;
    }

    .cir_bottom {
      position: absolute;
      z-index: 2;
      width: 14px;
      height: 14px;

      /* background: #ffffff; */
      border-radius: 50%;
      left: 5px;
      bottom: 5px;
    }

    .cir_topLeft {
      position: absolute;
      z-index: 2;
      width: 14px;
      height: 14px;
      font-size: 14px;

      /* background: #ffffff; */
      border-radius: 50%;
      right: 5px;
      top: 5px;
    }

    .cir_bottomRight {
      position: absolute;
      z-index: 2;
      width: 14px;
      height: 14px;

      /* background: #ffffff; */
      border-radius: 50%;
      right: 5px;
      bottom: 5px;
    }

    .couponBox {
      width: 95%;
      height: 75px;

      /* background: #b6b6b6; */
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 10px;
      padding: 4px;

      .linebox {
        // margin-left: 16.5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;

        /* border: solid 1px #ffffff; */
      }

      .couponLeft {
        margin-left: 12.5px;
        display: flex;
        align-items: center;

        .couponName {
          display: flex;
          flex-direction: column;
          margin-left: 18px;
        }
      }

      .coouponRight {
        margin-right: 18.5px;
        display: flex;
        height: 100%;
        align-items: center;

        .line {
          height: 90%;
          width: 2px;

          /* border: dotted  #ffffff 2px; */
          border-radius: 1px;
        }

        span {
          margin-left: 23px;
        }
      }
    }
  }

  .coupon_thr {
    width: 100%;
    padding: 10px 0;

    .couponBox {
      // widows: 100%;
      height: 75px;

      /* background: #b6b6b6; */
      border-radius: 0 37.5px 37.5px 0;
      margin: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .couponLeft {
        margin-left: 16.5px;
        display: flex;
        align-items: center;

        .couponName {
          display: flex;
          flex-direction: column;
          margin-left: 18px;
        }
      }

      .coouponRight {
        padding: 10px 14px;

        /* background: #ffffff; */
        position: relative;
        margin-right: 22.5px;
        display: flex;
        align-items: center;
        border-radius: 20px;
      }
    }
  }

</style>
