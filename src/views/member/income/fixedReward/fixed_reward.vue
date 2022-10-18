<template>
    <div id="teamAgentCenter">
        <c-title :hide="false" text='固定奖励'></c-title>
        <div class="share_holder">
            <p>
                <span>累计奖励金额:{{total}}元</span>
               
            </p>
        </div>
    
        <div class="content">
			<van-tabs v-model="activeName">
                <van-tab name="first">
					<span slot="title" @click="handleClick('0')">奖励</span>
				</van-tab>
                <van-tab name="second" v-if="false">
					<span slot="title" @click="handleClick('1')" >奖励</span>
				</van-tab>
                <van-tab name="third" v-if="false">
					<span slot="title" @click="handleClick('2')" >奖励</span>
				</van-tab>
            </van-tabs>
            <div>
            <!-- <mt-tab-container v-model="activeName"> -->
            <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
                <!--<el-tab-pane label="奖励" name="first">-->
                <div v-show="activeName=='first'">
                <!-- <mt-tab-container-item id="first"> -->
                    <ul class='rationList'>
                        <li v-for="(item,i) in first_content" :key='i'>
                            <div class="detail">
                                <div class="info">
                                    <div class="left">
                                        <span>奖励类型:{{item.queue_name}}</span>
                                        <p>时间:{{item.created_at}}</p>
                                    </div>
                                    <div class="right">
                                        <b>奖励金额:{{item.dividend_amount}}</b>
                                        <span>总奖励金额:{{item.amount}}</span>
                                    </div>
                                </div>
    
                            </div>
    
                        </li>
                    </ul>
                <!-- </mt-tab-container-item> -->
                </div>
                <!--</el-tab-pane>-->
                <!--<el-tab-pane  label="奖励" name="second" v-if="false">-->
                <div v-show="activeName=='second'" v-if="false">
                <!-- <mt-tab-container-item id="second" v-if="false"> -->
                    <ul class='rationList'>
                        <li v-for="(elem,i) in second_content" :key='i'>
                            <div class="detail">
                                <span class="month">{{elem.create_month}}</span>
                                <div class="info" v-for="(item,i) in elem.has_many_dividend" :key='i'>
                                    <div class="left">
                                        <span>订单号：{{item.order_sn}}</span>
                                        <p>时间：{{item.created_at}}</p>
                                    </div>
                                    <div class="right">
                                        <b>{{item.dividend_amount}}</b>
                                        <br>
                                        <span>{{item.status_name}}</span>
    
                                    </div>
                                </div>
    
                            </div>
    
                        </li>
                    </ul>
                <!-- </mt-tab-container-item> -->
                </div>
                <!--</el-tab-pane>-->
                <!--<el-tab-pane  label="奖励" name="third" v-if="false">-->
                <div v-show="activeName=='third'" v-if="false">
                <!-- <mt-tab-container-item id="third" v-if="false"> -->
                    <ul class='rationList'>
                        <li v-for="(elem,i) in third_content" :key='i'>
                            <div class="detail">
                                <!--<span class="month">{{elem.create_month}}</span>-->
                                <div class="info">
                                    <div class="left">
                                        <h4>下级
                                            <b>{{elem.subordinate_name}}</b>{{elem.level_name}}</h4>
                                        <span class="created">{{elem.created_at}}</span>
                                    </div>
                                    <div class="right">
                                        <b class="created">+{{elem.reward_amount}}</b>
                                    </div>
                                </div>
    
                            </div>
    
                        </li>
                    </ul>
                <!-- </mt-tab-container-item> -->
                </div>
                <!--</el-tab-pane>-->
            <!--</el-tabs>-->
            <!-- </mt-tab-container> -->
            </div>
    
        </div>
    
    </div>
</template>

<script>
import fixed_reward_controller from './fixed_reward_controller';
export default fixed_reward_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

* { box-sizing: border-box; }

#teamAgentCenter {
  .share_holder {
    margin-bottom: 0.625rem;

    p {
      padding: 0 0.625rem;
      height: 3.75rem;
      line-height: 1.5625rem;
      padding-top: 0.3125rem;
      box-sizing: border-box;
      background: #f15353;
      color: #fff;

      span:first-child {
        float: left;
        line-height: 3.125rem;
      }

      span:nth-child(2) {
        float: left;
        font-size: 13px;
      }

      span:last-child {
        float: left;
        font-size: 13px;
      }
    }

    .today_bonus {
      width: 100%;
      height: 4.125rem;
      background: #fff;
      padding: 0.5rem 0;
      box-sizing: border-box;
      position: relative;
      border-bottom: 0.0625rem solid #ddd;

      li.line {
        position: absolute;
        width: 0.0625rem;
        height: 4.0625rem;
        background: #ddd;
        top: 0;
        right: 32%;

        .careat {
          width: 0.5rem;
          height: 0.5rem;
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
          top: 1.875rem;
          right: -0.25rem;
        }
      }

      li {
        height: 2.75rem;
        text-align: center;
        float: left;

        span {
          font-size: 17px;
          line-height: 1.625rem;
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
        border-right: 0.0625rem solid #ddd;
      }

      li.mounth {
        width: 33%;

        span {
          color: #fc6a70;
        }
      }
    }
  }

  .code {
    height: 2.75rem;
    width: 100%;
    background: #fff;
    padding: 0 0 0 3%;
    font-size: 14px;
    line-height: 2.75rem;
    color: #333;
    text-align: left;
    margin-top: 0.375rem;
    box-sizing: border-box;

    i {
      float: right;
      line-height: 2.75rem;
      display: inline-block;
      font-size: 14px;
      margin-right: 0.375rem;
      color: #929292;
      width: 1.25rem;
      height: 1.25rem;
      text-align: center;
      background-size: 20px;
    }
  }

  .content {
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
        border-bottom: 0.0625rem solid #ebebeb;

        span.month {
          display: block;
          text-align: left;
          padding: 0.3125rem 0.625rem;
          background: #f0f0f0;
        }

        .info {
          overflow: hidden;
          padding: 0.625rem;
          background: #fff;
          line-height: 1.25rem;

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
            span.created { font-size: 12px; }
            h4 { font-weight: normal; b { font-weight: normal; color: #f15353; } }
          }

          .right {
            float: right;
            width: 30%;
            color: #20b86a;
            text-align: right;

            p {
              margin: 0;
              padding: 0;
              font-size: 12px;
              color: #888;
            }
            b { font-weight: normal; }
            b.created { line-height: 2.1875rem; }
          }
        }
      }
    }
  }
}
</style>