<template>
    <div id="course">
        <c-title :hide="false" text='区域管理'></c-title>
        <div class="box01" v-if="member">
            <div class="header"><img :src="member.avatar"></div>
            <div class="right">
                <span style="color: #fff; line-height: 1.4rem;">{{member.nickname}}</span>
                <div class="bottom" v-if="level_name">{{level_name}}</div>
            </div>
        </div>
        <ul class="today_bonus" v-if="statistic">
            <li class="data">
                <span>{{statistic.today}}</span>
                <br>
                <b>今日</b>
            </li>
            <li class="data">
                <span>{{statistic.yesterday}}</span>
                <br>
                <b>昨日</b>
            </li>
            <li class="data">
                <span>{{statistic.this_week}}</span>
                <br>
                <b>本周</b>
            </li>
            <li class="mounth">
                <span>{{statistic.this_month}}</span>
                <br>
                <b>本月累计分红</b>
            </li>
            <li class="line">
                <div class="careat"></div>
            </li>
        </ul>
        <div class="shareholder-order">
            <div id="tabs">
				<van-tabs v-model="activeName">
					<van-tab name="first">
						<span @click="handleClick('1')" slot="title">全部</span>
					</van-tab>
					<van-tab name="second">
						<span @click="handleClick('2')" slot="title">已发放</span>
					</van-tab>
					<van-tab name="third" >
						<span @click="handleClick('3')" slot="title">未发放</span>
					</van-tab>
				</van-tabs>
                <div>
                <!-- <mt-tab-container v-model="activeName"> -->
                    <div v-show="activeName=='first'">
                    <!-- <mt-tab-container-item id="first"> -->
                        <div class="box03" v-for="(item,i) in all" :key='i'>
                            <div>
                                <div class="content01" @click="godividends(item.id)">
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">区域分红ID：{{item.dividend_id}}</li>
                                        <li style="float: right; color: #f15353;">{{item.amount}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    <!-- </mt-tab-container-item> -->
                    </div>
                    <div v-show="activeName=='second'">
                    <!-- <mt-tab-container-item id="second"> -->
                        <div class="box03" v-for="(item,i) in Issued" :key='i'>
                            <div>
                                <div class="content01" @click="godividends(item.id)">
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">区域分红ID：{{item.dividend_id}}</li>
                                        <li style="float: right; color: #f15353;">{{item.amount}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    <!-- </mt-tab-container-item> -->
                    </div>
                    <div v-show="activeName=='third'">
                    <!-- <mt-tab-container-item id="third"> -->
                        <div class="box03" v-for="(item,i) in notIssued" :key='i'>
                            <div>
                                <div class="content01" @click="godividends(item.id)">
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">区域分红ID：{{item.dividend_id}}</li>
                                        <li style="float: right; color: #f15353;">{{item.amount}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    <!-- </mt-tab-container-item> -->
                    </div>
                <!-- </mt-tab-container> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import regionaldividend_controller from "./regionaldividend_controller";
export default regionaldividend_controller;
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .header img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .box01 {
    padding: 1.25rem;
    width: 100%;
    background-color: #f15353;
    display: flex;
    align-items: flex-start;

    span {
      margin-left: 0.625rem;
      font-size: 14px;
      font-weight: bold;
      display: block;
    }

    .right {
      .bottom {
        height: 1.4rem;
        width: 4.5rem;
        background: rgba(21, 20, 22, 0.4);
        color: #fff;
        text-align: center;
        line-height: 1.4rem;
        border-radius: 1rem;
        margin-left: 0.625rem;
        font-size: 12px;
      }
    }
  }

  .header {
    width: 3rem;
    height: 3rem;
    border: solid 0.125rem #fff;
    text-align: center;
    background-color: #333;
    border-radius: 50%;
    overflow: hidden;
  }

  .clearfix {
    clear: both;
  }

  .box02 {
    width: 100%;
    background-color: #fff;
    margin-top: 0.625rem;
    border-bottom: solid 0.0625rem #ebebeb;
  }

  .lecturer-Ab {
    height: 2.75rem;
    line-height: 2.75rem;
    text-align: left;
    padding: 0 0.75rem;
    color: #333;
    font-size: 14px;
    border-bottom: solid 0.0625rem #ebebeb;
    display: flex;
    justify-content: space-between;

    .right {
      i { font-weight: normal; }
      b { font-size: 16px; color: #f15353; }
    }
  }

  .lecturer-Ar {
    padding: 0.5rem 0 0.625rem 0;
  }

  .box03 {
    width: 100%;
    background-color: #fff;
    margin-top: 0.25rem;
    text-align: left;
  }

  .content01 {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 0.75rem;
    border-bottom: solid 1px #ebebeb;
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
</style>