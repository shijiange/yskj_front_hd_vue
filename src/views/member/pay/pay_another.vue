<template>
    <div id="pay-another">
        <c-title :hide="false" text='代付'></c-title>
        <!-- <div class="top-spare"></div> -->
        <div class="pay-box">
            <div class="order-info"><span>订单信息</span></div>
            <!-- <div class="pay-pro">
                    <div class="img"><img data-v-2c15d270="" src="http://release.yunzshop.com/attachment/images/2/2017/11/x3bW9mI3DLwl3LpG3dpi97wC51WCIe.jpg"></div>
                    <div class="title">
                        <div class="top">
                            <span class="title-left">智能空气净化器F700家用卧室客厅除甲醛去雾霾PM2.5烟尘</span><br>
                            <span class="title-right">{{$i18n.t('money')}}100.00</span><br>
                        </div>
                        <div class="bottom">
                            <span class="title-left">规格</span><br>
                            <span class="title-right">+1</span>
                        </div>
                    </div>
                </div> -->
            <div v-for="(items,i) in goodList" :key='i'>
                <div class="pay-pro" v-for="(item,i) in items.has_many_order_goods" :key='i'>
                    <div class="img"><img :src="item.thumb"></div>
                    <div class="title">
                        <div class="top">
                            <span class="title-left">{{item.title|escapeTitle}}</span><br>
                            <span class="title-right">{{$i18n.t('money')}}{{item.price}}</span><br>
                        </div>
                        <div class="bottom">
                            <span class="title-left">规格:{{item.goods_option_title}}</span><br>
                            <span class="title-right">x{{item.total}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pay-sum"><span>共{{totalNum}}件商品&nbsp;&nbsp;实付：{{$i18n.t('money')}}<span class="money">{{totalPrice}}</span></span>
            </div>
        </div>
        <div class="massage-box">
            <van-steps :active="0" inactive-icon="arrow" active-icon="success">
                <van-step>留言并分享</van-step>
                <van-step>好友参与并付款</van-step>
                <van-step>代付成功</van-step>
            </van-steps>
            <textarea name="留言给好友" id="" cols="30" rows="10" v-model.lazy="shareContent"></textarea>
        </div>
        <div class="bottom-but">
            <Button v-if="!isMiniprogram" @click="shareTip">找小伙伴帮忙付款</Button>
            <Button v-if="isMiniprogram" @click="miniPay">找小伙伴帮忙付款</Button>
        </div>
    </div>
</template>

<script>
import pay_another_controller from './pay_another_controller';
export default pay_another_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .top-spare {
    width: 100%;
    height: 2.75rem;
  }

  .pay-box {
    background-color: #fff;
    border-top: solid 0.0625rem #e2e2e2;
    border-bottom: solid 0.0625rem #e2e2e2;
    width: 100%;
    padding: 0 0.75rem;

    .order-info {
      width: 100%;
      border-bottom: solid 0.0625rem #e2e2e2;
      display: flex;
    }

    .order-info span {
      line-height: 2.75rem;
      text-align: start;
      font-size: 14px;
      color: #333;
    }

    .pay-pro {
      width: 100%;
      margin-top: 0.75rem;
      display: flex;
      border-bottom: solid 0.0625rem #e2e2e2;
      padding-bottom: 0.75rem;

      .img {
        flex: 1;
        width: 4rem;
        height: 5.5rem;
        background-color: green;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        flex: 3;
        margin-left: 0.625rem;
        font-size: 14px;

        .top {
          display: flex;
          width: 100%;

          .title-left {
            flex: 3;
            text-align: left;
          }

          .title-right {
            flex: 1;
            text-align: right;
          }
        }

        .bottom {
          display: flex;
          margin-top: 0.625rem;
          width: 100%;
          color: #888;

          .title-left {
            flex: 3;
            text-align: left;
          }

          .title-right {
            flex: 1;
            text-align: right;
          }
        }
      }
    }

    .pay-sum {
      line-height: 2.75rem;
      text-align: right;
      font-size: 14px;

      .money {
        font-weight: bold;
        color: #f15353;
        font-size: 18px;
      }
    }
  }

  .massage-box {
    border-bottom: solid 0.0625rem #e2e2e2;
    border-top: solid 0.0625rem #e2e2e2;
    margin-top: 0.25rem;
    background-color: #fff;
    width: 100%;
    padding: 1.25rem 0.625rem 0.625rem;

    textarea {
      background-color: #f9f9f9;
      border: solid 0.0625rem #e2e2e2;
      border-radius: 0.25rem;
      width: 100%;
      line-height: 1.5rem;
      height: 6.25rem;
      color: #333;
      margin-top: 1.25rem;
      padding-left: 0.375rem;
    }
  }

  .bottom-but {
    padding: 0 0.9375rem;

    button {
      border: none;
      width: 100%;
      height: 2.25rem;
      line-height: 2.25rem;
      background-color: #f15353;
      border-radius: 0.25rem;
      color: #fff;
      font-size: 14px;
      margin-top: 0.625rem;
    }
  }
</style>
