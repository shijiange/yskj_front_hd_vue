<!-- 新版 排行榜 -->
<template>
  <div id="ranking_xpc">
    <!--<div class="header set-pc-style">-->
      <!--<i style="z-index: 999;" class="iconfont icon-back" @click.stop="gotoMember"></i>-->
      <!--<div class="text">排行榜</div>-->
    <!--</div>-->
    <c-title :hide="false" :text="'排行榜'"></c-title>
    <template v-if="!fun.isTextEmpty(titleArr)">
      <van-tabs animated swipeable sticky class="tabs_style" v-model="activeName" @change="handleClick(false)">
        <van-tab v-for="(item, index) in titleArr" :title="item" :key="index">
          <van-tabs
            type="card"
            v-model="active"
            class="zs_tabs"
            v-show="dataList[index].plugin_type == 'Merchants'"
            @click="handleClick(true)"
          >
            <!-- 招商的标签页  招商员和招商中心 -->
            <van-tab
              :title="itemss.name"
              :name="itemss.type"
              v-for="(itemss, ind) in merchanrTitle"
              :key="ind"
            ></van-tab>
          </van-tabs>
          <div class="topBox">
            <template v-if="dataList[index].info && dataList[index].info.usable_total">
              <!-- 有开通显示 -->
              <div class="memberInfo">
                <div class="tx">
                  <img :src="dataList[index].member_amount ? dataList[index].member_amount.avatar_image : ''" alt="" />
                  <div class="Rank">
                    <i class="iconfont icon-rank_rankframe"></i>
                    <p>NO.{{ dataList[index].info.countNO }}</p>
                  </div>
                </div>
                <div class="name">
                  {{ dataList[index].member_amount ? dataList[index].member_amount.nickname : '' }}
                </div>
              </div>
              <div class="moneyTotal">
                <div class="child">
                  <div class="num">{{ dataList[index].info.grand_total }}</div>
                  <div class="num_name">累计收益(元)</div>
                </div>
                <div class="child">
                  <div class="num">{{ dataList[index].info.usable_total }}</div>
                  <div class="num_name">可提现(元)</div>
                </div>
                <router-link :to="fun.getUrl('withdrawal', {})" class="child withdraw" tag="div">提现</router-link>
              </div>
            </template>
            <div
              v-if="dataList[index].info && dataList[index].info.status && dataList[index].info.status == 1"
              style="padding-bottom: 2rem;"
            >
              <!-- 没有开通，显示去申请 getSwitch有返回status字段-->
              <p class="applyTest">{{ dataList[index].variable }}</p>
              <div
                class="applyBtn"
                v-show="dataList[index].plugin_type != 'teamDividend'"
                @click="gotoApply(dataList[index].plugin_type)"
              >
                去申请
              </div>
            </div>
          </div>
          <!-- 店长中心 微店且满足条件时才显示 -->
          <div
            class="storeCenter"
            v-if="dataList[index].plugin_type == 'micro' && !dataList[index].info.hasOwnProperty('status')"
          >
            <p class="sc_text">店长中心</p>
            <router-link :to="fun.getUrl('microShop_home', {})" class="sc_btn" tag="div">进入</router-link>
          </div>

          <!-- 查看详情 -->
          <div
            class="lookDetail"
            v-if="dataList[index].plugin_type != 'micro' && !dataList[index].info.hasOwnProperty('status')"
            @click="gotoDetail(dataList[index].plugin_type)"
          >
            <div class="detail_box">
              <p>查看详情</p>
              <i class="fa fa-angle-right"></i>
            </div>
            <div class="card_box" v-if="showDetail">
              <div class="card_style card1">
                <div class="num">{{ dataList[index].info.countNum }}</div>
                <div class="card_name">{{ countNum_name }}</div>
              </div>
              <div class="card_style card2">
                <div class="num" v-if="dataList[index].info.countOrder">{{ Number(dataList[index].info.countOrder).toFixed(2) }}</div>
                <div class="card_name">{{ countOrder_name }}</div>
              </div>
            </div>
          </div>

          <div class="income_rank">
            <p class="income_title">收益排行榜</p>
            <div class="income_nav">
              <div class="income_randNum">排名</div>
              <div class="member">会员</div>
              <div class="total">累计收益</div>
            </div>
            <ul class="income_list">
              <template v-if="!fun.isTextEmpty(dataList) && !fun.isTextEmpty(dataList[index].list)">
                <li class="list_child" v-for="(item, i) in dataList[index].list" :key="i">
                  <div class="income_randNum">{{ i + 1 }}</div>
                  <div class="member">
                    <img
                      v-if="item.has_one_member"
                      :src="
                        item.has_one_member
                          ? item.has_one_member.avatar_image
                          : require('../../../assets/images/loading.jpg')
                      "
                      alt=""
                    />
                    <img
                      v-if="item.has_one_members"
                      :src="
                        item.has_one_members
                          ? item.has_one_members.avatar_image
                          : require('../../../assets/images/loading.jpg')
                      "
                      alt=""
                    />
                    <p v-if="item.has_one_member">{{ item.has_one_member ? item.has_one_member.nickname : '' }}</p>
                    <p v-if="item.has_one_members">{{ item.has_one_members ? item.has_one_members.nickname : '' }}</p>
                  </div>
                  <div class="total">{{ item.total_amount }}</div>
                </li>
              </template>
              <img
                src="../../../assets/images/blank.png"
                alt=""
                style="width: 5rem; margin-top: 2rem;"
                v-if="fun.isTextEmpty(dataList[index].list)"
              />
            </ul>
          </div>
        </van-tab>
      </van-tabs>
    </template>
    <div class="bottom_box set-pc-style">
      <router-link class="home" :to="fun.getUrl('home', {})" tag="div">
        <i class="iconfont icon-home-page"></i>
        <em>首页</em>
      </router-link>
      <div class="btn_box">
        <div class="warn" @click="showPopup1 = true" v-show="poster_text_sy">{{ poster_text_sy }}</div>
        <div class="share" @click="getPoster">分享</div>
      </div>
    </div>

    <!-- 收益提醒弹窗 -->
    <van-popup v-model="showPopup1" closeable round>
      <div class="sy_popup">
        <img :src="poster_thumb_sy" alt="" />
        <p class="sy_text">{{ poster_text_sy }}</p>
      </div>
    </van-popup>

    <!-- 分享海报 -->
    <van-popup v-model="showPoster" closeable round>
      <div class="style_popup">
        <img :src="`${image_url}?${Date.now()}`" alt="" v-if="!fun.isTextEmpty(image_url)" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import rankings_controller from './ranking_controller.js';
export default rankings_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#ranking_xpc {
  padding: 0 0 60px;
  background: #fff;
  position: relative;

  .zs_tabs {
    background: #fffafa;
    padding-top: 0.5rem;

    /deep/ .van-tabs__wrap {
      height: 1.625rem;
    }

    /deep/ .van-tabs__nav--card {
      height: 1.625rem;
      width: 9.375rem;
      margin: 0 auto;
      border: none;
      border-radius: 1rem;
      overflow: hidden;
      background: #fff !important;
    }

    /deep/ .van-tab--active {
      border-radius: 1rem;
      background-color: #ffe1e1;
      border: none;
      overflow: hidden;
    }

    /deep/ .van-tab,
    /deep/ .van-tab--active {
      color: #ff2c29;
      border: none;
    }
  }

  .header {
    height: 40px;
    line-height: 40px;
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    background: #fffafa;
    width: 100%;
    color: #000;

    i {
      font-size: 1rem;
      width: 2rem;
    }

    .text {
      flex: 1;
      text-align: center;
      margin-left: -2rem;
      font-size: 0.9375rem;
      font-weight: bold;
    }
  }

  .tabs_style {
    /deep/ .van-tabs__nav {
      background: #fffafa;
    }

    /deep/ .van-tabs__line {
      background-color: #333;
    }

    /deep/ .van-tabs__wrap::after {
      border: none;
    }
  }

  .topBox {
    // height: 11.25rem;
    background-color: #fffafa;
    border-radius: 0 0 0 3.75rem;
    overflow: hidden;
    padding: 2rem 1.5rem;

    .applyTest {
      font-size: 1rem;
      color: #333;
      font-weight: bold;
      text-align: left;
      margin: 1rem 0;
    }

    .applyBtn {
      width: 7.875rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #ffdfdf;
      border-radius: 1.25rem;
      color: #ff2c29;
      font-weight: bold;
      font-size: 1rem;
    }

    .memberInfo {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;

      .tx {
        width: 4.25rem;
        height: 4.25rem;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }

        .Rank {
          position: absolute;
          bottom: -0.5rem;
          display: block;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);

          i {
            color: #ffb43e;
            font-size: 1rem;
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
          }

          p {
            display: block;
            font-size: 0.75rem;
            height: 1rem;
            line-height: 1rem;
            background: #ffb43e;
            color: #fff;
            padding: 0 0.5rem;
            border-radius: 1rem;
            min-width: 4rem;
          }
        }
      }

      .name {
        flex: 1;
        font-size: 1.125rem;
        color: #333;
        margin-left: 0.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        font-weight: bold;
      }
    }

    .moneyTotal {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .child {
        display: flex;
        flex-direction: column;
        color: #333;

        .num {
          font-size: 1rem;
          font-weight: bold;
        }

        .num_name {
          font-size: 0.875rem;
        }
      }

      .withdraw {
        width: 4.375rem;
        height: 1.75rem;
        line-height: 1.75rem;
        color: #fff;
        background-color: #ff2c29;
        border-radius: 1rem;
      }
    }
  }

  .storeCenter {
    margin: 1rem;
    height: 3.75rem;
    background-image: url('../../../assets/images/ranking/rank_detail_bg3@2x.png');
    background-size: 100% 100%;
    box-shadow: 0 0.5rem 1rem 0 rgba(255, 13, 0, 0.1);
    border-radius: 0 0 0.375rem 0.375rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sc_text {
      font-size: 1.125rem;
      color: #fff;
      font-weight: bold;
      margin-left: 1rem;
    }

    .sc_btn {
      width: 4.5rem;
      height: 1.625rem;
      line-height: 1.625rem;
      color: #ffa200;
      background: #fff;
      border-radius: 1rem;
      margin-right: 1rem;
      overflow: hidden;
    }
  }

  .lookDetail {
    .detail_box {
      height: 2rem;
      line-height: 2rem;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      margin: 1rem 0;

      p {
        flex: 1;
        text-align: left;
        font-size: 1.125rem;
        color: #000;
        font-weight: bold;
      }

      i {
        font-size: 1.25rem;
      }
    }

    .card_box {
      display: flex;

      .card_style {
        width: 10.625rem;
        height: 6.125rem;
        background-size: 100% 100%;
        border-radius: 0.5rem;
        margin-left: 0.75rem;
        padding: 0 1rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        color: #fff;
        font-size: 0.875rem;

        .card_name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }

      .card1 {
        background-image: url('../../../assets/images/ranking/rank_detail_bg1@2x.png');
      }

      .card2 {
        background-image: url('../../../assets/images/ranking/rank_detail_bg2@2x.png');
      }

      .num {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }
    }
  }

  .income_rank {
    .income_title {
      height: 2rem;
      line-height: 2rem;
      font-size: 1.125rem;
      color: #000;
      font-weight: bold;
      margin: 1rem 0.875rem 0;
      text-align: left;
    }

    .income_nav,
    .list_child {
      display: flex;
      height: 2rem;
      line-height: 2rem;
      font-size: 0.875rem;
      color: #999;

      .income_randNum {
        flex: 0 0 20%;
      }

      .member {
        flex: 0 0 45%;
      }

      .total {
        flex: 1;
        max-width: 10rem;
        line-height: 1rem;
        word-break: break-all;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .list_child {
      color: #000;
      flex-wrap: wrap;
      height: 3.5rem;
      line-height: 3.5rem;
      font-size: 1rem;

      .income_randNum {
        font-weight: bold;
      }

      .member {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 100%;
          overflow: hidden;
          margin: 0;
          margin-right: 0.5rem;
          object-fit: cover;
        }

        p {
          flex: 1;
          width: 100%;
          text-align: left;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }
  }

  .bottom_box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3.5rem;
    padding: 0 1.125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    box-shadow: 0 9.3rem 1rem 9rem rgba(0, 0, 0, 0.1);

    .home {
      display: flex;
      flex-direction: column;

      i {
        color: #666;
        font-size: 1.5rem;
      }

      em {
        color: #666;
        font-size: 0.75rem;
      }
    }

    .btn_box {
      display: flex;

      .warn,
      .share {
        width: 8.25rem;
        height: 2.375rem;
        line-height: 2.375rem;
        border-radius: 1rem;
        border: solid 1px #f00;
        color: #f00;
        text-align: center;
      }

      .share {
        color: #fff;
        background: #f00;
        margin-left: 0.625rem;
      }

      .warn {
        padding: 0 0.875rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }
  }

  .sy_popup {
    padding: 2.5rem;

    img {
      width: 14rem;
      height: 14rem;
      overflow: hidden;
    }

    .sy_text {
      font-size: 0.875rem;
      color: #666;
      margin-top: 0.25rem;
    }
  }

  .style_popup {
    width: 17rem;
    font-size: 0;

    img {
      width: 100%;
    }
  }
}
</style>
