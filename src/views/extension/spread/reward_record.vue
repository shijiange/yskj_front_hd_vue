<template>
<!-- 这个页面没用了 丽芬说这个插件没用了-->
    <div id="reward">
        <c-title :hide="false" text='奖励记录'></c-title>
        <section id="detail">
            <section id="reward-box">
                <ul class="reward">
                    <li>
                        <span>{{amount}}</span>
                        <span>奖励积分</span>
                    </li>
                    <li>
                        <span>{{amount_finishi}}</span>
                        <span>已奖励积分</span>
                    </li>
                    <li>
                        <span>{{amount_surplus}}</span>
                        <span>未奖励积分</span>
                    </li>
                </ul>
                <section id="reward-list">
                    <van-tabs v-model="activeName">
                        <van-tab name="0" title="奖励记录"></van-tab>
                    </van-tabs>
                    <div>
                    <!-- <mt-tab-container v-model="activeName"> -->
                    <!--<el-tabs>-->
                        <div v-show="activeName==0">
                        <!-- <mt-tab-container-item id="0"> -->
                        <!--<el-tab-pane label="奖励记录">-->
                            <mt-loadmore v-if="goload" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="coupon_loadmore" bottomPullText='' bottomDropText='下拉加载...' bottomLoadingText='' :autoFill='false' id='olis'>
                                <ul class="list" v-for="(item,i) in list" :key='i'>
                                    <h1><span>奖励记录ID：{{item.id}}</span><span>{{item.amount}}</span></h1>
                                    <li>
                                        <span>时间ID:{{item.id}}</span>
                                        <span>{{item.created_at}}</span>
                                    </li>
                                    <li @click="gotoDetail(item.id)">
                                        <span>查看记录</span>
                                        <span><i class="fa fa-angle-right"></i></span>
                                    </li>
                                </ul>
                            </mt-loadmore>
                            <!-- <ul class="list">
                                <h1><span>奖励记录ID：3026</span><span>300.00</span></h1>
                                <li>
                                    <span>时间ID:3026</span>
                                    <span>2018-06-19   09:48:00</span>
                                </li>
                                <li>
                                    <span>查看记录</span>
                                    <span><i class="fa fa-angle-right"></i></span>
                                </li>
                            </ul>
                            <ul class="list">
                                <h1><span>奖励记录ID：3026</span><span>300.00</span></h1>
                                <li>
                                    <span>时间ID:3026</span>
                                    <span>2018-06-19   09:48:00</span>
                                </li>
                                <li>
                                    <span>查看记录</span>
                                    <span><i class="fa fa-angle-right"></i></span>
                                </li>
                            </ul> -->
                        <!--</el-tab-pane>-->
                        <!-- </mt-tab-container-item> -->
                        </div>
                    <!--</el-tabs>-->
                    <!-- </mt-tab-container> -->
                    </div>
                </section>
            </section>
        </section>
    </div>
</template>

<script>
import record from "./reward_record_controller";
export default record;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #reward-box {
    .reward {
      background-color: #f15353;
      color: #fff;
      padding: 0.625rem 0;
      display: flex;
      margin-bottom: 0.625rem;

      li {
        width: 33.3%;
        line-height: 1.5rem;

        span {
          display: block;
        }

        span:first-child {
          font-size: 18px;
        }
      }
    }

    #reward-list {
      .list {
        margin-bottom: 0.375rem;
        background-color: #fff;

        h1 {
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          border-bottom: solid 0.0625rem #ebebeb;

          span:last-child {
            font-weight: normal;
            color: #f15353;
          }
        }

        li:nth-child(2) {
          height: 1.625rem;
          line-height: 1.625rem;
          margin-top: 0.625rem;
          display: flex;
          justify-content: space-between;
          color: #8c8c8c;
          font-size: 14px;
          padding: 0 0.875rem;
        }

        li:last-child {
          height: 2.75rem;
          line-height: 2.75rem;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 0 0.875rem;

          i {
            font-size: 1.5rem;
            color: #c9c9c9;
            line-height: 2.75rem;
          }
        }
      }
    }
  }
</style>