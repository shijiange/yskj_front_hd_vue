<template>
  <div id="course" v-show="loading">
    <c-title :hide="false" text="我的课程"></c-title>

    <van-cell-group>
      <van-cell @click.native="gotoVip" id="header" center>
        <div slot="title" class="touxiang">
          <img :src="memberInfo.avatar" style="width: 100%; height: 100%; border-radius: 1.5625rem;" />
        </div>
        <span slot="title" style="font-weight: bold; text-align: left;">
          {{ memberInfo.nickname }}
        </span>
        <span slot="default">会员等级:{{ memberInfo.level_name }}</span>
      </van-cell>
    </van-cell-group>

    <div class="box">
      <router-link :to="fun.getUrl('CourseMy')">
        <div class="list">
          <van-icon slot="icon" class="iconfont icon-member-mycourse1" size="1.625rem" color="#f15353" style="margin-right: 0.375rem; transform: translateY(2px);"></van-icon>
          <span>我的课程</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </router-link>
      <router-link :to="fun.getUrl('CourseHistory')">
        <div class="list">
          <van-icon slot="icon" class="iconfont icon-member-history1" size="1.625rem" color="#f15353" style="margin-right: 0.375rem; transform: translateY(2px);"></van-icon>
          <span>课程观看历史</span>
          <i class="fa fa-angle-right"></i>
          <span style="float: right; margin-right: 0.375rem; color: #8c8c8c; font-size: 14px;">更多</span>
        </div>
      </router-link>
      <router-link :to="fun.getUrl('CourseReward')">
        <div class="list">
          <van-icon slot="icon" class="iconfont icon-member-reward2" size="1.625rem" color="#f15353" style="margin-right: 0.375rem; transform: translateY(2px);"></van-icon>
          <span>我的打赏</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </router-link>
      <router-link :to="fun.getUrl('CourseIndex', { fromHome: 1 })">
        <div class="list" id="last">
          <van-icon slot="icon" class="iconfont icon-member-course3" size="1.625rem" color="#f15353" style="margin-right: 0.375rem; transform: translateY(2px);"></van-icon>
          <span>全部课程</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import course_manage_controller from "./course_manage_controller";
export default course_manage_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#header {
  padding: 1.25rem;
  background-color: #f15353;
  line-height: 1rem;

  span {
    color: #fff;
  }
}

.touxiang {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  margin-right: 0.625rem;
  border: solid 0.125rem #fff;
  overflow: hidden;
  flex-shrink: 0;
}

#last {
  border: none;
}

.box {
  background-color: #fff;
  width: 100%;

  .list {
    font-size: 15px;
    height: 2.75rem;
    line-height: 2.75rem;
    border-bottom: solid 0.0625rem #ebebeb;
    margin-left: 0.875rem;
    padding-right: 0.875rem;
    text-align: left;
    display: flex;
    align-items: center;

    i.fa.fa-angle-right {
      line-height: 2.75rem;
      font-size: 1.5rem;
      color: #c9c9c9;
      float: right;
      position: absolute;
      right: 0.875rem;
    }

    span:last-child {
      position: absolute;
      right: 1.625rem;
    }
  }
}

#header .van-cell__title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
