<template>
  <div id="shareholderCenter">
    <c-title :hide="false" :text="area_dividend"></c-title>

    <div class="share_holder">
      <div class="header-box">
        <span>{{ level_name }}</span>
        <span>分红比例:{{ rate }}%</span>
      </div>
      <div class="header-box" style="padding-top: 0.5rem; padding-bottom: 0.5rem;" v-if="agent_many">
        <div class="moreBtn" @click="showPopupTap">
          查看更多
          <i class="iconfont icon-advertise-next"></i>
        </div>
      </div>
      <div class="application" v-if="agent_many" @click="toSelectionarea">
        <i class="iconfont icon-massage_client" style="color: #f15353;"></i>
        <div class="applicationTxt">{{ (mailLanguage.area_dividend && mailLanguage.area_dividend.title) || "区域代理" }}申请</div>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <ul class="today_bonus">
        <li v-for="(item, i) in ratioDatas" :key="i" :class="item.name">
          <span>{{ item.money }}</span>
          <br />
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
        <!--<b>{{dividend.expect}}<em>元</em></b>-->
        <!--</li>-->
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>未结算{{ dividend_amount }}</span>
          <b>{{ dividend.unliquidated }}<em>元</em></b>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>已结算{{ dividend_amount }}</span>
          <b>{{ dividend.liquidated }}<em>元</em></b>
        </li>
      </ul>
    </div>
    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">全部</span>
          </van-tab>
          <van-tab name="second">
            <span slot="title" @click="handleClick('1')">已结算</span>
          </van-tab>
          <van-tab name="third">
            <span slot="title" @click="handleClick('2')">未结算</span>
          </van-tab>
          <van-tab name="fourth">
            <span slot="title" @click="handleClick('3')">已失效</span>
          </van-tab>
        </van-tabs>
        <div style="text-align: left; background: #f5f5f5;">
          <!-- <mt-tab-container v-model="activeName" style="text-align:left;background:#f5f5f5"> -->
          <div v-show="activeName == 'first'">
            <!-- <mt-tab-container-item id="first"> -->
            <div>
              <div v-for="(item, index) in datas" :key="index" style="margin-top: 0.25rem; background: #fff;">
                <van-cell :title="item.create_month" is-link @click="getOtherList(item.create_month, index)" />
                <ul class="rationList1" v-show="item.is_show == 1">
                  <li v-for="(item1, index1) in item.data" :key="index1">
                    <div class="detail">
                      <div class="info">
                        <ul class="left">
                          <li>订单号：{{ item1.order_sn }}</li>
                          <li class="time">时间：{{ item1.created_at }}</li>
                        </ul>
                        <ul class="right">
                          <li>分红+{{ item1.dividend_amount }}</li>
                          <li class="state">{{ item1.status_name }}</li>
                        </ul>
                        <span style="color: #8c8c8c; font-size: 12px;" v-if="agent_many">代理区域：{{ item1.agent_area }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div style="text-align: center; padding: 10px 0;" v-if="item.current_page < item.last_page">
                  <van-button type="default" size="small" @click="getMore(item.create_month, index)">加载更多+</van-button>
                </div>
              </div>
            </div>
            <!-- <ul class='rationList'>

                            <li v-for="elem in first_content" v-if="elem.has_many_dividend.length > 0">
                                <div class="detail">
                                    <span class="month">{{elem.create_month}}</span>
                                    <div class="info" v-for="item in elem.has_many_dividend">
                                        <ul class="left">
                                            <li>订单号：{{item.order_sn}}</li>
                                            <li class="time">时间：{{item.created_at}}</li>

                                        </ul>
                                        <ul class="right">
                                            <li>分红+{{item.dividend_amount}}</li>
                                            <li class="state">{{item.status_name}}</li>
                                        </ul>
                                    </div>

                                </div>

                            </li>
                        </ul> -->
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-show="activeName == 'second'">
            <!-- <mt-tab-container-item id="second"> -->
            <div>
              <div v-for="(item, index) in datas" :key="index" style="margin-top: 0.25rem; background: #fff;">
                <van-cell :title="item.create_month" is-link @click="getOtherList(item.create_month, index)" />
                <ul class="rationList1" v-show="item.is_show == 1">
                  <li v-for="(item1, index1) in item.data" :key="index1">
                    <div class="detail">
                      <div class="info">
                        <ul class="left">
                          <li>订单号：{{ item1.order_sn }}</li>
                          <li class="time">时间：{{ item1.created_at }}</li>
                        </ul>
                        <ul class="right">
                          <li>分红+{{ item1.dividend_amount }}</li>
                          <li class="state">{{ item1.status_name }}</li>
                        </ul>
                        <span style="color: #8c8c8c; font-size: 12px;" v-if="agent_many">代理区域：{{ item1.agent_area }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div style="text-align: center; padding: 10px 0;" v-if="item.current_page < item.last_page">
                  <van-button type="default" size="small" @click="getMore(item.create_month, index)">加载更多+</van-button>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-show="activeName == 'third'">
            <!-- <mt-tab-container-item id="third"> -->
            <div>
              <div v-for="(item, index) in datas" :key="index" style="margin-top: 0.25rem; background: #fff;">
                <van-cell :title="item.create_month" is-link @click="getOtherList(item.create_month, index)" />
                <ul class="rationList1" v-show="item.is_show == 1">
                  <li v-for="(item1, index1) in item.data" :key="index1">
                    <div class="detail">
                      <div class="info">
                        <ul class="left">
                          <li>订单号：{{ item1.order_sn }}</li>
                          <li class="time">时间：{{ item1.created_at }}</li>
                        </ul>
                        <ul class="right">
                          <li>分红+{{ item1.dividend_amount }}</li>
                          <li class="state">{{ item1.status_name }}</li>
                        </ul>
                        <span style="color: #8c8c8c; font-size: 12px;" v-if="agent_many">代理区域：{{ item1.agent_area }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div style="text-align: center; padding: 10px 0;" v-if="item.current_page < item.last_page">
                  <van-button type="default" size="small" @click="getMore(item.create_month, index)">加载更多+</van-button>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-show="activeName == 'fourth'">
            <!-- <mt-tab-container-item id="fourth"> -->
            <div>
              <div v-for="(item, index) in datas" :key="index" style="margin-top: 0.25rem; background: #fff;">
                <van-cell :title="item.create_month" is-link @click="getOtherList(item.create_month, index)" />
                <ul class="rationList1" v-show="item.is_show == 1">
                  <li v-for="(item1, index1) in item.data" :key="index1">
                    <div class="detail">
                      <div class="info">
                        <ul class="left">
                          <li>订单号：{{ item1.order_sn }}</li>
                          <li class="time">时间：{{ item1.created_at }}</li>
                        </ul>
                        <ul class="right">
                          <li>分红+{{ item1.dividend_amount }}</li>
                          <li class="state">{{ item1.status_name }}</li>
                        </ul>
                        <span style="color: #8c8c8c; font-size: 12px;" v-if="agent_many">代理区域：{{ item1.agent_area }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
                <div style="text-align: center; padding: 10px 0;" v-if="item.current_page < item.last_page">
                  <van-button type="default" size="small" @click="getMore(item.create_month, index)">加载更多+</van-button>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <!-- </mt-tab-container> -->
        </div>
      </div>
    </div>
    <van-popup v-model="showPopup" position="bottom" :style="{ height: '40%' }" round="true">
      <van-nav-bar title="代理区域" placeholder="true">
        <template #right>
          <van-icon name="cross" size="18" color="#000" @click="showPopup = false" />
        </template>
      </van-nav-bar>
      <div class="ptbox">
        <div class="clbox">
          <span style="color: #9e9e9e;">代理区域</span>
          <span style="color: #9e9e9e;">分红比例</span>
        </div>
      </div>
      <div class="fotitem" v-for="(item, ind) in moreList" :key="ind">
        <div class="ptbox">
          <div class="clbox">
            <span>{{item.level_name}}</span>
            <span>{{item.rate}}%</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import regional_agency_center_controller from "./regional_agency_center_controller";

export default regional_agency_center_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.money {
  margin: 0.5rem 0;
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

#shareholderCenter {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    font-size: 15px;
    font-weight: bold;
    background: #fff;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }
  }

  .share_holder {
    .header-box {
      font-size: 14px;
      padding: 1rem 0.75rem;
      background: #f15353;
      color: #fff;
      display: flex;
      justify-content: space-between;

      .moreBtn {
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        color: #f15353;
        padding: 0.325rem;
        border-radius: 0.325rem;
      }

      span {
        line-height: 1.5rem;
      }
    }

    .application {
      margin: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #fff;

      .applicationTxt {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 0.325rem;
      }
    }

    .today_bonus {
      width: 100%;
      height: 5.125rem;
      margin-top: 0.625rem;
      background: #fff;
      padding: 1rem 0;
      box-sizing: border-box;
      position: relative;
      border-bottom: 0.0625rem solid #e2e2e2;

      li.line {
        position: absolute;
        width: 0.0625rem;
        height: 3.25rem;
        background: #e2e2e2;
        top: 1rem;
        right: 34%;

        .careat {
          width: 0.375rem;
          height: 0.375rem;
          border: 0.0625rem solid #ddd;
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

  .shareholder-order {
    background: #fff;

    .input {
      input {
        margin: 0.625rem 5%;
        width: 80%;
        height: 1.875rem;
        border-radius: 0.375rem;
        border: 0;
        outline: 0;
        padding-left: 1.875rem;
        background: url(../../../../assets/images/search.png) no-repeat 0.625rem 0.5rem #f2f2f2;
      }
    }

    .ratioNav {
      padding: 0;
      margin: 0;
      height: 2.5rem;
      width: 100%;
      background: #fff;
      border-bottom: 0.0625rem solid #cdcdcd;
      border-top: 0.0625rem solid #cdcdcd;

      li {
        float: left;
        width: 33%;
        text-align: center;
        line-height: 2.5rem;
        font-size: 14px;
        color: #666;
        border-bottom: 0.125rem solid transparent;
      }

      .selected {
        color: #f15353 !important;
        border-bottom: 0.125rem solid #f15353;
      }
    }

    .rationList1 {
      padding: 0;
      margin: 0;

      li {
        span.month {
          display: block;
          text-align: left;
          line-height: 2.25rem;
          padding: 0 0.75rem;
          font-size: 16px;
          background: #f0f0f0;
        }

        .info {
          border-bottom: 0.0625rem solid #e2e2e2;
          overflow: hidden;
          padding: 0.625rem 0.75rem;
          line-height: 1.25rem;
          font-size: 14px;

          li {
            line-height: 1.5rem;
          }

          .time,
          .state {
            color: #8c8c8c;
            font-size: 12px;
          }

          .left {
            width: 70%;
            float: left;
            text-align: left;
            box-sizing: border-box;

            span {
              font-size: 14px;
              font-weight: 400;
              color: #333;
            }

            p {
              font-size: 12px;
              color: #999;
            }
          }

          .right {
            float: left;
            width: 30%;
            color: #20b86a;
            text-align: right;

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
              color: #888;
            }
          }
        }
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f3f5f7;

    .input {
      display: flex;
      height: 2.8125rem;
      background: #fff;
      box-sizing: border-box;
      margin: 0 0.625rem;

      i {
        font-size: 16px;
        line-height: 2.8125rem;
        padding-left: 0.25rem;
      }

      input {
        margin: 0.625rem 5%;
        width: 80%;
        height: 1.875rem;
        background: #f2f2f2;
        border-radius: 0.375rem;
        border: 0;
        outline: 0;
        padding-left: 1.875rem;
      }
    }

    .modal-dialog {
      h1 {
        font-size: 16px;
        color: #666;
        line-height: 3.4375rem;
        font-weight: normal;
        text-align: left;
        padding-left: 1.5625rem;
      }

      .select-time {
        text-align: center;

        .block {
          width: 36%;
          display: inline-block;
        }

        .el-input {
          width: 100%;
        }

        span {
          font-size: 22px;
          font-weight: 400;
        }
      }

      .submit {
        width: 20.3125rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        background-color: #f15353;
        text-align: center;
        line-height: 2.5rem;
        color: #fff;
        border: 0;
        outline: 0;
        font-size: 14px;
        font-weight: bold;
        margin-top: 1.25rem;
      }
    }
  }

  .fotitem:last-child {
    padding-bottom: 1rem;
  }

  .ptbox {
    // padding:0 1.9375rem;
    margin: 0 0.625rem;
    height: 2.56rem;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    align-items: center;

    .clbox {
      height: 100%;
      flex: 1;
      padding: 0 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .serchActive {
    display: none !important;
  }

  .van-collapse-item__content {
    padding: 0 !important;
  }
}
</style>
