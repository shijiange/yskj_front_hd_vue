<template>
  <div id="my_earnings">
    <c-title :hide="false" :text="'领取收益'">
    </c-title>
    <div id="content">
      <h1>未领取收益</h1>
      <div class="earnings_box">
        <ul @click="toEarningList(item)" v-for="(item,i) in all_amount" :key='i'>
          <i :class="item.icon"></i>
          <li>{{item.title}}</li>
          <li>{{$i18n.t('money')}}{{item.amount}}{{$i18n.t('元')}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import my_earnings_controller from "./my_earnings_controller";

export default my_earnings_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #my_earnings {
    #content {
      height: 39.1875rem;
      background-color: #fff;

      h1 {
        background-color: #fafafa;
        font-size: 16px;
        padding: 0 0.875rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: left;
      }

      .earnings_box {
        display: flex;
        flex-wrap: wrap;

        ul {
          width: 33.33%;
          margin-top: 1.25rem;

          img {
            width: 3.75rem;
            height: 3.75rem;
            margin-bottom: 0.25rem;
          }

          i {
            display: inline-block;
            width: 3.75rem;
            height: 3.75rem;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 3.75rem 3.75rem;
            margin-bottom: 0.25rem;
          }

          li:nth-child(2) {
            font-size: 16px;
            line-height: 1.5rem;
          }

          li:last-child {
            font-size: 16px;
            color: #ff8b4a;
            line-height: 1.5rem;
          }

          .income_a {
            background-image: url("../../../assets/images/income_a.png");
          }

          .income_b {
            background-image: url("../../../assets/images/income_b.png");
          }

          .income_c {
            background-image: url("../../../assets/images/income_c.png");
          }

          .income_d {
            background-image: url("../../../assets/images/income_d.png");
          }
        }
      }
    }
  }
</style>
