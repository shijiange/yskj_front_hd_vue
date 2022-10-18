<template>
  <div id="profit">
    <c-title :hide="false" :text='WXtitle'></c-title>
    <div id="content">
      <ul class="sum">
        <li>
          <span>累计金额</span>
          <span>{{shop_amount}}{{$i18n.t('元')}}</span>
        </li>
      </ul>
      <div class="list_box">
        <ul class="list" v-for="(item,i) in shopListArr" :key='i'>
          <li>
            <span>{{item.bonus_name}}</span>
            <span>{{$i18n.t('money')}}{{item.amount}}</span>
          </li>
          <li>
            <span>{{item.created_at}}</span>
            <span>{{item.status_name}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import profit from "./Profit.js";

export default profit;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #profit {
    #content {
      .sum {
        background-color: #f15353;
        padding: 0.625rem 0.875rem;

        li {
          color: #fff;
          font-size: 18px;
          line-height: 2.5rem;
          display: flex;
          justify-content: space-between;
          font-weight: bold;
        }
      }

      .list_box {
        background-color: #fff;

        .list {
          padding: 0.625rem 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;

          li {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
          }

          li:first-child {
            line-height: 1.875rem;

            span:last-child {
              color: #f15353;
            }
          }

          li:last-child {
            line-height: 1.5rem;

            span:first-child {
              color: #8c8c8c;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
</style>
