<template>
  <div id="cpxindex">
    <div class="headTop set-pc-styleLeft">
      <div class="left">
        <div class="img">
          <img :src="info.shop_logo" alt="" />
        </div>
        <div>{{ info.shop_name }}</div>
      </div>
      <a :href="info.download_url" class="loadbtn">APP下载</a>
    </div>
    <div style="width: 100%; height: 2.78rem;"></div>
    <div class="shoplist">
      <div class="shopimg">
        <!-- <img src="https://img.alicdn.com/i3/3446509218/O1CN01gdAyWf2Hxta37O5GF_!!3446509218.jpg" alt="" /> -->
        <van-swipe class="my-swipe" :show-indicators="false" v-if="info.images">
          <van-swipe-item v-for="(item, index) in info.images" :key="index" >
            <img :src="item" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="conten_bottom">
        <div class="conten_bottom_one">
          <div class="conten_bottom_left">{{ info.title }}</div>
          <div class="coupon">
            <div class="coupon_o">￥{{info.coupon_money}}</div>
            <div class="line"></div>
            <div class="coupon_t">券</div>
          </div>
        </div>
        <div class="price">
          <div class="first_money">
            <span>{{ $i18n.t('money') }}</span
            >{{info.discount_price}}
          </div>
          <div class="lose_money">{{ $i18n.t('money') }}{{info.price}}</div>
        </div>
      </div>
      <div class="gopayBtn" @click="playBtn">去购买</div>
    </div>
    <van-popup v-model="show" :style="{ height: '17.6rem' }">
      <div>
        <div class="popBox">
          <div class="txt">{{info.tkl}}</div>
          <div class="title">复制文字-在某宝中打开</div>
          <div class="copyBtn" v-clipboard:copy="info.tkl" v-clipboard:success="onCopy" v-clipboard:error="onError">
            复制
          </div>
          <div class="lineS"></div>
        </div>
        <div class="lineT"></div>
        <i class="iconfont icon-adsystem_icon_cancle newicon" @click.stop="closeGb"></i>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { scrollMixin } from 'utils/mixin';
import { Toast } from 'vant';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      show: false,
      item_id: '',
      platform_id: '',
      info: []
    };
  },
  mounted() {},
  methods: {
    playBtn() {
      if(this.platform_id == 1){
        this.show = true;
      }else{
        window.location.href = this.info.click_url;
      }
    },
    closeGb() {
      this.show = false;
    },
    //复制邀请码
    onCopy: function (e) {
      Toast({
        message: '复制成功',
        duration: 1000
      });
    },
    onError: function (e) {
      Toast({
        message: '复制失败',
        duration: 1000
      });
    },
    getdata() {
      let that = this;
      $http
        .get(
          'plugin.aggregation-cps.api.goods',
          {
            item_id: this.item_id,
            platform_id: this.platform_id
          },
          ''
        )
        .then(
          response => {
            if (response.result == 1) {
              this.info = response.data;
              this.fun.setWXTitle(that.info.shop_name);
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  },
  activated() {
    console.log(this.$route.query);
    this.item_id = this.$route.query.item_id;
    this.platform_id = this.$route.query.platform_id;
    this.getdata();
  },
  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cpxindex {
  .van-popup {
    background: transparent !important;
  }

  .lineS {
    position: absolute;
    width: 0.13rem;
    height: 1.6rem;
    left: 9.7rem;
    bottom: -1.65rem;
    background: #fff;
  }

  .lineT {
    height: 1.38rem;
    width: 100%;
  }

  .newicon {
    color: #fff;
    font-size: 1.66rem;
  }

  .popBox {
    width: 19.56rem;
    height: 14.22rem;
    background: #fff;
    border-radius: 0.63rem;
    position: relative;
    padding: 2.53rem 0 1.97rem 0;

    .txt {
      width: 11.56rem;
      height: 2.19rem;
      background-color: #d5d5d5;
      margin: 0 auto;
      margin-bottom: 1.09rem;
      background-image:
        -webkit-gradient(
          linear,
          0 0,
          100% 100%,
          color-stop(0.25, rgba(0, 51, 51, 1)),
          color-stop(0.25, transparent),
          color-stop(0.5, transparent),
          color-stop(0.5, rgba(0, 51, 51, 1)),
          color-stop(0.75, rgba(0, 51, 51, 1)),
          color-stop(0.75, transparent),
          to(transparent)
        );
      background-size: 20px 20px;
      text-align: center;
      font-size: 19px;
      line-height: 2.19rem;
    }

    .title {
      margin-bottom: 2.63rem;
      font-size: 1rem;
    }

    .copyBtn {
      width: 12.63rem;
      height: 2.81rem;
      background-color: #f14e4e;
      border-radius: 1.41rem;
      margin: 0 auto;
      text-align: center;
      line-height: 2.81rem;
      color: #fff;
    }
  }

  .shoplist {
    background: #fff;
    margin-top: 0.34rem;
    overflow: hidden;
    padding-bottom: 2.6rem;

    .gopayBtn {
      width: 19.47rem;
      height: 2.84rem;
      background-color: #f14e4e;
      border-radius: 1.42rem;
      margin: 0 auto;
      text-align: center;
      color: #fff;
      line-height: 2.84rem;
      font-size: 1.13rem;
    }

    .conten_bottom {
      padding: 0 0.94rem;
      padding-top: 1.34rem;

      .price {
        display: flex;

        .first_money {
          color: #f14e4e;
          font-size: 1.75rem;

          span {
            font-size: 0.81rem;
          }
        }

        .lose_money {
          text-decoration: line-through;
          color: #c0c0c0;
          font-size: 1rem;
          line-height: 3rem;
          margin-left: 1.03rem;
        }
      }

      .conten_bottom_one {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .coupon::before {
          content: '';
          background: #fff;
          width: 0.62rem;
          height: 0.3rem;
          position: absolute;
          top: 0.8rem;
          left: -0.31rem;
          border-radius: 50%;
        }

        .coupon::after {
          content: '';
          background: #fff;
          width: 0.62rem;
          height: 0.3rem;
          position: absolute;
          top: 0.8rem;
          right: -0.31rem;
          border-radius: 50%;
        }

        .coupon {
          display: flex;
          background: #f14e4e;
          // width: 4.78rem;
          height: 1.91rem;
          align-items: center;
          border-radius: 0.25rem;
          position: relative;
          max-width: 30%;
          min-width: 4.78rem;

          .coupon_o {
            font-size: 0.81rem;
            color: #fff;
            margin-left: 0.69rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .line {
            width: 1px;
            border: 1px dashed #fff;
            height: 100%;
            margin-left: 0.56rem;
          }

          .coupon_t {
            font-size: 0.81rem;
            color: #fff;
            margin-left: 0.34rem;
            margin-right: 0.55rem;
          }
        }

        .conten_bottom_left {
          font-size: 1rem;
          width: 13.25rem;
          line-height: 1.5rem;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .shopimg {
      width: 23.44rem;
      height: 23.44rem;
      background: #c9c9c9;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .headTop {
    width: 100%;
    height: 2.78rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.94rem 0 0.91rem;
    position: fixed;
    top: 0;
    left: 0;
    background: #f6f6f6;
    z-index: 999;

    .left {
      display: flex;
      align-items: center;

      .img {
        width: 2.19rem;
        height: 2.19rem;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }

    .loadbtn {
      padding: 0.44rem 0.69rem 0.47rem 0.75rem;
      background-color: #f14e4e;
      border-radius: 1rem;
      font-size: 0.81rem;
      color: #fff;
    }
  }
}
</style>