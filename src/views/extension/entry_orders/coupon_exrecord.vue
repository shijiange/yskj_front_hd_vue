<template>
  <div>
    <c-title :hide="false"
             :text="integral ? integral : '获得记录'"> </c-title>
    <div class="contaier">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul>
          <li v-for="item in info"
              :key="item.id">
            <div class="leftBox">
              <p class="title"
                 style="-webkit-box-orient: vertical;">{{item.mark}}</p>
              <p class="time">{{item.created_at}}</p>
            </div>
            <div class="NumBox">
              {{item.type_name}}
            </div>
          </li>
          <p style="margin: 1.5rem 0; color: #9e9e9e;"
             v-if="isNoMore">没有更多</p>
          <img v-if="fun.isTextEmpty(info)"
               src="../../../assets/images/blank.png"
               alt=""
               style="width: 5rem; margin-top: 5rem;">
        </ul>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import coupon_exrecord_controller from "./coupon_exrecord_controller";

export default coupon_exrecord_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.contaier {
  ul {
    min-height: 90vh;

    li {
      width: 23.44rem;
      height: 4.63rem;
      background-color: #fff;
      display: flex;
      border-bottom: 0.0625rem solid #e8e8e8;
      padding: 0.4rem 1rem;

      .leftBox {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;

        .title {
          width: 100%;
          font-size: 0.875rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .time {
          color: #9e9e9e;
        }
      }

      .NumBox {
        flex: 1;
        line-height: 4.63rem;
        text-align: right;
        font-size: 0.9325rem;
        color: #f15353;
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
}
</style>
