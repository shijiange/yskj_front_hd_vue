<template>
  <div id="auction_love_detail">
    <c-title :hide="false" :text="'查看明细'">
    </c-title>
    <div class="tabs">
      <van-tabs v-model="activeName" @change="handleClick" :line-width="100" sticky>
        <van-tab title="全部">
          <ul class="all">
            <li v-for="(item,i) in recordsList" :key='i'>
              <div class="left">
                <h1>{{item.remark}}</h1>
                <p style="font-size: 13px;">{{name}}：{{item.present}}</p>
                <p style="font-size: 12px; color: #8c8c8c;">{{item.created_at}}</p>
              </div>
              <div class="right">
                <h1>{{item.change || 0}}</h1>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab :title="`${income_name_text}`">
          <ul class="all">
            <li v-for="(item,i) in recordsList" :key='i'>
              <div class="left">
                <h1>{{item.remark}}</h1>
                <p style="font-size: 13px;">{{name}}：{{item.present}}</p>
                <p style="font-size: 12px; color: #8c8c8c;">{{item.created_at}}</p>
              </div>
              <div class="right">
                <h1>{{item.change || 0}}</h1>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="支出">
          <ul class="all">
            <li v-for="(item,i) in recordsList" :key='i'>
              <div class="left">
                <h1>{{item.remark}}</h1>
                <p style="font-size: 13px;">{{name}}：{{item.present}}</p>
                <p style="font-size: 12px; color: #8c8c8c;">{{item.created_at}}</p>
              </div>
              <div class="right">
                <h1>{{item.change || 0}}</h1>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import auction_love_detail_controller from "./auction_love_detail_controller";

export default auction_love_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .all {
    margin-top: 0.5rem;
    background: #fff;
    width: 100%;

    li {
      display: flex;
      padding: 0.5rem 1rem;
      font-size: 16px;
      border-bottom: solid #efefef 1px;
    }

    p {
      padding-top: 0.3rem;
    }
  }

  .left {
    flex: 1;
    text-align: left;
  }

</style>
