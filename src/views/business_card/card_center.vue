<template>
  <div id="card_conter">
    <van-nav-bar left-arrow title="名片中心" fixed @click-left="gotoMember" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"></van-nav-bar>
    <div class="card_a">
      <div class="header_box" :style="bacImage">
        <div class="header" @click.stop="gotoBusiness">
          <div class="img">
            <img :src="cardMessage.card_avatar" />
          </div>
          <ul class="name">
            <li class="name_a">
              <span>{{ cardMessage.card_name }}</span>
              <div class="name_a_right">
                <i
                  class="iconfont icon-bc_like"
                ></i>
                <span v-if="cardMessage.card_statistics">{{ cardMessage.card_statistics.collection }}人收藏</span>
              </div>
            </li>
            <li class="name_b">
              <span>{{ role_name.role_name }}</span>
              <span v-if="role_name.level_name && role_name.level_name != null"
                >&nbsp;&nbsp;&nbsp;{{ role_name.level_name }}
              </span>
              <!--<i class="fa fa-angle-right"></i>-->
            </li>
          </ul>
        </div>
        <ul class="per_info">
          <li v-if="cardMessage.card_mobile">
            <i class="iconfont icon-bc_tel"></i>
            <span>{{ cardMessage.card_mobile }}</span>
          </li>
          <li v-if="cardMessage.card_wechat">
            <i class="iconfont icon-card_weixin1"></i>
            <span>{{ cardMessage.card_wechat }}</span>
          </li>
          <li v-if="!this.fun.isTextEmpty(cardMessage.company)">
            <i class="iconfont icon-bc_locate_company"></i>
            <span>{{ cardMessage.company }}</span>
          </li>
          <li class="position" v-if="area_name">
            <i class="iconfont icon-bc_locate"></i>
            <span style="-webkit-box-orient: vertical;">{{ area_name }}</span>
          </li>
        </ul>
      </div>
      <!-- <ul class="sum_box" v-if="cardMessage.card_statistics">
        <li>
          <i class="iconfont icon-card_eye"></i>
          <span>访问&nbsp;{{ cardMessage.card_statistics.visit }}</span>
        </li>
        <li>
          <i class="iconfont icon-card_collect"></i>
          <span>收藏&nbsp;{{ cardMessage.card_statistics.collection }}</span>
        </li>
        <li>
          <i class="iconfont icon-card_laud"></i>
          <span>靠谱&nbsp;{{ cardMessage.card_statistics.reliable }}</span>
        </li>
      </ul> -->
      <!-- 浏览人数 靠谱 -->
      <div class="user_box" v-if="cardMessage.card_statistics">
        <div class="user_photo">
          <div class="pho1" v-for="(item,index) in cardData.member_avatar" :key="index">
            <img :src="item.avatar_image" alt="">
          </div>
          <span>{{cardMessage.card_statistics.visit}}人浏览</span>
        </div>
        <div class="user_txt">
          <p>靠谱{{cardMessage.card_statistics.reliable}}</p>
          <i class="iconfont icon-card_laud_acitve"></i>
        </div>
      </div>
      <div class="card_button">
        <button type="button" @click="toPage('CardVisit')">
          <i class="iconfont icon-bc_share_card sharecard"></i>分享名片</button>
        <button type="button" class="other" @click="show1 = true">
          其他方式发名片<i class="fa fa-angle-down"></i>
        </button>
      </div>
      <van-popup v-model="show1" position="bottom">
        <div class="list_btn">
          <button type="button" @click="toPage('CardVisit')">名片图片</button>
          <button type="button" @click="toPage('CardCode')">名片码</button>
          <button type="button" class="last" @click="show1 = false">
            取消
          </button>
        </div>
      </van-popup>
    </div>
    <div class="card_b">
      <div class="title">
        <div class="block"></div>
        <span>我的</span>
      </div>
      <ul class="item_box">
        <li @click="toPage('Card_Action')">
          <!-- <i class="iconfont icon-card_statis" style="color:#2ac0de"></i> -->
          <img src="../../assets/images/statistical@2x.png" alt="">
          <span>数据统计</span>
        </li>
        <li @click="toPage('CardCollect')">
          <!-- <i class="iconfont icon-collect-active" style="color:#2ac0de"></i> -->
          <img src="../../assets/images/collection@2x.png" alt="">
          <span>我的收藏</span>
        </li>
        <li @click="toPage('EditCard')">
          <!-- <i class="iconfont icon-balance_m" style="color:#2ac0de"></i> -->
          <img src="../../assets/images/edit@2x.png" alt="">
          <span>名片编辑</span>
        </li>
      </ul>
    </div>
    <div class="card_c">
      <div class="title">
        <div class="block"></div>
        <span>发现</span>
      </div>
      <ul class="item_box">
        <li @click="toPage('CardRanking')">
          <!-- <i class="iconfont icon-card_ranking" style="color:#ffbd38"></i> -->
          <img src="@/assets/images/ranking@2x.png" alt="">
          <span>名片排名</span>
        </li>
        <li @click="toPage('CardFootprint')">
          <!-- <i class="iconfont icon-card_visitor" style="color:#ffbd38"></i> -->
          <img src="@/assets/images/record@2x.png" alt="">
          <span>访客足迹</span>
        </li>
      </ul>
    </div>
    <div class="code-left" @click.stop="toPage('CardCode')">
      <div class="codeName">名片码</div>
      <i
        class="iconfont icon-shoukuanma"
      ></i>
    </div>
  </div>
</template>

<script>
import card_center_controller from "./card_center_controller";

export default card_center_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_conter {
  padding-top: 40px;
  padding-bottom: 60px;
  height: 110vh;
  position: relative;

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 10px;
  }

  .code-left {
    width: 3.063rem;
    height: 3rem;
    background-color: #fff;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.05);
    border-radius: 0 1.5rem 1.5rem 0;
    position: fixed;
    margin: -27.706rem 0 0 0;
    // top: 12.706rem;
    // left: 0;
    z-index: 10;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .codeName {
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 100%;
    }

    i {
      margin-right: 8px;
      font-size: 24px;
    }
  }

  .card_a {
    background: #fff;
    padding: 0.781rem;

    .header_box {
      // background: #fff;
      background-image: url('../../assets/images/card_bg@2x.png');
      background-repeat: no-repeat;
      background-size: cover;
      box-shadow: 0 0.219rem 0.844rem 0 rgba(0, 0, 0, 0.14);
      border-radius: 0.938rem;
      padding: 0.9375rem;

      .header {
        display: flex;

        .img {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 1.875rem;
          overflow: hidden;
          background: #f2f2f2;
          margin-right: 0.625rem;
          border: 2px solid #fff;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          width: 15.3125rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name_a {
            width: 100%;
            font-weight: bold;
            font-size: 1.5rem;
            line-height: 1.875rem;
            position: relative;

            span {
              color: #fff;
            }

            .name_a_right {
              position: absolute;
              right: 0;
              top: 0;
              display: flex;
              align-items: center;
              border-radius: 0.781rem;
              height: 1.53rem;
              background-color: rgba(96, 96, 96, 0.2);
              padding: 0 10px;

              i {
                font-size: 1.125rem;
                color: #fff;
              }

              span {
                font-size: 16px;
                color: #fff;
                font-weight: normal;
              }
            }
          }

          .name_b {
            width: 100%;
            // line-height: 1.875rem;
            font-size: 16px;
            color: #fff;
            position: relative;

            i {
              position: absolute;
              right: 0;
              line-height: 1.875rem;
              font-size: 1.125rem;
              color: #999;
            }

            span {
              width: 13.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

      .per_info {
        text-align: left;
        margin-top: 0.625rem;

        li {
          line-height: 1.5rem;
          display: flex;

          i {
            font-size: 1.125rem;
            color: #fff;
            margin-right: 0.625rem;
          }

          span {
            font-size: 14px;
            color: #fff;
          }
        }

        .position {
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .user_box {
      height: 1.75rem;
      padding: 0 0.781rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.281rem;
      margin-top: 1.5rem;

      .user_photo {
        height: 1.75rem;
        line-height: 1.75rem;

        span {
          font-size: 0.75rem;
          color: #666;
          margin-left: 0.5rem;
        }

        .pho1:first-child {
          margin: 0;
        }

        .pho1 {
          width: 1.75rem;
          height: 1.75rem;
          display: inline-block;
          margin-left: -0.5rem;
          float: left;
          background: #666;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }

      .user_txt {
        display: flex;
        align-items: center;

        i {
          color: #1b8dfc;
          font-size: 1.3rem;
        }

        p {
          font-size: 0.75rem;
          color: #000;
        }
      }
    }

    .sum_box {
      margin: 0.625rem 0;
      display: flex;
      justify-content: space-between;

      .sum_left {
        .img {
          width: 1.75rem;
          height: 1.75rem;
        }
      }

      .sum_right {
        display: flex;
        justify-content: space-between;
        align-items: center;

        i {
          font-size: 1.2rem;
          color: #50a6f9;
        }
      }

      li {
        line-height: 2.5rem;
        display: flex;

        i {
          color: #50a6f9;
          font-size: 1.5rem;
          margin-right: 0.25rem;
        }

        span {
          font-size: 14px;
          color: #666;
        }
      }
    }

    .card_button {
      button {
        width: 100%;
        border-radius: 0.313rem;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #50a6f9;
        color: #fff;
        font-size: 16px;
        border: none;

        .sharecard {
          margin-right: 0.969rem;
        }
      }

      .other {
        background: #fff;
        color: #999;
        margin-top: 0.625rem;

        i {
          margin-left: 0.375rem;
          font-size: 1.125rem;
        }
      }
    }

    .list_btn {
      background: #f5f5f5;

      button {
        background: #fff;
        border: none;
        border-radius: 0;
        width: 100%;
        height: 3.125rem;
        line-height: 3.125rem;
        font-size: 16px;
      }

      button:first-child {
        border-bottom: solid 0.0625rem #ebebeb;
      }

      .last {
        margin-top: 0.625rem;
      }
    }
  }

  .card_b,
  .card_c {
    padding: 0 0.9375rem;
    margin-top: 0.625rem;
    background: #fff;

    .title {
      height: 2.5rem;
      line-height: 2.5rem;
      display: flex;
      align-items: center;

      .block {
        width: 0.25rem;
        height: 1rem;
        background: #50a6f9;
        border-radius: 0.0625rem;
        margin-right: 0.375rem;
      }

      span {
        font-weight: bold;
        font-size: 16px;
      }
    }

    .item_box {
      display: flex;
      padding: 1rem 0;

      li {
        width: 33.33%;
        text-align: center;
        // i {
        //   font-size: 2rem;
        //   color: #f15353;
        // }
        img {
          width: 2rem;
          height: 2rem;
        }

        span {
          display: block;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
