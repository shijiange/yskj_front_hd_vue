<template>
  <div id="get_record">
    <c-title :hide="false" :text="'领取记录'">
    </c-title>
    <div id="content">
      <ul class="list" v-for="(list,i) in dataList" :key='i'>
        <li>
          <span>{{list.name}}</span>
          <span>+{{list.point}}</span>
        </li>
        <li>
          <span>{{list.created_at}}</span>
          <span v-show="list.validity_at">有效期至{{list.validity_at}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import integral_get_record_controller from "./integral_get_record_controller";

export default integral_get_record_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #get_record {
    #content {
      padding-top: 0.625rem;

      .list {
        background-color: #fff;
        padding: 0.625rem 0.875rem;
        border-bottom: solid 0.0625rem #ebebeb;

        li {
          font-size: 14px;
          line-height: 1.875rem;
          display: flex;
          justify-content: space-between;
        }

        li:first-child {
          font-size: 16px;

          span:last-child {
            color: #f15353;
          }
        }

        li:last-child {
          color: #8c8c8c;
          font-size: 12px;
        }
      }
    }
  }
</style>