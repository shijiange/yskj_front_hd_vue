<template>
  <div id="proclamation">
    <c-title :hide="false" :text="'厂家公告'"> </c-title>
    <div class="t_box">
      <div class="t_box_top"></div>
      <div class="t_box_img">
        <img :src="producer.logo_url" alt="" />
      </div>
      <div class="t_box_c">
        <span class="storename">{{ producer.producer_name }}</span>
        <div>
          <span class="adress">{{ producer.province_name }} {{ producer.city_name }} {{ producer.district_name }}</span>
          <span class="tell"
            >热销：<em class="tell_i">{{ producer.sell_total }}</em></span
          >
        </div>
        <div class="t_box_c_box">
          <!-- <div class="t_box_c_start" style="margin-right: 0.53rem">
            <van-icon name="star" :style="{ color: tapStart ? '#f14e4e' : '#c8c8c8' }" />
            <span>已收藏</span>
          </div> -->
          <div class="t_box_c_start" @click="showCard = true">
            <i class="iconfont icon-fontclass-zhizhao"></i>
            <span>店铺证照</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 0.63rem;"></div>
    <div class="pro">
      <div class="proImg">店铺公告</div>
      <div class="txt" v-html="producer.producer_notice"></div>
    </div>
    <div class="pro">
      <div class="proImg">退货说明</div>
      <div class="txt" v-html="producer.refund_explain"></div>
    </div>
    <van-popup v-model="showCard" :style="{ width: '100%', height: '100%', overflow: auto, background: '#f2f2f2' }" position="right">
      <van-nav-bar title="厂家店铺" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
      <div class="Cardimg">
        <div style="text-align: left;">营业执照</div>
        <div class="posI" @click="tapshowImg(producer.business_license_url)">
          <div v-for="(item, index) in producer.business_license_url" :key="index">
            <img :src="item" alt="" style="width: 9.63rem; max-height: 14.06rem;" />
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import proclamation_controller from "./proclamation_controller";

export default proclamation_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#proclamation {
  .Cardimg {
    margin: 1.2rem 1.53rem;
  }

  .posI {
    display: flex;
    margin-top: 0.91rem;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .pro {
    margin: 0.91rem 0.94rem 0.91rem;
    background: #fff;
    border-radius: 0.63rem;
    position: relative;
    padding: 2.59rem 0.91rem 1.31rem 0.94rem;

    .proImg {
      position: absolute;
      top: 0;
      left: 0;
      width: 6.72rem;
      height: 1.31rem;
      border-radius: 0.63rem 0 0 0;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/announcement@3x.png");
      background-repeat: no-repeat;
      background-size: contain;
      text-align: center;
      line-height: 1.31rem;
      font-size: 0.75rem;
      color: #fff;
    }

    .txt {
      text-align: left;
      margin-bottom: 0.75rem;
    }
  }

  /deep/.txt img {
    width: 100%;
  }

  .t_box {
    width: 100%;
    height: 12.81rem;
    background: #fff;

    .t_box_top {
      height: 5.09rem;
      width: 100%;
      background-image: linear-gradient(0deg, #f14e4e 0%, #ec5e25 100%);
    }

    .t_box_img {
      width: 4.38rem;
      height: 4.38rem;
      margin: -3.38rem auto;

      img {
        width: 4.38rem;
        height: 4.38rem;
      }
    }

    .t_box_c {
      margin-top: 5rem;
      display: flex;
      flex-direction: column;

      .storename {
        font-size: 1.06rem;
        color: #333;
      }

      .adress {
        font-size: 0.69rem;
        color: #333;
      }

      .tell {
        font-size: 0.69rem;
        color: #333;
        margin-left: 1.31rem;

        .tell_i {
          color: #f14e4e;
        }
      }

      .t_box_c_box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.81rem;

        .t_box_c_start {
          height: 1.44rem;
          border-radius: 0.13rem;
          border: solid 0.03rem #f14e4e;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.34rem 0.28rem;

          i {
            color: #f14e4e;
            margin-right: 0.19rem;
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
