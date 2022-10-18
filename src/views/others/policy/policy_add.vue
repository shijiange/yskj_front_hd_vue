<template>
  <div>
    <c-title :hide="false" :text="'保单添加'"></c-title>
    <van-search
      v-model="value"
      shape="round"
      background="#ffffff"
      class="bd_search"
      placeholder="请搜索保险公司"
    />
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell title="中国人寿" class="list_text" clickable @click="radio = '1'">
          <van-radio slot="right-icon" name="1"/>
        </van-cell>
        <van-cell title="中国人寿" class="list_text" clickable @click="radio = '2'">
          <van-radio slot="right-icon" name="2"/>
        </van-cell>
        <van-cell title="中国人寿" class="list_text" clickable @click="radio = '3'">
          <van-radio slot="right-icon" name="3"/>
        </van-cell>
        <van-cell title="中国人寿" class="list_text" clickable @click="radio = '4'">
          <van-radio slot="right-icon" name="4"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>

<script>
import policy_add_controller from "./policy_add_controller";
import Vue from "vue";
import { Search } from "vant";

Vue.use(Search);
export default policy_add_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  /* .bd_search { */

  /* } */

  .list_text {
    flex: none;
    position: initial;
    display: -webkit-flex;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f7;
  }

  .list_text div {
    flex: none;
  }
</style>
