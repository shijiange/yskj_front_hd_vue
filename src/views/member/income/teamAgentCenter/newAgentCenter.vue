<template>
  <div id="teamAgentCenter">
    <c-title :hide="false" :text="mailTeamDividendTitle"></c-title>
    <div class="share_holder">
      <div class="header_box">
        <div class="left">
          <span>{{ level_name }}</span>
        </div>
        <ul class="right">
          <li>{{ mailDividend }}比例:{{ dividend_ratio }}%</li>
          <li>下级{{ mailDividend }}比例:{{ next_dividend_ratio }}%</li>
        </ul>
      </div>
      <div class="code_box">
        <router-link :to="fun.getUrl('newteamCode')" v-if="is_activation_code=='1'">
          <div class="list1 code">
            <div class="ico extension"></div>
            {{ $yzt("teamAgentCenter.myCode") }}
            <i class="fa fa-angle-right"></i>
          </div>
        </router-link>
        <router-link :to="fun.getUrl('newTeamClient')" v-if="is_customer != 1">
          <div class="list1 code">
            <div class="ico extension"></div>{{team_agent}}
            <span>({{ peopleCount }}人)</span>
            <i class="fa fa-angle-right"></i>
          </div>
        </router-link>
        <router-link :to="fun.getUrl('newFranchiserRed')">
          <div v-if="showRed === '1'" class="list1 code">
            <div class="ico extension"></div>红包奖励
            <i class="fa fa-angle-right"></i>
          </div>
        </router-link>
        <router-link :to="fun.getUrl('newteamPerformance')" v-if="is_team_data != 1">
          <div class="list1 code">
            <div class="ico extension"></div>
            团队业绩(订单金额：{{ Number(teamPerformance.team_order_price).toFixed(2) || 0 }} <br/>
            商品销量：{{ Number(teamPerformance.team_goods_total).toFixed(2) || 0 }})
            <i  class="fa fa-angle-right" ></i>
          </div>
        </router-link>
      </div>
      <ul class="today_bonus">
        <li v-for="(item,i) in ratioDatas" :key='i' :class="item.name">
          <span>{{ item.money }}</span>
          <br>
          <b>{{ item.data }}</b>
        </li>
        <li class="line">
          <div class="careat"></div>
        </li>
      </ul>
    </div>

    <div class="money">
      <ul class="gongge">
        <!--<li>-->
        <!--<i class="iconfont icon-zanwushouyi"></i>-->
        <!--<span>预计{{dividend_amount}}</span>-->
        <!--<b v-show="activeName === 'first'">{{dividend.expect}}<em>元</em></b>-->
        <!--<b v-show="activeName === 'second'">{{flat_prize.expect}}<em>元</em></b>-->
        <!--<b v-show="activeName === 'third'">{{award_gratitude.expect}}<em>元</em></b>-->
        <!--</li>-->
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>{{teamDividendLang.wait_dividend || '未结算'}}{{ dividend_amount }}</span>
          <b v-show="activeName === 'first'">
            {{ dividend.unliquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'second'">
            {{ flat_prize.unliquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'third'">
            {{ award_gratitude.unliquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'four'">
            {{ extra_award.unliquidated || 0 }}
            <em>元</em>
          </b>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>{{teamDividendLang.settle_dividend || '已结算'}}{{ dividend_amount }}</span>
          <b v-show="activeName === 'first'">
            {{ dividend.liquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'second'">
            {{ flat_prize.liquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'third'">
            {{ award_gratitude.liquidated || 0 }}
            <em>元</em>
          </b>
          <b v-show="activeName === 'four'">
            {{ extra_award.liquidated || 0 }}
            <em>元</em>
          </b>
        </li>
      </ul>
    </div>

    <div class="content">
		<van-tabs v-model="activeName">
			<van-tab name="first" v-if="bonus_active">
				<span slot="title" @click="handleClick('0')">{{ bonus_lable }}</span>
			</van-tab>

			<van-tab name="second" v-if="leveling_active">
				<span slot="title" @click="handleClick('1')">{{ leveling_label }}</span>
			</van-tab>

			<van-tab name="third" v-if="prize_active">
				<span slot="title" @click="handleClick('2')">{{ prize_label }}</span>
			</van-tab>

			<van-tab name="four" v-if="extra_active">
				<span slot="title" @click="handleClick('3')">{{ extra_award_label}}</span>
			</van-tab>
		</van-tabs>
      <div>
      <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'" v-if="bonus_active">
        <!-- <mt-tab-container-item id="first" v-if="bonus_active"> -->
          <ul class="rationList">
              <li v-for="(elem,index1) in first_content" :key='index1'>
                <div class="detail">
                  <span class="month">{{ elem.create_month }}</span>
                  <div class="info" v-for="(item,index2) in elem.has_many_dividend" :key='index2'>
                    <div @click="openDetail(index1,index2)" class="info-div">
                      <ul class="left">
                        <li>订单号：{{ item.order_sn }}</li>
                        <li class="time">时间：{{ item.created_at }}</li>
                      </ul>
                      <ul class="right">
                        <li>{{ item.dividend_amount }}</li>
                        <li class="state">{{ item.status_name }}</li>
                      </ul>
                    </div>
                    <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                    <div class="order_detail" :class="{'opens':index1==display1&&index2==display2}" v-if="is_team_order_details==1||is_team_buyer==1">
                        <div class="team_list" v-if="is_team_buyer==1">
                            <div class="img" v-if="item.member">
                                <img :src="item.member.avatar">
                            </div>
                            <div class="info1" v-if="item.member">{{item.member.nickname}}
                                <br>
                                <span>微信号:{{item.member.yz_member&&item.member.yz_member.wechat?item.member.yz_member.wechat:"暂无微信号"}}</span>
                            </div>
                        </div>
                        <div class="team_goods" id="distribution-goods" :key='i' v-for="(goods,i) in item.order_goods" v-show="is_team_order_details==1">
                            <div class="img">
                                <img :src="goods.thumb">
                            </div>
                            <div class="inner">
                                <div class="name">{{goods.title}}</div>
                            </div>
                            <div class="price">
                                <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                    <br> ×{{goods.total}}</b>
                                <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='second'" v-if="leveling_active">
        <!-- <mt-tab-container-item id="second" v-if="leveling_active"> -->
          <ul class="rationList">
              <li v-for="(elem,index1) in second_content" :key='index1'>
                <div class="detail">
                  <span class="month">{{ elem.create_month }}</span>
                  <div class="info" v-for="(item,index2) in elem.has_many_dividend" :key='index2'>
                    <div @click="openDetail(index1,index2)" class="info-div">
                      <ul class="left">
                        <li>订单号：{{ item.order_sn }}</li>
                        <li class="time">时间：{{ item.created_at }}</li>
                      </ul>
                      <ul class="right">
                        <li>{{ item.dividend_amount }}</li>
                        <li class="state">{{ item.status_name }}</li>
                      </ul>
                    </div>
                     <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                    <div class="order_detail" :class="{'opens':index1==display1&&index2==display2}" v-if="is_team_order_details==1||is_team_buyer==1">
                        <div class="team_list" v-if="is_team_buyer==1">
                            <div class="img" v-if="item.member">
                                <img :src="item.member.avatar">
                            </div>
                            <div class="info1" v-if="item.member">{{item.member.nickname}}
                                <br>
                                <span>微信号:{{item.member.yz_member&&item.member.yz_member.wechat?item.member.yz_member.wechat:"暂无微信号"}}</span>
                            </div>
                        </div>
                        <div class="team_goods" :key='i' id="distribution-goods" v-for="(goods,i) in item.order_goods" v-show="is_team_order_details==1">
                            <div class="img">
                                <img :src="goods.thumb">
                            </div>
                            <div class="inner">
                                <div class="name">{{goods.title}}</div>
                            </div>
                            <div class="price">
                                <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                    <br> ×{{goods.total}}</b>
                                <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='third'" v-if="prize_active">
        <!-- <mt-tab-container-item id="third" v-if="prize_active"> -->
          <ul class="rationList">
              <li v-for="(elem,index1) in third_content" :key='index1'>
                <div class="detail">
                  <span class="month">{{ elem.create_month }}</span>
                  <div class="info" v-for="(item,index2) in elem.has_many_dividend" :key='index2'>
                    <div @click="openDetail(index1,index2)" class="info-div">
                      <ul class="left">
                        <li>订单号：{{ item.order_sn }}</li>
                        <li class="time">时间：{{ item.created_at }}</li>
                      </ul>
                      <ul class="right">
                        <li>{{ item.dividend_amount }}</li>
                        <li class="state">{{ item.status_name }}</li>
                      </ul>
                    </div>
                    <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                    <div class="order_detail" :class="{'opens':index1==display1&&index2==display2}" v-if="is_team_order_details==1||is_team_buyer==1">
                        <div class="team_list" v-if="is_team_buyer==1">
                            <div class="img" v-if="item.member">
                                <img :src="item.member.avatar">
                            </div>
                            <div class="info1" v-if="item.member">{{item.member.nickname}}
                                <br>
                                <span>微信号:{{item.member.yz_member&&item.member.yz_member.wechat?item.member.yz_member.wechat:"暂无微信号"}}</span>
                            </div>
                        </div>
                        <div class="team_goods" id="distribution-goods" :key='i' v-for="(goods,i) in item.order_goods" v-show="is_team_order_details==1">
                            <div class="img">
                                <img :src="goods.thumb">
                            </div>
                            <div class="inner">
                                <div class="name">{{goods.title}}</div>
                            </div>
                            <div class="price">
                                <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                    <br> ×{{goods.total}}</b>
                                <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </li>
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='four'" v-if="extra_active">
        <!-- <mt-tab-container-item id="four" v-if="extra_active"> -->
          <ul class="rationList">
              <li v-for="(elem,i) in four_content" :key='i'>
                <div class="detail">
                  <span class="month">{{ elem.create_month }}</span>
                  <div class="info" v-for="(item,i) in elem.has_many_dividend" :key='i'>
                    <div class="info" v-for="(item,index2) in elem.has_many_dividend" :key='index2'>
                      <ul class="left">
                        <li>订单号：{{ item.order_sn }}</li>
                        <li class="time">时间：{{ item.created_at }}</li>
                      </ul>
                      <ul class="right">
                        <li>{{ item.dividend_amount }}</li>
                        <li class="state">{{ item.status_name }}</li>
                      </ul>
                    </div>
                     <!--点击展开    ——Collapse 折叠面板   手风琴效果，每次只能展开一个面板-->
                    <div class="order_detail" :class="{'opens':index1==display1&&index2==display2}" v-if="is_team_order_details==1||is_team_buyer==1">
                      <div class="team_list" v-if="is_team_buyer==1">
                          <div class="img" v-if="item.member">
                              <img :src="item.member.avatar">
                          </div>
                          <div class="info1" v-if="item.member">{{item.member.nickname}}
                              <br>
                              <span>微信号:{{item.member.yz_member&&item.member.yz_member.wechat?item.member.yz_member.wechat:"暂无微信号"}}</span>
                          </div>
                      </div>
                      <div class="team_goods" id="distribution-goods" :key='i' v-for="(goods,i) in item.order_goods" v-show="is_team_order_details==1">
                          <div class="img">
                              <img :src="goods.thumb">
                          </div>
                          <div class="inner">
                              <div class="name">{{goods.title}}</div>
                          </div>
                          <div class="price">
                              <b>{{$i18n.t('money')}}{{(goods.goods_price/goods.total)}}
                                  <br> ×{{goods.total}}</b>
                              <div class="Total">{{$i18n.t('money')}}{{goods.goods_price}}</div>
                          </div>
                      </div>
                  </div>
                  </div>
                </div>
              </li>
          </ul>
        <!-- </mt-tab-container-item> -->
        </div>
        <ul class="rationList">
          <li v-for="(elem,i) in third_content" :key='i'>
            <div class="detail">
              <div class="info">
                <div class="left">
                  <h4>
                    下级
                    <b>{{ elem.subordinate_name }}</b>
                    {{ elem.level_name }}
                  </h4>
                  <span class="created">{{ elem.created_at }}</span>
                </div>
                <div class="right">
                  <b class="created">+{{ elem.reward_amount }}</b>
                </div>
              </div>
            </div>
          </li>
        </ul>
      <!-- </mt-tab-container> -->
      </div>
    </div>
  </div>
</template>

<script>
import new_agent_center_controller from "./new_agent_center_controller";

export default new_agent_center_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: border-box;
}

.money {
  margin-top: 0.5rem;
}

.gongge {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  column-count: 3;
  padding-bottom: 0.625rem;
  padding-top: 0.625rem;

  li {
    width: 50%;
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 12px;

    i {
      flex: 0 0 1.75rem;
      font-size: 26px;
      color: #999;
      display: inline-block;
      margin-bottom: 0.375rem;
      width: 100%;
    }

    span {
      flex: 0 0 1.4rem;
      color: #333;
      font-size: 12px;
    }

    b {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #f15353;
      font-size: 16px;
    }
  }
}

.today_bonus {
  display: flex;
  margin-top: 10px;
  width: 100%;
  height: 5.125rem;
  background: #fff;
  padding: 1rem 0;
  box-sizing: border-box;
  position: relative;
  border-bottom: solid 0.0625rem #e2e2e2;

  li.line {
    position: absolute;
    width: 0.0625rem;
    height: 3.25rem;
    background: #ddd;
    top: 1rem;
    right: 34%;

    .careat {
      width: 0.375rem;
      height: 0.375rem;
      border: 0.0625rem solid #ebebeb;
      border-left: 0;
      border-bottom: 0;
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg);
      background: #fff;
      position: absolute;
      top: 1.4375rem;
      right: -0.1875rem;
    }
  }

  li {
    text-align: center;
    float: left;

    span {
      font-size: 17px;
      line-height: 1.625rem;
      display: inline-block;
      margin-bottom: 0.625rem;
    }

    b {
      font-size: 11px;
      color: #333;
    }
  }
}

#teamAgentCenter {
  .share_holder {
    .header_box {
      padding: 1rem 0.75rem;
      background: #f15353;
      color: #fff;
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      .left {
        line-height: 3rem;
      }

      .right {
        text-align: right;

        li {
          line-height: 1.5rem;
        }
      }
    }

    .today_bonus {
      margin-top: 0.625rem;
      width: 100%;
      height: 5.125rem;
      background: #fff;
      padding: 1rem 0;
      box-sizing: border-box;
      position: relative;
      border-bottom: solid 0.0625rem #e2e2e2;

      li.line {
        position: absolute;
        width: 0.0625rem;
        height: 3.25rem;
        background: #ddd;
        top: 1rem;
        right: 34%;

        .careat {
          width: 0.375rem;
          height: 0.375rem;
          border: 0.0625rem solid #ebebeb;
          border-left: 0;
          border-bottom: 0;
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          -o-transform: rotate(45deg);
          transform: rotate(45deg);
          background: #fff;
          position: absolute;
          top: 1.4375rem;
          right: -0.1875rem;
        }
      }

      li {
        text-align: center;
        float: left;

        span {
          font-size: 17px;
          line-height: 1.625rem;
          display: inline-block;
          margin-bottom: 0.625rem;
        }

        b {
          font-size: 11px;
          color: #333;
        }
      }

      li.data {
        width: 22%;

        span {
          color: #ffa800;
        }
      }

      li:first-child,
      li:nth-child(2) {
        border-right: 0.0625rem solid #e2e2e2;
      }

      li.mounth {
        width: 34%;

        span {
          color: #fc6a70;
        }
      }
    }
  }

  .code_box {
    background: #fff;
    padding-left: 0.875rem;
  }

  .code {
    /* height: 2.75rem; */
    background: #fff;
    padding-right: 0.875rem;
    font-size: 15px;
    line-height: 2.75rem;
    color: #333;
    text-align: left;
    box-sizing: border-box;
    border-bottom: solid 0.0625rem #ebebeb;

    i {
      float: right;
      line-height: 2.75rem;
      display: inline-block;
      font-size: 24px;
      color: #c9c9c9;
      text-align: center;
      background-size: 1.25rem;
    }
  }

  .content {
    margin-top: 10px;

    .ratioNav {
      padding: 0;
      margin: 0;
      height: 2.375rem;
      width: 100%;
      background: #fff;
      border-bottom: 0.0625rem solid #cdcdcd;
      border-top: 0.0625rem solid #cdcdcd;

      li {
        float: left;
        width: 33%;
        text-align: center;
        line-height: 2.1875rem;
        font-size: 14px;
        color: #666;
      }
    }

    .rationList {
      padding: 0;
      margin: 0;

      li {
        span.month {
          display: block;
          text-align: left;
          line-height: 2.25rem;
          padding: 0 0.75rem;
          background: #f0f0f0;
          font-size: 16px;
        }

        .info {
          border-bottom: 0.0625rem solid #eee;
          overflow: hidden;
          padding: 0.625rem 0.75rem;
          background: #fff;
          font-size: 14px;

          .info-div {
            width: 100%;
            float: left;
          }

          .left {
            width: 70%;
            float: left;
            text-align: left;
            box-sizing: border-box;

            .time {
              font-size: 12px;
              color: #8c8c8c;
            }

            li {
              line-height: 1.5rem;
            }

            span {
              font-size: 14px;
              font-weight: 400;
              color: #333;
            }

            p {
              font-size: 12px;
              color: #999;
            }

            span.created {
              font-size: 12px;
            }

            h4 {
              font-weight: normal;

              b {
                font-weight: normal;
                color: #f15353;
              }
            }
          }

          .right {
            float: left;
            width: 30%;
            color: #20b86a;
            text-align: right;

            .state {
              font-size: 12px;
              color: #8c8c8c;
            }

            li {
              line-height: 1.5rem;
            }

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
              color: #888;
            }

            b {
              font-weight: normal;
            }

            b.created {
              line-height: 2.1875rem;
            }
          }
        }
      }
    }
  }
}

.order_detail.opens {
  display: block;
}

.order_detail {
  display: none;
  overflow: hidden;
  width: 100%;

  .team_list {
    background-color: #fff;
    padding: 0.625rem 0;
    overflow: hidden;
    border-top: 0.0625rem solid #e2e2e2;

    .img {
      width: 14%;
      float: left;
      text-align: left;
      height: 0;
      padding-bottom: 14%;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }

    .info1 {
      height: 2.5rem;
      width: 80%;
      float: left;
      font-size: 14px;
      color: #222;
      line-height: 1.429rem;
      text-align: left;
      padding: 0 0.625rem;

      span {
        color: #666;
      }
    }
  }
}

#distribution-goods {
  background-color: #fff;
  display: flex;
  align-items: stretch;
  flex-flow: row wrap;
  padding-top: 10px;
  border-top: 0.0625rem solid #e2e2e2;
  margin-bottom: 0.375rem;

  .img {
    flex: 1;

    img {
      width: 100%;
    }
  }

  .inner {
    flex: 5;
    padding: 0 0.625rem;
    display: flex;
    align-items: flex-start;
  }

  .name {
    flex: 5;
    text-align: justify;
  }

  .price {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    b {
      flex: 3;
      text-align: right;
      color: #666;
      font-size: 12px;
      font-weight: normal;
    }

    .evaluate-yet {
      margin: 0;
      color: #888;
      float: right;
      line-height: 1.6rem;
    }
  }
}
</style>
