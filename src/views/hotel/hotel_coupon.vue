<template>
    <div id="open_member">
        <c-title :hide="false" text='酒店优惠券'></c-title>
        <div id="content">
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
                <div class="coupon_box" v-for="(item,index) in cupconList" @click="getCoupon(item.id,index)" :key='index'>
                    <ul class="coupon_a">
                        <li>{{item.name}}</li>
                        <li>满{{item.enough}}元使用</li>
                        <li>可领取张数：{{item.available_count}}张</li>
                        <li>已领取张数：{{item.receive_count}}张</li>
                    </ul>
                    <div class="coupon_b">
                        <p v-if="item.coupon_method==1"><span>{{$i18n.t('money')}}</span>{{item.deduct}}</p>
                        <p v-if="item.coupon_method==2"><span>{{item.discount}}</span>折</p>
                        <button type="button" v-if="item.received==2">立即领取</button>
                        <button type="button" v-if="item.received==1">已领取</button>
                    </div>
                </div>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script>
import controller from "./hotel_coupon_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #open_member {
    background: #fff;
    min-height: 41.25rem;

    #content {
      .coupon_box {
        width: 21.5625rem;
        height: 6.25rem;
        margin: 1.25rem auto;
        background-image: url(../../assets/images/o2o_coupon.png);
        background-repeat: no-repeat;
        background-size: 100%;
        color: #ffb84c;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .coupon_a {
          width: 15.3125rem;
          padding: 0 1.25rem;

          li {
            line-height: 1.25rem;
            text-align: left;
            font-size: 13px;
          }
        }

        .coupon_b {
          width: 6.25rem;

          p {
            font-size: 20px;
            line-height: 2.25rem;

            span {
              font-size: 16px;
            }
          }

          button {
            width: 4.25rem;
            height: 1.625rem;
            border-radius: 1.875rem;
            background: #ffb84c;
            color: #fff;
            border: none;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
