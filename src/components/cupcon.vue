<template>
  <!-- 大于三张优惠券 -->
  <div id="coupon_page">
    <!--<div id="coupon" v-if="datas.params.shownum>3">
      <div class="coupon-con">
        <div class="coupon-con-1">
          <div class="coupon-a" v-for="(item,index) in coupon_list"
               :class="{'last':item.api_availability == 2 || item.api_availability == 3}"
               @click="selectedcoupon(item,index)" :style="'background:'+datas.params.couponcolor">
            <ul>
              <li v-if="item.coupon_method==1"><font>{{$i18n.t('money')}}</font>{{item.deduct}}</li>
              <li v-if="item.coupon_method==2">{{item.discount}}<font>折</font></li>
              <li><span>{{item.name}}</span></li>
            </ul>
            <div class="spare-a"></div>
            <div class="spare-b"></div>

            <div class="img" v-if="item.api_availability == 3 ? true:false"><img src="../assets/images/lootall.png">
            </div>

            <div class="img" v-if="item.api_availability == 2 ? true:false"><img src="../assets/images/receive.png">
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>-->
    <!-- 小于等于三张优惠券 -->
    <!--<div id="coupon1" v-if="datas.params.shownum <= 3">
      <div class="coupon-a" v-for="(item,index) in coupon_list"
           :class="{'last':item.api_availability == 2 || item.api_availability == 3}"
           @click="selectedcoupon(item,index)" :style="'background:'+datas.params.couponcolor">
        <ul>
          <li v-if="item.coupon_method==1"><font>{{$i18n.t('money')}}</font>{{item.deduct}}</li>
          <li v-if="item.coupon_method==2">{{item.discount}}<font>折</font></li>
          <li><span>{{item.name}}</span></li>
        </ul>
        <div class="spare-a"></div>
        <div class="spare-b"></div>

        <div class="img" v-if="item.api_availability == 3 ? true:false"><img src="../assets/images/lootall.png"></div>

        <div class="img" v-if="item.api_availability == 2 ? true:false"><img src="../assets/images/receive.png"></div>
      </div>
    </div>-->
    <!-- 新样式 -->
    <div id="coupon_box" :style="'background:'+datas.params.bgcolor">
      <div class="coupon_bg_box">
        <div class="coupon_bg" v-for="(item,index) in coupon_list" :key='index'
             :class="{'last':item.api_availability == 2 || item.api_availability == 3}"
             @click="selectedcoupon(item,index)" :style="'backgroundColor:'+datas.params.couponcolor">
          <ul class="coupon_info">
            <li>
              <span v-if="item.coupon_method===1">{{$i18n.t('money')}}</span><font v-if="item.coupon_method===1">{{item.deduct}}</font>
              <font v-if="item.coupon_method===2">{{item.discount}}</font><span v-if="item.coupon_method===2">折</span>
              <span :style="'color:'+datas.params.couponcolor" class="receive"
                    v-if="item.api_availability === 3">已抢光</span>
              <span :style="'color:'+datas.params.couponcolor" class="receive"
                    v-if="item.api_availability === 2">已领取</span>
              <span :style="'color:'+datas.params.couponcolor" class="receive"
                    v-if="item.api_availability !== 2 && item.api_availability !== 3">立即领取</span>
            </li>
            <li>{{item.name}}</li>
          </ul>
          <div :style="'backgroundColor:'+datas.params.bgcolor" class="spare_left"></div>
          <div :style="'backgroundColor:'+datas.params.bgcolor" class="spare_right"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    datas: {
      default: []
    }
  },
  data() {
    return {
      coupon_list: []
    };
  },

  mounted() {
    // console.log(this.datas.data);
    if (this.datas.params.addmethod == "0") {
      //后台设置 自动获取
      let couponAll = this.datas.get_info.data;
      let sliceLenth = this.datas.params.shownum;//后台设置 自动获取 设置的 优惠券 数量
      this.coupon_list = couponAll.slice(0,sliceLenth);//进行数组截取
      // this.autoGetData();
    } else {
      this.coupon_list = this.datas.data;
    }
  },

  activated() {

  },

  computed: {},
  methods: {
    selectedcoupon(item, index) {

      if (item.api_availability == 3) {
        return;
      }
      //领取
      var that = this;
      $http.get('coupon.member-coupon.get-coupon', {coupon_id: item.coupon_id}, '正在抢').then(function (response) {

        if (response.result === 1) {
          var temp = response.data;
          that.$set(that.coupon_list, index, temp);
          //console.log(that.list);

        } else {
          if(response.data.reason){
            that.$dialog.alert({message:response.data.reason,title:response.msg});
          }else{
            that.$dialog.alert({message:response.msg});
          }
        }
      }, function (response) {
        // error callback
      });
    },

    autoGetData() {
      $http.get("coupon.member-coupon.coupons-for-designer", {}).then(res => {
        if (res.result == 1) {
          let sliceLenth = this.datas.params.shownum;//后台设置 自动获取 设置的 优惠券 数量
          let couponAll = res.data.data;
          this.coupon_list = couponAll.slice(0,sliceLenth);//进行数组截取
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #coupon_page {
    #coupon {
      overflow: hidden;
      overflow-x: auto;
      margin-top: 0.0625rem;

      .coupon-con {
        // margin-top: 0.0625rem;
        // width: 100%;
        // justify-content: space-between;
        // padding: 0.625rem;
        // background-color: #fff;
        // overflow-y: hidden;
        // position: relative;
        height: 3.75rem;
        width: 6.25rem;
        position: relative;
      }

      .coupon-con-1 {
        left: 0;
        top: 0;
        position: absolute;
        height: 3.75rem;
        overflow-x: auto;
        white-space: nowrap;
        display: flex;
      }

      .coupon-a {
        overflow: hidden; // background-color:rgba(241,83,83,0.8) ;
        background-color: #ff9800;
        border-radius: 0.25rem; //width: 7.125rem;
        width: 7.125rem;
        height: 3.75rem;
        position: relative; //float: left;
        margin-right: 0.625rem;

        ul {
          color: #fff;

          li:first-child {
            margin-top: 0.5rem;
            line-height: 1.5rem;
            font-size: 24px;
            font-weight: bold;

            font {
              font-size: 12px;
              font-weight: normal;
            }
          }

          li:last-child {
            span {
              padding: 0 0.375rem;
              border-radius: 0.1875rem; // background:rgba(255,184,76,0.2);
            }
          }
        }

        .img {
          width: 4rem;
          height: 4rem;
          position: absolute;
          top: -1.5rem;
          right: -1.5rem;

          img {
            width: 100%;
          }
        }

        .spare-a {
          width: 0.625rem;
          height: 0.625rem;
          background-color: #fff;
          border-radius: 0.3125rem;
          position: absolute;
          top: calc(50% - 0.3125rem);
          left: -0.3125rem;
        }

        .spare-b {
          width: 0.625rem;
          height: 0.625rem;
          background-color: #fff;
          border-radius: 0.3125rem;
          position: absolute;
          top: calc(50% - 0.3125rem);
          right: -0.3125rem;
        }
      }

      .coupon-a:first-child {
        margin-left: 0.625rem;
      }

      .last {
        background-color: #eaeaea;
      }
    }

    #coupon1 {
      margin-top: 0.0625rem;
      display: flex;
      justify-content: space-between;
      padding: 0.625rem;
      background-color: #fff;

      .coupon-a {
        overflow: hidden; // background-color:rgba(241,83,83,0.8) ;
        background-color: #ff9800;
        border-radius: 0.25rem;
        width: 7.125rem;
        height: 3.75rem;
        position: relative;

        ul {
          color: #fff;

          li:first-child {
            margin-top: 0.5rem;
            line-height: 1.5rem;
            font-size: 24px;
            font-weight: bold;

            font {
              font-size: 12px;
              font-weight: normal;
            }
          }

          li:last-child {
            span {
              padding: 0 0.375rem;
              border-radius: 0.1875rem; // background:rgba(255,184,76,0.2);
            }
          }
        }

        .img {
          width: 4rem;
          height: 4rem;
          position: absolute;
          top: -1.5rem;
          right: -1.5rem;

          img {
            width: 100%;
          }
        }

        .spare-a {
          width: 0.625rem;
          height: 0.625rem;
          background-color: #fff;
          border-radius: 0.3125rem;
          position: absolute;
          top: calc(50% - 0.3125rem);
          left: -0.3125rem;
        }

        .spare-b {
          width: 0.625rem;
          height: 0.625rem;
          background-color: #fff;
          border-radius: 0.3125rem;
          position: absolute;
          top: calc(50% - 0.3125rem);
          right: -0.3125rem;
        }
      }

      .last {
        background-color: #eaeaea;
      }
    }

    #coupon_box {
      padding: 0 0.625rem;
      background-color: #fafafa;

      .coupon_bg_box {
        padding: 0.625rem 0;
        display: flex;
        overflow: hidden;
        overflow-x: auto;

        .coupon_bg {
          background: #f74546;
          border-radius: 0.25rem;
          margin-right: 1.125rem;
          width: 10.5rem;
          height: 4.6875rem;
          background-image: url(../assets/images/coupon_font.png);
          background-repeat: no-repeat;
          background-size: 4rem;
          background-position: 0 0;
          position: relative;
          display: inline-table;

          .coupon_info {
            text-align: center;
            width: 100%;

            li:first-child {
              padding: 0.625rem 0.625rem 0 1.5rem;
              color: #fff;
              display: flex;
              justify-content: flex-end;
              align-items: flex-end;
              font-size: 16px;

              font {
                font-weight: bold;
                font-size: 36px;
                line-height: 1.875rem;

                span {
                  font-weight: normal;
                  font-size: 16px;
                }
              }

              .receive {
                line-height: 1.25rem;
                display: block;
                width: 3.5rem;
                height: 1.25rem;
                background-image: url(../assets/images/coupon_receive.png);
                background-size: 3.5rem 1.25rem;
                background-repeat: no-repeat;
                font-size: 12px;
                color: #f15353;
                margin-left: 0.625rem;
              }
            }

            li:last-child {
              width: 100%;
              border-top: dashed 1px #fff;
              line-height: 1.25rem;
              text-align: center;
              position: absolute;
              bottom: 0;
              font-size: 12px;
              color: #fff;
            }
          }

          .spare_left {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #fafafa;
            border-radius: 0.25rem;
            position: absolute;
            left: -0.25rem;
            bottom: 1rem;
          }

          .spare_right {
            width: 0.5rem;
            height: 0.5rem;
            background-color: #fafafa;
            border-radius: 0.25rem;
            position: absolute;
            right: -0.25rem;
            bottom: 1rem;
          }
        }
      }
    }
  }
</style>
