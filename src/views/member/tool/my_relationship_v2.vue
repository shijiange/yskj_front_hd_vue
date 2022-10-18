<template>
  <div id="myrelationship">
    <c-title :hide="false" :text="name"></c-title>

    <!-- 我的客户 -->

    <div id="content">
      <modal v-if="showModal" :title="mdTitle" :tips="mdTips" :value="mdValue" @onClose="handleToggle"></modal>
      <div class="member-info">
        <div class="img">
          <img :src="self_info.avatar"/>
        </div>
        <div class="word">
          <div class="name">{{ self_info.nickname }}</div>
          <div class="member-id">
            <!-- 会员ID: -->
            {{ self_info.uid }}
          </div>
        </div>
        <div v-if="my_achievement" class="goMarket" @click="goMarket(0)">
          我的市场
        </div>
      </div>
      <div class="header_box">
        <div v-if="isShowClient && show_parents == 0">
          <h1>推荐人</h1>
          <div class="header">
            <div class="img">
              <img :src="myReferral.avatar"/>
            </div>
            <div class="name">
              <div class="row">
                <div>昵称:{{ myReferral.nickname }}</div>
                <div class="member-id">
                  <!-- 会员ID: -->
                  {{ myReferral.uid }}
                </div>
              </div>
              <div class="row row1" v-if="is_recommend_wechat == 1">
                <div v-if="myReferral.referrer_phone">
                  <i class="iconfont icon-bc_tel"></i>{{ myReferral.referrer_phone }}
                </div>
                <div v-if="myReferral.referrer_wechat">
                  <i class="iconfont icon-card_weixin1"></i>{{ myReferral.referrer_wechat }}
                </div>
              </div>
            </div>
            <div class="go-btn" @click="goBtn(1)">
              &gt;
            </div>
          </div>
        </div>

        <div v-if="my_referral_parents.is_show == 1 && show_parents == 1">
          <h1>推荐人的上级</h1>
          <div class="header">
            <div class="img">
              <img :src="my_referral_parents.avatar"/>
            </div>
            <div class="name">
              <div class="row">
                <div>昵称:{{ my_referral_parents.nickname }}</div>
                <div class="member-id">
                  <!-- 会员ID: -->
                  {{ my_referral_parents.uid }}
                </div>
              </div>
              <div class="row row1" v-if="is_recommend_wechat == 1">
                <div v-if="my_referral_parents.referrer_phone">
                  <i class="iconfont icon-bc_tel"></i>{{ my_referral_parents.referrer_phone }}
                </div>
                <div v-if="my_referral_parents.referrer_wechat">
                  <i class="iconfont icon-card_weixin1"></i>{{ my_referral_parents.referrer_wechat }}
                </div>
              </div>
            </div>
            <div class="go-btn" @click="goBtn(0)">
              &lt;
            </div>
          </div>
        </div>

        <div class="innerbox" v-if="!fun.isTextEmpty(myReferral)">
          <div class="innerbox-li" @click="gotoList('first')">
            <p>{{agent.agent_num?agent.agent_num:"客户数量"}}（人）</p>
            <p style="font-weight: 700; font-size: 15px; line-height: 1.35rem;">{{ myReferral.child_total }}</p>
          </div>
          <div class="innerbox-li" @click="gotoList('all')">
            <p>{{agent.agent_count?agent.agent_count:"总客户数"}}（人）</p>
            <p style="font-weight: 700; font-size: 15px; line-height: 1.35rem;">{{ myReferral.team_total }}</p>
          </div>
          <div class="innerbox-li">
            <p>{{agent.agent_order?agent.agent_order:"客户订单"}}（{{ $i18n.t("元") }}）</p>
            <p style="font-weight: 700; font-size: 15px; line-height: 1.35rem;">{{ myReferral.child_order_money }}</p>
          </div>
          <div class="innerbox-li">
            <p>{{agent.agent_order_count?agent.agent_order_count:"客户总订单"}}（{{ $i18n.t("元") }}）</p>
            <p style="font-weight: 700; font-size: 15px; line-height: 1.35rem;">{{ myReferral.team_order_money }}</p>
          </div>
          <div class="innerbox-li">
            <p>{{agent.agent_goods_num?agent.agent_goods_num:"客户总支付商品数量"}}</p>
            <p style="font-weight: 700; font-size: 15px; line-height: 1.35rem;">{{ myReferral.team_goods_total }}</p>
          </div>
        </div>
        <div style="padding: 0.626rem 0.8125rem; color: #8c8c8c; text-align: left; font-size: 0.8125rem;">
          <div class="note">注：所有数据为截至到昨天汇总数据！</div>
          <div class="note">订单数、订单总额统计已完成的订单数据</div>
        </div>
      </div>

      <div class="info_list">
        <van-tabs v-model="activeName" @click="handleClick">
          <van-tab name="first" :title="labelValue1" v-if="level1 && level1.is_show"></van-tab>
          <van-tab name="second" :title="labelValue2" v-if="level2 && level2.is_show"></van-tab>
          <van-tab name="third" :title="labelValue3" v-if="level3 && level3.is_show"></van-tab>
        </van-tabs>
        <!-- <mt-tab-container v-model="activeName"> -->
        <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
        <div v-show="activeName=='first'" v-if="level1 && level1.is_show">
          <!-- <mt-tab-container-item id="first" v-if="level1 && level1.is_show"> -->
          <!--<el-tab-pane name="first" :label="labelValue1" v-if="level1&&level1.is_show">-->
          <div class="list_box">
            <div class="search">
              <div class="search-box">
                <form @submit.prevent action="#">
                  <input
                    type="search"
                    placeholder="搜索会员信息/昵称/手机号"
                    @keypress="enterSearch"
                    v-model="keyword1"
                    style="width: 150%;"
                  />
                </form>
                <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
              </div>
            </div>
            <div class="list" v-for="(item, index) in new_content" :key="index">
              <div class="list_top" @click="gotoMemberDetail(item.id)">
                <div class="header_left">
                  <div class="img">
                    <img :src="item.avatar" @click.stop="goMarket(item.id)"/>
                    <div v-if="item.inviter == 1" style="position: absolute; right: 1px; bottom: -1px;">
                      <img src="../../../assets/images/temporary@2x.png" style="width: 1rem; height: 1rem;"/>
                    </div>
                  </div>

                  <ul class="name">
                    <li style="">
                      <div
                        style="float: left; max-width: 7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      >
                        {{ item.nickname }}
                      </div>
                      <div class="member-id" style="float: left;">
                        {{ item.id }}
                      </div>
                    </li>
                    <li style="color: #333; font-size: 0.75rem; line-height: 1.2rem;"
                        v-if="item.realname !== 0 && realname">
                      {{item.realname}}
                    </li>
                    <li>
                      {{ item.createtime }}
                    </li>
                  </ul>
                </div>
                <div class="header_right">
                  <div class="Wechat" @click.stop="handleToggle(item)" v-if="item.wechat !== 0 && WeChat">
                    <img src="../../../assets/images/relation_Wechat.png"/>
                  </div>
                  <div class="phone" v-if="item.mobile !== 0 && phone" @click.stop>
                    <a :href="'tel:' + item.mobile"><img src="../../../assets/images/relation_phone.png"/></a>
                  </div>
                </div>
              </div>
              <div class="order_info">
                <ul class="order_number">
                  <li>订单数：{{ item.child_order_total }}个</li>
                  <li>{{name}}数量：{{ item.team_total }}个</li>
                  <!-- <li>总客户数：233个</li> -->
                </ul>
                <ul class="order_sum">
                  <li>订单总额：{{ item.child_order_money }}{{ $i18n.t("元") }}</li>
                  <li>{{name}}订单：{{ item.team_order_money }}{{ $i18n.t("元") }}</li>
                  <!-- <li>客户总订单：2330{{$i18n.t('元')}}</li> -->
                </ul>
              </div>
            </div>
          </div>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='second'" v-if="level2 && level2.is_show">
          <!-- <mt-tab-container-item id="second" v-if="level2 && level2.is_show"> -->
          <!--<el-tab-pane name="second" :label="labelValue2" v-if="level2&&level2.is_show">-->
          <div class="list_box">
            <div class="search">
              <div class="search-box">
                <form @submit.prevent action="#">
                  <input
                    type="search"
                    placeholder="搜索会员信息/昵称/手机号"
                    @keypress="enterSearch"
                    v-model="keyword2"
                    style="width: 150%;"
                  />
                </form>
                <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
              </div>
            </div>
            <div class="list" v-for="(item, index) in new_content" :key="index">
              <div class="list_top" @click="gotoMemberDetail(item.id)">
                <div class="header_left">
                  <div class="img">
                    <img :src="item.avatar" @click.stop="goMarket(item.id)"/>
                    <div v-if="item.inviter == 1" style="position: absolute; right: 1px; bottom: -1px;">
                      <img src="../../../assets/images/temporary@2x.png" style="width: 1rem; height: 1rem;"/>
                    </div>
                  </div>
                  <ul class="name">
                    <li style="">
                      <div
                        style="float: left; max-width: 7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      >
                        {{ item.nickname }}
                      </div>
                      <div class="member-id" style="float: left;">
                        {{ item.id }}
                      </div>
                    </li>
                    <li style="color: #333; font-size: 0.75rem; line-height: 1.2rem;"
                        v-if="item.realname !== 0 && realname">
                      {{item.realname}}
                    </li>
                    <li>{{ item.createtime }}</li>
                  </ul>
                </div>
                <div class="header_right">
                  <div class="Wechat"  @click.stop="handleToggle(item)" v-if="item.wechat !== 0 && WeChat">
                    <img src="../../../assets/images/relation_Wechat.png"/>
                  </div>
                  <div class="phone" v-if="item.mobile !== 0 && phone" @click.stop>
                    <a :href="'tel:' + item.mobile"><img src="../../../assets/images/relation_phone.png"/></a>
                  </div>
                </div>
              </div>

              <div class="order_info">
                <ul class="order_number">
                  <li>订单数：{{ item.child_order_total }}个</li>
                  <li>{{name}}数量：{{ item.team_total }}个</li>
                  <!-- <li>总客户数：233个</li> -->
                </ul>
                <ul class="order_sum">
                  <li>订单总额：{{ item.child_order_money }}{{ $i18n.t("元") }}</li>
                  <li>{{name}}订单：{{ item.team_order_money }}{{ $i18n.t("元") }}</li>
                  <!-- <li>客户总订单：2330{{$i18n.t('元')}}</li> -->
                </ul>
              </div>
            </div>
          </div>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='third'" v-if="level3 && level3.is_show">
          <!-- <mt-tab-container-item id="third" v-if="level3 && level3.is_show"> -->
          <!--<el-tab-pane name="third" :label="labelValue3" v-if="level3&&level3.is_show">-->
          <div class="list_box">
            <div class="search">
              <div class="search-box">
                <form @submit.prevent action="#">
                  <input
                    type="search"
                    placeholder="搜索会员信息/昵称/手机号"
                    @keypress="enterSearch"
                    v-model="keyword3"
                    style="width: 150%;"
                  />
                </form>
                <i class="iconfont icon-sousuo1" style="color: #ccc;" @click="search"></i>
              </div>
            </div>
            <div class="list" v-for="(item, index) in new_content" :key="index">
              <div class="list_top" @click="gotoMemberDetail(item.id)">
                <div class="header_left">
                  <div class="img">
                    <img :src="item.avatar" @click.stop="goMarket(item.id)"/>
                    <div v-if="item.inviter == 1" style="position: absolute; right: 1px; bottom: -1px;">
                      <img src="../../../assets/images/temporary@2x.png" style="width: 1rem; height: 1rem;"/>
                    </div>
                  </div>
                  <ul class="name">
                    <li style="">
                      <div
                        style="float: left; max-width: 7rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      >
                        {{ item.nickname }}
                      </div>
                      <div class="member-id" style="float: left;">
                        {{ item.id }}
                      </div>
                    </li>
                    <li style="color: #333; font-size: 0.75rem; line-height: 1.2rem;"
                        v-if="item.realname !== 0 && realname">
                      {{item.realname}}
                    </li>
                    <li>{{ item.createtime }}</li>
                  </ul>
                </div>
                <div class="header_right">
                  <div class="Wechat" @click.stop="handleToggle(item)" v-if="item.wechat !== 0 && WeChat">
                    <img src="../../../assets/images/relation_Wechat.png"/>
                  </div>
                  <div class="phone" v-if="item.phone !== 0 && phone" @click.stop>
                    <a :href="'tel:' + item.mobile"><img src="../../../assets/images/relation_phone.png"/></a>
                  </div>
                </div>
              </div>
              <div class="order_info">
                <ul class="order_number">
                  <li>订单数：{{ item.child_order_total }}个</li>
                  <li>{{name}}数量：{{ item.team_total }}个</li>
                  <!-- <li>总客户数：233个</li> -->
                </ul>
                <ul class="order_sum">
                  <li>订单总额：{{ item.child_order_money }}{{ $i18n.t("元") }}</li>
                  <li>{{name}}订单：{{ item.team_order_money }}{{ $i18n.t("元") }}</li>
                  <!-- <li>客户总订单：2330元</li> -->
                </ul>
              </div>
            </div>
          </div>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container-item> -->
        </div>
        <!--</el-tabs>-->
        <!-- </mt-tab-container> -->
      </div>
    </div>
    <!-- 结束 -->

  </div>
</template>
<script>
import my_relationship_v2_controller from "./my_relationship_v2_controller";

export default my_relationship_v2_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #myrelationship {
    #content {
      .member-info {
        background: #fff;
        display: flex;
        align-items: center;
        padding: 1.25rem 0.875rem;

        .img {
          flex: 0 0 4rem;
          border-radius: 50%;
          height: 4rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .word {
          padding-left: 0.625rem;
          flex: 1;
          text-align: left;
          line-height: 1.25rem;

          .name {
            font-weight: 700;
          }

          .member-id {
            color: #8c8c8c;
          }
        }

        .goMarket {
          width: 5.56rem;
          height: 2.19rem;
          line-height: 2.19rem;
          border-radius: 0.31rem;
          color: rgba(238, 82, 83, 100);
          font-size: 0.88rem;
          text-align: center;
          border: 0.06rem solid rgba(238, 82, 83, 100);
        }
      }

      .header_box {
        margin-top: 1rem;
        background: #fff;

        h1 {
          line-height: 2.5rem;
          font-size: 15px;
          padding: 0 0.875rem;
          text-align: left;
        }

        .header {
          background-color: #fff;
          padding: 0.75rem 0.875rem;
          padding-right: 0;
          display: flex;

          .img {
            width: 3rem;
            height: 3rem;
            border-radius: 1.75rem;
            border: solid 0.125rem #fff;
            overflow: hidden;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .name {
            flex: 1;

            .row {
              text-align: left;
              padding: 0.3rem 0;

              div {
                display: inline-block;
                text-align: left;
                font-size: 15px;
              }

              .member-id {
                padding: 0 0.5rem;
                margin-left: 0.5rem;
                color: #f15353;
                background: #ffe4dc;
                line-height: 20px;
                font-size: 13px;
                border-radius: 1rem;
              }
            }

            .row1 {
              color: #8c8c8c;

              div {
                font-size: 13px;
                padding-right: 0.3rem;
              }
            }
            // li:last-child {
            //   font-size: 14px;
            //   color: #8c8c8c;
            // }
          }

          .go-btn {
            flex: 0 0 3.5rem;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #c5c5c5;
            border-radius: 100% 0 0 100%;
            color: #fff;
            font-size: 1.25rem;
          }
        }

        .innerbox {
          width: 100%;
          overflow-x: auto;
          text-align: left;
          padding: 1rem 0.875rem 0.25rem 0.875rem;
          // padding: 5px;
          border-radius: 0.625rem;
          display: flex;

          p {
            height: 1.35rem;
            line-height: 1.35rem;
            width: 100%;
          }

          .innerbox-li {
            display: flex;
            flex-direction: column;
            height: 5rem;
            box-shadow: #ccc 0 0 5px;
            padding: 0.625rem;
            flex-shrink: 0;
            background: url('../../../assets/images/person@2x.png');
            background-position: bottom right;
            background-repeat: no-repeat;
            background-size: 3rem;
          }
        }
      }

      .number_order {
        background-color: #fff;
        color: #333;

        .number_box {
          padding: 0.625rem 0;
          display: flex;

          li {
            font-size: 16px;
            // width: 50%;
            span {
              display: block;
              line-height: 1.875rem;
              text-align: left;
              padding: 0 0.625rem;
            }
          }
        }

        .note {
          background: #fafafa;
          line-height: 2.25rem;
          text-align: left;
          padding: 0 0.875rem;
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      .info_list {
        margin: 0.625rem 0;

        .list_box {
          .list {
            background-color: #fff;
            margin-bottom: 0.625rem;

            .list_top {
              padding: 0.75rem 0;
              display: flex;
              justify-content: space-between;
              border-bottom: solid 0.0625rem #ebebeb;

              .header_left {
                padding-left: 0.75rem;
                display: flex;

                .img {
                  position: relative;
                  width: 2.8rem;
                  height: 2.8rem;
                  // border-radius: 1.25rem;
                  overflow: hidden;
                  margin-right: 0.625rem;

                  img {
                    // width: 100%;
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 1.25rem;
                  }
                }

                .name {
                  text-align: left;
                  width: 12rem;

                  li:first-child {
                    font-size: 16px;
                    color: #333;
                    line-height: 1.5rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  li:last-child {
                    font-size: 14px;
                    color: #8c8c8c;
                    line-height: 1rem;
                  }

                  .member-id {
                    display: inline-block;
                    padding: 0 0.5rem;
                    margin-left: 0.5rem;
                    color: #f15353;
                    background: #ffe4dc;
                    line-height: 20px;
                    font-size: 13px;
                    border-radius: 1rem;
                  }
                }
              }

              .header_right {
                padding-right: 0.625rem;
                display: flex;

                .Wechat,
                .phone,
                .news {
                  width: 2.5rem;
                  height: 2.5rem;

                  img {
                    width: 1.75rem;
                    margin-top: 0.375rem;
                  }
                }
              }
            }

            .order_info {
              padding: 0.625rem 0;
              display: flex;

              .order_number,
              .order_sum {
                width: 50%;
                text-align: left;

                li {
                  line-height: 1.625rem;
                  font-size: 14px;
                  padding: 0 0.625rem;
                }
              }
            }
          }
        }
      }
    }
  }

  #myrelationship {
    width: 100%;
    height: 100%;

    .relation-people {
      h3 {
        color: #333;
        font-size: 14px;
        line-height: 2.25rem;
        padding: 0 0.875rem;
        text-align: left;
        font-weight: normal;
        background: #fff;
      }
    }

    .relation-people-info {
      padding: 0.625rem 0.875rem;
      float: left;
      width: 100%;

      .relation-people-info-img {
        width: 3.25rem;
        height: 3.25rem;
        border-radius: 50%;
        overflow: hidden;
        border: solid 0.125rem #fff;
        // margin-top:10px;
        // margin-left:10px;
        float: left;
        line-height: 3.125rem;
        background: #ccc;

        img {
          width: 100%;
        }
      }

      .relation-people-information {
        float: left;
        height: 3.125rem;
        padding-top: 0.25rem;
        text-align: left;
        margin-left: 0.625rem;

        p {
          margin-left: 0.625rem;
        }
      }
    }

    .relation-people-row {
      background: #fff;
      clear: both;

      h3 {
        color: #333;
        font-size: 12px;
        line-height: 2.25rem;
        padding: 0 0.875rem;
        text-align: left;
        font-weight: normal;
        background: #fff;
      }
    }

    .relation-people-amount {
      background: #fff;
      height: 2.75rem;
      line-height: 2.75rem;
      font-size: 14px;

      span {
        color: #333;
        padding-left: 0.625rem;
        text-align: left;
        font-weight: normal;
        float: left;
      }

      a {
        float: right;
        margin-right: 3%;
        color: #8c8c8c;
      }
    }

    a {
      float: right;
      margin-right: 3%;
    }
  }

  .tbs2 {
    background: #f5f5f5;
    align-items: center;
    border-bottom: #ebebeb 0.0625rem solid;
    padding: 0 0.625rem;

    .left {
      width: 46%;
      text-align: left;
      height: 2.8125rem;
      display: inline-block;
      line-height: 2.8125rem;

      img {
        width: 30%;
      }
    }

    .right {
      width: 46%;
      display: inline-block;
      text-align: right;
    }
  }

  .tbs {
    align-items: center;
    border-bottom: #ebebeb 0.0625rem solid;
    padding: 0 0.75rem;
    float: left;
    width: 100%;
    background: #fff;

    .left {
      font-size: 12px;
      box-sizing: border-box;
      width: 50%;
      text-align: left;
      height: 2.8125rem;
      line-height: 2.8125rem;
      float: left;

      img {
        width: 30%;
        float: left;
      }
    }

    .right {
      width: 50%;
      text-align: right;
    }

    a {
      color: #000;
    }

    .relation {
      color: #666;
    }

    .id,
    .level {
      font-size: 14px;
      line-height: 2.8125rem;
    }

    .fa.fa-search {
      color: #999;
      font-size: 20px;
    }

    i {
      font-size: 24px;
      color: #929292;
    }

    .img {
      margin: 0.625rem 0;
    }

    .li1 {
      width: 3.125rem;
      height: 3.125rem;
      // margin-top:10px;
      // margin-left:10px;
      float: left;
      line-height: 3.125rem;
      background: #ccc;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .li2 {
      float: left;
      height: 3.125rem;

      p {
        margin-top: 0.4375rem;
        margin-left: 0.625rem;
        text-align: left;
      }
    }

    .li3 {
      flex: 30%;
      width: 30%;

      span {
        border: #b1a6a6 solid 0.0625rem;
        padding: 0.3125rem 1.25rem;
        border-radius: 0.4375rem;
        display: none;
      }
    }

    .li4 {
      // flex: 5%;
      // width: 5%;
      float: right;
      height: 3.125rem;
      line-height: 3.125rem;
    }
  }

  .imgst {
    background: #f5f5f5;
  }

  .fade-enter-active {
    transition: 0.5s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    height: 0;
  }

  .tbs3 {
    .left {
      width: 46%;
      text-align: left;
      height: 2.8125rem;
      display: inline-block;
      line-height: 2.8125rem;

      img {
        width: 30%;
      }
    }

    .right {
      width: 46%;
      display: inline-block;
      text-align: right;
      height: 2.8125rem;
      line-height: 2.8125rem;
    }
  }

  //弹窗
  .relation-popup {
    overflow: auto;
    width: 100%;
  }

  .relation-popup-con {
    border-bottom: solid 0.0625rem #ebebeb;
    padding-bottom: 0.625rem;

    h3 {
      color: red;
      font-size: 12px;
      margin: 0;
      line-height: 2.75rem;
      padding: 0 1.25rem;
      text-align: left;
      font-weight: normal;
      background: #fff;
    }

    ul {
      padding: 0 5% 0 5%;

      li {
        width: 30%;
        background: #e8e6e9;
        float: left;
        height: 1.875rem;
        margin-right: 5%;
        margin-bottom: 0.625rem;
        border-radius: 0.3125rem;
        line-height: 1.875rem;
      }

      li:nth-of-type(3n) {
        margin-right: 0;
      }

      .active {
        border: 0.0625rem solid red;
        background: #fff;
      }
    }
  }

  .relation-popup-lever {
    clear: both;

    h3 {
      color: red;
      font-size: 12px;
      margin: 0;
      line-height: 2.75rem;
      padding: 0 1.25rem;
      text-align: left;
      font-weight: normal;
      background: #fff;
    }

    ul {
      padding: 0 5% 0 5%;

      li {
        width: 30%;
        background: #e8e6e9;
        float: left;
        height: 1.875rem;
        margin-right: 5%;
        margin-bottom: 0.625rem;
        border-radius: 0.3125rem;
        line-height: 1.875rem;
      }

      li:nth-of-type(3n) {
        margin-right: 0;
      }

      .active {
        border: 0.0625rem solid red;
        background: #fff;
      }
      // }

      // li:nth-child(1){
      // 	margin-right:5%;
      // }
    }
  }

  .button {
    button {
      width: 90%;
      margin: 1.25rem auto;
      height: 2.875rem;
      background-color: #f15353;
    }
  }

  .tbs2 {
    background: #f5f5f5;
    align-items: center;
    border-bottom: #ebebeb 0.0625rem solid;
    padding: 0 0.625rem;

    .left {
      width: 46%;
      text-align: left;
      height: 2.8125rem;
      display: inline-block;
      line-height: 2.8125rem;

      img {
        width: 30%;
      }
    }

    .right {
      width: 46%;
      display: inline-block;
      text-align: right;
    }
  }

  .tbs {
    align-items: center;
    border-bottom: #ebebeb 0.0625rem solid;
    padding: 0.625rem 0.75rem;
    float: left;
    width: 100%;
    background: #fff;

    .left {
      font-size: 12px;
      box-sizing: border-box;
      width: 50%;
      text-align: left;
      height: 2.8125rem;
      line-height: 2.8125rem;
      float: left;

      img {
        width: 30%;
        float: left;
      }
    }

    .right {
      width: 50%;
      text-align: right;
    }

    a {
      color: #000;
    }

    .relation {
      color: #666;
    }

    .id,
    .level {
      font-size: 14px;
      line-height: 2.8125rem;
    }

    .fa.fa-search {
      color: #999;
      font-size: 20px;
    }

    i {
      font-size: 24px;
    }

    .img {
      margin: 0.625rem 0;
    }

    .li1 {
      width: 3.125rem;
      height: 3.125rem;
      // margin-top:10px;
      // margin-left:10px;
      float: left;
      line-height: 3.125rem;
      background: #ccc;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .li2 {
      float: left;
      height: 3.125rem;

      p {
        margin-top: 0.4375rem;
        margin-left: 0.625rem;
        text-align: left;
      }
    }

    .li3 {
      flex: 30%;
      width: 30%;

      span {
        border: #b1a6a6 solid 0.0625rem;
        padding: 0.3125rem 1.25rem;
        border-radius: 0.4375rem;
        display: none;
      }
    }

    .li4 {
      // flex: 5%;
      // width: 5%;
      float: right;
      height: 3.125rem;
      line-height: 3.125rem;
    }
  }

  .tbs2 {
    padding: 0.625rem 1.25rem;
  }

  .imgst {
    background: #f5f5f5;
  }

  .fade-enter-active {
    transition: 0.5s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    height: 0;
  }

  .tbs3 {
    .left {
      width: 46%;
      text-align: left;
      height: 2.8125rem;
      display: inline-block;
      line-height: 2.8125rem;

      img {
        width: 30%;
      }
    }

    .left1 {
      width: 100%;
      text-align: left;
      height: 2.8125rem;
      padding-left: 0.8125rem;
      display: inline-block;
      line-height: 2.8125rem;

      img {
        width: 30%;
      }
    }

    .right {
      width: 46%;
      display: inline-block;
      text-align: right;
      height: 2.8125rem;
      line-height: 2.8125rem;
    }
  }

  .search {
    height: 2.8125rem;
    line-height: 2.8125rem;
    position: relative;
    display: flex;
    overflow: hidden;
    background: #fff;
    border-bottom: 0.0625rem solid #f5f5f5;

    .back {
      width: 2.8125rem;

      i {
        line-height: 2.8125rem;
        font-size: 1.5rem;
      }
    }

    .search-box {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 85%;
      margin-left: 7.5%;
      margin-top: 0.5rem;
      padding: 0 0.625rem;
      background-color: #f2f2f2;
      height: 1.75rem;
      line-height: 1.75rem;
      border-radius: 0.875rem;

      input {
        flex: 1;
        line-height: 1.75rem;
        border: none;
        color: #333;
      }

      i {
        position: absolute;
        right: 1rem;
        flex: 0 0 1.5rem;
      }
    }
  }

  /* 滚动条样式 */
  .innerbox::-webkit-scrollbar {
    /* 滚动条整体样式 */
    width: 0; /* 高宽分别对应横竖滚动条的尺寸 */
    height: 0;
  }

  .innerbox::-webkit-scrollbar-thumb {
    /* 滚动条里面小方块 */
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #f15353;
  }

  .innerbox::-webkit-scrollbar-track {
    /* 滚动条里面轨道 */
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }
</style>
