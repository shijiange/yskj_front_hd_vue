<template>
  <div class="page" :style="{ '--themeColor': activity.background_color }">
    <c-title :hide="false" :text="'盲盒'"> </c-title>
    <div class="head" :class="{ headMr: activity.top_img_src == '' }">
      <img :src="activity.top_img_src" alt="" />
      <div class="isTitle" v-if="activity.title_show == 1">{{ activity.activity_name }}</div>
    </div>
    <div class="postionBtn">
      <div class="posBtn themeDiyBackground" @click="gotoOrderList">我的订单</div>
      <div class="posBtn themeDiyBackground" @click="contactShow = true" style="margin-top: 0.813rem;">联系商家</div>
    </div>
    <div class="contenBox themeDiyBackground">
      <div class="hepl">
        <div class="face">
          <img :src="member.avatar_image" alt="" />
        </div>
        <div class="name">{{ member.nickname }}</div>
        <div class="info">帮助好友助力也可以获取盲盒</div>
        <div class="time" v-if="assist.status == 0">
          <van-count-down :time="(assist.expire - currentTime) * 1000" class="text" format="HH时mm分ss秒"></van-count-down>
          <span>后失效</span>
        </div>
        <div class="btn" v-if="assist.status == 0" @click="heplAssist">帮他助力</div>
        <div class="btn disabled" v-if="assist.status == 1 || assist.status == 2">好友已完成助力</div>
        <div class="btn disabled" v-if="assist.status == -1">助力已失效</div>
      </div>

      <div class="planDetail">
        <div class="isPlan">
          <div class="circle" style="width: 0.188rem; height: 0.188rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.406rem; height: 0.406rem; margin-left: 0; margin-right: 0.438rem;"></div>
          好友进度{{ assist.assist_log_count }}/{{ assist.invitation }}人
          <div class="circle" style="width: 0.406rem; height: 0.406rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.188rem; height: 0.188rem; margin-left: 0; margin-right: 0.438rem;"></div>
        </div>
        <div class="isPlanConten">
          <div class="fans">
            <template v-if="assist.assist_log.length > 0">
              <div class="fansUser" v-for="item in assist.assist_log" :key="item.member_id">
                <img :src="item.member.avatar_image" alt="" />
                <div class="fansName" style="flex: 1;">{{ item.member.nickname }}</div>
              </div>
            </template>
            <div class="planNot" v-else>暂无好友助力~</div>
          </div>
        </div>
      </div>
    </div>

    <van-overlay :show="contactShow" @click="contactShow = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="contactShow" @click.stop>
            <div class="contactWrapper themeDiyBackground">
              <div class="thumb">
                <img :src="activity.cservice_code_src" alt="" />
              </div>
              <div class="tips">长按识别二维码联系我们</div>
              <div class="btnPhone">
                <a :href="`tel:${activity.cservice_phone}`">
                  <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxContact.png" alt="" />
                </a>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="contactShow = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <van-overlay :show="friendsShow" @click="friendsShow = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="friendsShow" @click.stop>
            <div class="friendsWrapper themeDiyBackground">
              <div class="success">
                <i class="iconfont icon-pm_auction_success"></i>
                <span>好友助力成功</span>
              </div>
              <div class="thumb">
                <img :src="activity.activity_img_src" alt="" />
              </div>
              <div class="tips">恭喜你获得<span style="color: #f52100;">免费抽取盲盒</span>的机会</div>
              <div class="see" @click="gotoDetails">《查看活动》</div>
              <div class="btnPhone" @click="generateAssist"><img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxFriends.png" alt="" /></div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="friendsShow = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import blindBoxHelping from "./blindBoxHelping_controller";
export default blindBoxHelping;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
}

.themeDiyBackground {
  background-color: var(--themeColor) !important;
  transition: 0.5s;
}

.themeDiyColor {
  color: var(--themeColor) !important;
  transition: 0.5s;
}

.themeDiyBorder {
  border-color: var(--themeColor) !important;
  transition: 0.5s;
}

.head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &.headMr {
    height: 8.75rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindHead.png");
    background-size: 100% 100%;
    background-color: #7f88d9;
  }

  img {
    width: 100%;
    object-fit: contain;
  }
}

.isTitle {
  position: absolute;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 4px 4px 0 #fda610, 4px -4px 0 #fda610, -4px -4px 0 #fda610, -4px 4px 0 #fda610, 4px 3px 0 #fda610, 4px -3px 0 #fda610, -4px -3px 0 #fda610, -4px 3px 0 #fda610, 4px 2px 0 #fda610,
    4px -2px 0 #fda610, -4px -2px 0 #fda610, -4px 2px 0 #fda610, 4px 1px 0 #fda610, 4px -1px 0 #fda610, -4px -1px 0 #fda610, -4px 1px 0 #fda610, 4px 0 0 #fda610, 4px 0 0 #fda610, -4px 0 0 #fda610,
    -4px 0 0 #fda610, 3px 4px 0 #fda610, 3px -4px 0 #fda610, -3px -4px 0 #fda610, -3px 4px 0 #fda610, 3px 3px 0 #fda610, 3px -3px 0 #fda610, -3px -3px 0 #fda610, -3px 3px 0 #fda610, 3px 2px 0 #fda610,
    3px -2px 0 #fda610, -3px -2px 0 #fda610, -3px 2px 0 #fda610, 3px 1px 0 #fda610, 3px -1px 0 #fda610, -3px -1px 0 #fda610, -3px 1px 0 #fda610, 3px 0 0 #fda610, 3px 0 0 #fda610, -3px 0 0 #fda610,
    -3px 0 0 #fda610, 2px 4px 0 #fda610, 2px -4px 0 #fda610, -2px -4px 0 #fda610, -2px 4px 0 #fda610, 2px 3px 0 #fda610, 2px -3px 0 #fda610, -2px -3px 0 #fda610, -2px 3px 0 #fda610, 2px 2px 0 #fda610,
    2px -2px 0 #fda610, -2px -2px 0 #fda610, -2px 2px 0 #fda610, 2px 1px 0 #fda610, 2px -1px 0 #fda610, -2px -1px 0 #fda610, -2px 1px 0 #fda610, 2px 0 0 #fda610, 2px 0 0 #fda610, -2px 0 0 #fda610,
    -2px 0 0 #fda610, 1px 4px 0 #fda610, 1px -4px 0 #fda610, -1px -4px 0 #fda610, -1px 4px 0 #fda610, 1px 3px 0 #fda610, 1px -3px 0 #fda610, -1px -3px 0 #fda610, -1px 3px 0 #fda610, 1px 2px 0 #fda610,
    1px -2px 0 #fda610, -1px -2px 0 #fda610, -1px 2px 0 #fda610, 1px 1px 0 #fda610, 1px -1px 0 #fda610, -1px -1px 0 #fda610, -1px 1px 0 #fda610, 1px 0 0 #fda610, 1px 0 0 #fda610, -1px 0 0 #fda610,
    -1px 0 0 #fda610, 0 4px 0 #fda610, 0 -4px 0 #fda610, 0 -4px 0 #fda610, 0 4px 0 #fda610, 0 3px 0 #fda610, 0 -3px 0 #fda610, 0 -3px 0 #fda610, 0 3px 0 #fda610, 0 2px 0 #fda610, 0 -2px 0 #fda610,
    0 -2px 0 #fda610, 0 2px 0 #fda610, 0 1px 0 #fda610, 0 -1px 0 #fda610, 0 -1px 0 #fda610, 0 1px 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610;
}

.postionBtn {
  position: absolute;
  right: 0;
  top: 2.844rem;

  .posBtn {
    border-radius: 0.609rem 0 0 0.609rem;
    font-size: 0.625rem;
    color: #fff;
    padding: 0.3rem 0.43rem 0.3rem 0.5rem;
  }
}

.contenBox {
  min-height: calc(100vh - 8.75rem);
  overflow: hidden;
  padding: 2.969rem 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .planDetail {
    margin: 0 1rem;
    margin-top: 1.75rem;

    .isPlan {
      margin: 0 auto;
      margin-top: 2.219rem;
      width: 14.875rem;
      height: 2.188rem;
      text-align: center;
      font-size: 1.125rem;
      line-height: 2rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .circle {
        border-radius: 50%;
        background-color: #fff;
        margin: 0 0.438rem;
      }
    }

    .isPlanConten {
      margin: 0 1rem;
      display: flex;
      align-items: center;
      padding: 1.938rem 0.813rem;
      background-color: #fff;
      box-shadow: 0 0.156rem 0.313rem 0 rgba(100, 16, 195, 0.3);
      border-radius: 0 0 0.25rem 0.25rem;

      .fans {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .fansUser {
          width: 20%;
          height: 3.688rem;
          text-align: center;
          margin-bottom: 0.9rem;

          img {
            width: 2.5rem;
            height: 2.5rem;
            background-color: #929292;
            border: solid 0.05rem #ffd45b;
            border-radius: 100%;
          }

          .fansName {
            font-size: 0.625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 0.48rem;
            text-align: center;
          }
        }

        .planNot {
          text-align: center;
          font-size: 1rem;
          width: 100%;
        }
      }
    }
  }

  .hepl {
    margin: 0 auto;
    width: 19.406rem;
    height: 10.5rem;
    background-color: #fff;
    box-shadow: 0 0.156rem 0.313rem 0 rgba(100, 16, 195, 0.3);
    border-radius: 0.25rem;
    position: relative;

    .face {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 3.094rem;
      height: 3.094rem;
      background-color: #d4d4d4;
      border-radius: 50%;
      border: solid 0.063rem #ffd45b;

      img {
        width: 3.094rem;
        height: 3.094rem;
        border-radius: 50%;
      }
    }

    .name {
      margin-top: 1.969rem;
      font-size: 0.75rem;
      color: #333;
    }

    .info {
      margin-top: 1rem;
      font-size: 0.938rem;
      color: #fb6b68;
      font-weight: bold;
      letter-spacing: 0.047rem;
    }

    .time {
      margin-top: 0.2rem;
      font-size: 0.813rem;
      letter-spacing: 0.041rem;
      color: #999;
      font-weight: bold;
      display: flex;
      justify-content: center;

      .text {
        font-size: 0.813rem;
        color: #f14b08;
      }
    }

    .btn {
      position: absolute;
      left: 50%;
      bottom: 1.094rem;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 10.063rem;
      height: 1.875rem;
      color: #fff;
      font-size: 0.938rem;
      font-style: italic;
      font-weight: bold;
      letter-spacing: 0.141rem;
      text-shadow: 0.059rem 0.072rem 0 0.031rem rgba(137, 63, 124, 0.5);
      background-image: linear-gradient(#d72c11, #d72c11), linear-gradient(#48246e, #48246e);
      background-blend-mode: normal, normal;
      border-radius: 0.938rem;

      &.disabled {
        filter: grayscale(100%);
      }
    }
  }
}

.popupWrapper {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}

.contactWrapper {
  padding-top: 1.219rem;
  width: 13.031rem;
  height: 15rem;
  border-radius: 0.5rem;

  .thumb {
    margin: 0.894rem auto 0;
    width: 7.188rem;
    height: 7.188rem;
    background-color: #fff;
    border-radius: 0.625rem;

    img {
      width: 7.188rem;
      height: 7.188rem;
    }
  }

  .tips {
    margin-top: 0.563rem;
    font-size: 0.875rem;
    color: #fff;
  }

  .btnPhone {
    margin: 0 auto;
    margin-top: 0.563rem;
    width: 10.063rem;
    height: 1.875rem;

    img {
      width: 10.063rem;
      height: 1.875rem;
    }
  }
}

.friendsWrapper {
  width: 13.031rem;
  height: 15rem;
  border-radius: 0.5rem;

  .success {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    color: #d72c11;
  }

  .thumb {
    margin: 0.594rem auto 0;
    width: 5.5rem;
    height: 5.5rem;
    background-color: #fff;
    border-radius: 0.625rem;

    img {
      width: 5.5rem;
      border-radius: 0.625rem;
      height: 5.5rem;
    }
  }

  .tips {
    margin-top: 0.6rem;
    font-size: 0.625rem;
    color: #fff;
  }

  .see {
    font-size: 0.625rem;
    color: #f52100;
  }

  .btnPhone {
    margin: 0 auto;
    margin-top: 0.563rem;
    width: 10.063rem;
    height: 1.875rem;

    img {
      width: 10.063rem;
      height: 1.875rem;
    }
  }
}
</style>
