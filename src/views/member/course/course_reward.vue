<template>
  <div id="course">
    <c-title :hide="false" text="我的打赏"></c-title>
    <div
      class="box01"
      v-for="(item,i) in rewardInfo"
      :key='i'
      @click="gotoDetail(item.goods_id)"
    >
      <span slot="text" style="line-height: 2.25rem; text-align: left;"
      >打赏时间：{{ item.created_at }}</span
      >
      <div style="margin-top: 0.25rem;">
        <div class="image">
          <img :src="item.goods_thumb" style="width: 100%; height: 100%;"/>
        </div>
        <div class="title">
          <span class="name" style="font-size: 15px;"
          >课程名称:{{ item.goods_title }}</span
          >
          <ul style="margin-top: 0.625rem;">
            <li style="float: left; color: #8c8c8c;">
              讲师：{{ item.lecturer_name }}
            </li>
            <li style="float: right; right: 0; color: #f15353;">
              {{ item.amount }}元
            </li>
          </ul>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
import course_reward_controller from "./course_reward_controller";

export default course_reward_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .box01 {
    text-align: left;
    width: 100%;
    background-color: #fff;
    padding-bottom: 0.75rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border-bottom: solid 0.0625rem #ebebeb;
  }

  .image {
    width: 5rem;
    height: 5rem;
    float: left;
  }

  .title {
    float: left;
    margin-left: 0.625rem;
    width: calc(100% - 5.625rem);

    .name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .clearfix {
    clear: both;
  }

  .box02 {
    margin-top: 0.625rem;
    text-align: left;
    width: 100%;
    background-color: #fff;
    padding: 0 0.75rem 1rem 0.75rem;
  }
</style>
