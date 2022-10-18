<template>
  <section id="page">
    <c-title :hide="false" text="查看明细"></c-title>
    <van-tabs v-model="active_tab" @click="handleClick">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="income" :title="income_name_text"></van-tab>
      <van-tab name="pay" title="支出"></van-tab>
    </van-tabs>
    <div>
    <!-- <mt-tab-container v-model="active_tab"> -->
      <div v-show="active_tab=='all'">
        <van-pull-refresh v-model="isLoading" @refresh="all_loadTop" success-text="刷新成功" v-if="all_goload">
          <ul class="list" v-for="(item,i) in all_con" :key='i'>
            <li>
              <span>{{ item.source_name }}</span>
              <span>{{ item.change_value }}</span>
            </li>
            <li>
              <span>{{ item.created_at }}</span>
              <span>{{ item.value_type_name }}</span>
            </li>
          </ul>
        </van-pull-refresh>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="active_tab=='income'">
        <van-pull-refresh v-model="isLoading" @refresh="income_loadTop" success-text="刷新成功" v-if="income_goload">
          <ul class="list" v-for="(item,i) in income_con" :key='i'>
            <li>
              <span>{{ item.source_name }}</span>
              <span>{{ item.change_value }}</span>
            </li>
            <li>
              <span>{{ item.created_at }}</span>
              <span>{{ item.value_type_name }}</span>
            </li>
          </ul>
        </van-pull-refresh>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="active_tab=='pay'">
        <van-pull-refresh v-model="isLoading" @refresh="pay_loadTop" success-text="刷新成功" v-if="pay_goload">
          <ul class="list" v-for="(item,i) in pay_con" :key='i'>
            <li>
              <span>{{ item.source_name }}</span>
              <span>{{ item.change_value }}</span>
            </li>
            <li>
              <span>{{ item.created_at }}</span>
              <span>{{ item.value_type_name }}</span>
            </li>
          </ul>
        </van-pull-refresh>
      <!-- </mt-tab-container-item> -->
      </div>
    <!-- </mt-tab-container> -->
    </div>
  </section>
</template>

<script>
import look_details_coin_controller from "./look_details_coin_controller.js";
export default look_details_coin_controller;
</script>

<style lang="scss" rel="stylesheet/scss">
#page {
  .list {
    border-bottom: solid 0.0625rem #ebebeb;
    background-color: #fff;
    padding: 0.625rem 0.875rem;

    li {
      display: flex;
      justify-content: space-between;
      line-height: 1.5rem;
      font-size: 14px;
    }

    li:first-child {
      span:last-child {
        color: #f15353;
      }
    }

    li:last-child {
      color: #8c8c8c;
    }
  }
}
</style>
