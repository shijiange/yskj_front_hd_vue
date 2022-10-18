<template >
  <div id="enroll-enter"
       v-if="activity.title">
    <c-title :hide="false"
             :text='activity.title'></c-title>
    <div class="goods_info">
      <div class="goodsImg">
        <img :src="activity.thumb"
             alt="">
      </div>
      <ul class="goods_text">
        <li class="sum_time">
          <span class="cash"
                v-if="activity.cash>0.00"><b>¥</b>{{activity.cash}}</span>
          <span class="left"
                v-if="activity.cash<=0.00">免费</span>
          <span class="right">{{timestampToTime(activity.registration_end_time)}}截至</span>
        </li>
        <li class="name"
            style="-webkit-box-orient: vertical;">{{activity.title}}</li>
        <li class="state wait"
            v-show="now<activity.registration_time">
          <span class="pag">待开始</span>
        </li>
        <li class="state now"
            v-show="activity.registration_time<=now&&now<activity.registration_end_time">
          <span class="pag">报名中</span><span>已报名<font>{{count}}</font>/{{activity.limit||0}}</span>
        </li>
        <li class="state over"
            v-show="now>=activity.registration_end_time">
          <span class="pag">已结束</span><span>已报名<font>{{count}}</font>/{{activity.limit||0}}</span>
        </li>
      </ul>
    </div>
    <ul class="info_list">
      <li>
        <i class="iconfont icon-seller-time"></i>
        <span>{{timestampToTime(activity.start_time)}}至{{timestampToTime(activity.end_time)}}</span>
      </li>
      <li v-if="activity.address"
          @click="goToAdress">
        <i class="iconfont icon-seller-position"></i>
        <span>{{activity.address}}</span>
        <i class="fa fa-angle-right"></i>
      </li>
      <li @click="toLecturer(activity)"
          v-if="activity.is_lecturer">
        <i class="iconfont icon-detail_teacher"></i>
        <span>{{activity.has_one_lecturer?activity.has_one_lecturer.real_name:''}}</span>
        <i class="fa fa-angle-right"></i>
      </li>
      <li v-if="activity.is_lecturer">
        <a :href="'tel:' + mobile">
          <i class="iconfont icon-seller_phone"></i>
          <span>{{activity.has_one_lecturer?activity.has_one_lecturer.mobile:''}}</span>
        </a>
      </li>
    </ul>
    <div class="enroll_condition">
      <div class="title_box">
        <h2>报名情况</h2>
        <span @click="toSituation">查看详情</span>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="enroll_user">
        <div class="user_list">
          <div v-for="(item,index) in num"
               :key="index">
            <div class="user_box"
                 v-if="item.has_one_order&&item.has_one_order.status>=1 && item.has_one_member">
              <div class="user">
                <img :src="item.has_one_member.avatar_image">
              </div>
              <span>{{item.has_one_member.nickname}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="enroll_detail">
      <div class="title_box">
        <h2>活动详情</h2>
      </div>
      <div class="detail_con">
        <p v-html="activity.content"></p>
      </div>
    </div>
    <div class="bottom_btn"
         :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <ul class="icon_btn">
        <li @click="toHome">
          <img src="../../assets/images/activities/detail_home@2x.png">
          <span>首页</span>
        </li>
        <li @click="toMe">
          <img src="../../assets/images/activities/detail_my@2x.png">
          <span>我的</span>
        </li>
        <li v-if="!status"
            @click="addPeention">
          <img src="../../assets/images/activities/detail_follow@2x.png">
          <span>关注</span>
        </li>
        <li v-if="status"
            @click="cancel">
          <img src="../../assets/images/activities/detail_follow_cur@2x.png">
          <span>已关注</span>
        </li>
      </ul>
      <button type="button"
              class="now"
              @click="toEnroll"
              v-show="activity.registration_time<=now&&now<activity.registration_end_time">立即报名</button>
      <button type="button"
              class="over"
              v-show="now>=activity.registration_end_time">报名已结束</button>
      <button type="button"
              class="wait"
              v-show="now<activity.registration_time">报名待开始</button>
    </div>
  </div>
</template>

<script>
import enroll_entercontroller from './enroll_entercontroller';
export default enroll_entercontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#enroll-enter {
  padding-bottom: 60px;

  .goods_info {
    background: #fff;

    .goodsImg {
      width: 100%;
      height: 12.5rem;
      overflow: hidden;
      background: #f2f2f2;

      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .goods_text {
      padding: 0.625rem 0.9375rem;

      .sum_time {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.625rem;
        align-items: center;

        .left {
          color: #f15353;
          font-size: 18px;
          font-weight: bold;
        }

        .cash {
          color: #f15353;
          font-size: 16px;

          b {
            font-size: 12px;
          }
        }

        .right {
          font-size: 14px;
          color: #3bb35d;
        }
      }

      .name {
        font-size: 16px;
        line-height: 1.25rem;
        max-height: 2.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-align: left;
      }

      .state {
        margin-top: 0.625rem;
        text-align: left;
        display: flex;
        align-items: center;
        font-size: 14px;

        font {
          color: #f15353;
        }
      }

      .now {
        .pag {
          background-color: rgba(59, 179, 93, 0.1);
          border-radius: 0.25rem;
          padding: 2px 8px;
          color: #3bb35d;
          font-size: 14px;
          margin-right: 0.625rem;
        }
      }

      .over {
        .pag {
          background-color: rgba(255, 49, 38, 0.1);
          border-radius: 0.25rem;
          padding: 2px 8px;
          color: #ff3126;
          font-size: 14px;
          margin-right: 0.625rem;
        }
      }

      .wait {
        .pag {
          background-color: rgba(255, 177, 38, 0.1);
          border-radius: 0.25rem;
          padding: 2px 8px;
          color: #ffb126;
          font-size: 14px;
          margin-right: 0.625rem;
        }
      }
    }
  }

  .info_list {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0.625rem 0.5rem;

    li {
      display: flex;
      align-items: center;
      font-size: 14px;
      position: relative;
      line-height: 2.25rem;

      .iconfont {
        color: #999;
        font-size: 24px;
        margin-right: 0.25rem;
      }

      .fa {
        position: absolute;
        right: 0;
        font-size: 1.25rem;
        color: #999;
      }

      a {
        display: flex;
        align-items: center;
      }
    }
  }

  .enroll_condition {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0.625rem 0.9375rem;

    .title_box {
      line-height: 1.875rem;
      display: flex;
      align-items: center;
      position: relative;

      h2 {
        font-size: 16px;
        font-weight: bold;
      }

      span {
        font-size: 14px;
        color: #999;
        position: absolute;
        right: 1.25rem;
      }

      .fa {
        font-size: 20px;
        color: #999;
        position: absolute;
        right: 0;
      }
    }

    .enroll_user {
      margin-top: 0.625rem;

      .user_list {
        display: flex;
        // flex-wrap: wrap;
        .user_box {
          width: 4.3125rem;

          .user {
            width: 3rem;
            height: 3rem;
            background: #f2f2f2;
            border: solid 0.0625rem #f5f5f5;
            border-radius: 3rem;
            overflow: hidden;
            margin: 0.375rem auto;

            img {
              width: 100%;
            }
          }

          span {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: block;
          }
        }
      }
    }
  }

  .enroll_detail {
    background: #fff;
    margin-top: 0.625rem;
    padding: 0.625rem 0.9375rem;

    .title_box {
      line-height: 1.875rem;
      display: flex;
      align-items: center;
      position: relative;

      h2 {
        font-size: 16px;
        font-weight: bold;
      }

      span {
        font-size: 14px;
        color: #999;
        position: absolute;
        right: 1.25rem;
      }

      .fa {
        font-size: 20px;
        color: #999;
        position: absolute;
        right: 0;
      }
    }

    .detail_con {
      margin-top: 0.625rem;
      text-align: left;
      width: 100%;
    }
  }

  .bottom_btn {
    box-shadow: 0 -0.0625rem 0.25rem rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 3.0625rem;
    background: #fff;
    position: fixed;
    bottom: 0;
    display: flex;

    .icon_btn {
      width: 14.5rem;
      padding: 0.25rem 0.9375rem;
      display: flex;
      justify-content: space-around;

      img {
        width: 1.5rem;
        height: 1.5rem;
        display: block;
      }

      span {
        display: block;
        font-size: 12px;
        color: #666;
      }
    }

    .now {
      width: 8.9375rem;
      border: none;
      background: #f15353;
      color: #fff;
      font-size: 16px;
    }

    .over {
      width: 8.9375rem;
      border: none;
      background: #999;
      color: #fff;
      font-size: 16px;
    }

    .wait {
      width: 8.9375rem;
      border: none;
      background: rgba(241, 83, 83, 0.5);
      color: #fff;
      font-size: 16px;
    }

    &.pcStyle {
      width: 375px;
    }
  }
}
</style>
