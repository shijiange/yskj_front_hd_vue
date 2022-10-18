<template>
  <div id="cloudReleaseLog">
    <c-title :hide="false" :text="'查看详情'"> </c-title>
    <div class="lis" v-for="(item,index) in info" :key="index" >
      <div class="lis_top">
        <div class="lis_top_l">
          <span class="lis_top_l_t">{{item.buy_order.order_sn}}</span>
          <span class="lis_top_l_b">{{item.created_at}}</span>
        </div>
        <div class="lis_top_r">
          <span class="lis_top_r_t">订单金额</span>
          <span class="lis_top_r_m">+{{item.buy_order.price}}</span>
        </div>
      </div>
      <div class="lis_bottom">
        <div class="imgs">
          <img :src="item.buy_member.avatar_image" alt="" />
        </div>
        <span>{{item.buy_member.username}}</span>
      </div>
      <div style="height: 0.63rem;"></div>
    </div>
  </div>
</template>

<script>
import cloudReleaseLog_controller from './cloudReleaseLog_controller';

export default cloudReleaseLog_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#cloudReleaseLog {
  width: 100%;
  background: #fff;

  .lis {
    height: 8.06rem;
    width: 100%;
    padding: 1.03rem 0.94rem 0.88rem 0.94rem;
    display: flex;
    flex-direction: column;

    .lis_top {
      flex: 1;
      border-bottom: 0.09rem solid #ebebeb;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .lis_top_l {
        text-align: left;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        padding-bottom: 0.88rem;

        .lis_top_l_t {
          font-size: 0.81rem;
          color: #333;
        }

        .lis_top_l_b {
          font-size: 0.75rem;
          color: #8c8c8c;
        }
      }

      .lis_top_r {
        text-align: right;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: space-between;
        padding-bottom: 0.72rem;

        .lis_top_r_t {
          font-size: 0.75rem;
          color: #8c8c8c;
        }

        .lis_top_r_m {
          font-size: 1rem;
          color: #f15353;
        }
      }
    }

    .lis_bottom {
      display: flex;
      margin-top: 0.75rem;

      .imgs {
        width: 2.5rem;
        height: 2.53rem;
        background-color: #f2f2f2;
        border-radius: 50%;
        margin-right: 0.53rem;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>