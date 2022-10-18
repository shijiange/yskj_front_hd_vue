<template>
  <div id="all">
    <c-title :hide="false"
             text='活动报名'
             tolink='MeetingIndex'
             totext='报名记录'></c-title>

    <template v-for=" (item,index) in conference">
      <div id="member" :key="index">
        <div id="tool">
          <h3 class="c-content">{{item.title}}</h3>
          <ul style="max-height: 17rem; overflow: hidden;">
            <li>
              <dt v-if="item.thumb"><img :src="item.thumb"
                     style="height: 0 auto;" /></dt>
              <dt v-if="!item.thumb"><img src="../../assets/images/coupon.png" /></dt>
            </li>
          </ul>

          <h3>
            <span>活动时间</span><span style="float: right; font-size: 12px; color: #1cc015;">{{item.starttime}} 至 {{item.endtime}}</span>
          </h3>
          <!-- 未报名 -->
          <template v-if="item.is_enrol==0">
            <!-- 未报名 未结束-->
            <h3 class="c-button"
                v-if="item.is_end==0&&item.max_limit!=item.total">
              <router-link class="y8"
                           :to="fun.getUrl('activity', {id:item.id})">
                <van-button size="small"
                           type="primary">我要报名</van-button>
              </router-link>
            </h3>
            <!-- 未报名 未结束 已满园-->
            <h3 class="c-button"
                v-else-if="item.is_end==0&&item.max_limit==item.total">
              <van-button size="small"
                         type="primary"
                         disabled>报名人数已满，请等待下次活动或者选择其他活动</van-button>
            </h3>
            <!-- 未报名 已结束-->
            <h3 class="c-button"
                v-else-if="item.is_end==1">
              <van-button size="small"
                         type="primary"
                         disabled>活动已过期，请等待下次活动或者选择其他活动</van-button>
            </h3>
          </template>
          <!-- 已报名 -->
          <template v-else-if="item.is_enrol==1">
            <!-- 已报名 未结束-->
            <h3 class="c-button"
                v-if="item.is_end==0">
              <van-button size="small"
                         type="primary"
                         @click="onActivityInfo(item.id)">已报名，点击查看报名信息</van-button>
            </h3>
            <!-- 已报名 已结束-->
            <h3 class="c-button"
                v-else-if="item.is_end==1">
              <van-button size="small"
                         type="primary"
                         disabled>活动已过期，请等待下次活动或者选择其他活动</van-button>
            </h3>
          </template>

        </div>
        <div style="height: 0.625rem; clear: both;"></div>
      </div>
    </template>

  </div>
</template>

<script>
import home from "./home_controller";
export default home;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/member.scss";

#tool {
  h3 {
    font-size: 14px;
    line-height: 2.25rem;
    padding: 0 0.875rem;
    border-bottom: solid 0.0625rem #ebebeb;

    span {
      font-weight: normal;
    }
  }
}

.c-content {
  font-size: 14px;
  font-weight: bold;
  border-top: 0.0625rem solid #ebebeb;
  line-height: 2.5rem !important;
  height: 2.5rem !important;
}

.c-button {
  display: -webkit-box;
  justify-content: center;

  button {
    margin: 0.625rem 0;
  }
}

.mint-button--danger {
  color: #fff;
  background-color: #1cc015;
}

#tool ul li {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
}

#tool ul li img {
  width: 100% !important;
  // height:34vw !important;
}
</style>
