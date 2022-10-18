<template>
  <div id="course">
    <c-title :hide="false" text="我的课程"></c-title>
    <div class="course-content">
      <div
        class="box01"
        v-for="item in myCourseInfo"
		:key='item.goods_id'
        @click="goToDetail(item.goods_id)"
      >
        <span
          slot="text"
          style="line-height: 2.5rem; text-align: left; font-size: 15px;"
          >订单号：{{ item.order_sn }}</span
        >
        <div style="display: flex;">
          <div class="image">
            <img :src="item.goods_thumb" style="width: 100%; height: 100%;" />
          </div>
          <div class="title">
            <span class="name" style="font-size: 15px;"
              >课程名称:{{ item.goods_title }}</span
            >
            <ul style="margin-top: 0.625rem;">
              <li style="color: #8c8c8c;">{{ item.created_at }}</li>
            </ul>
          </div>
          <i
            slot="icon"
            class="iconfont icon-bofang"
            style="float: right; line-height: 3rem; color: #ff9600; font-size: 1.25rem;"
          ></i>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>

<script>
import course_mycourse_controller from "./course_mycourse_controller";
export default course_mycourse_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.box01 {
  border-bottom: solid 0.0625rem #ebebeb;
  text-align: left;
  width: 100%;
  background-color: #fff;
  padding-bottom: 0.75rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.image {
  width: 5rem;
  height: 5rem;
  background-color: #333;
  float: left;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}

.title {
  float: left;
  margin-left: 0.625rem;

  .name {
    width: 16.125rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}

i {
  position: absolute;
  right: 1.25rem;
}

.clearfix {
  clear: both;
}
</style>
