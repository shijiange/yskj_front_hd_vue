<template>
    <div id="course">
        <c-title :hide="false" text='讲师分红'></c-title>
        <div class="box01">
            <div class="header"><img :src="avatar"></div>
            <span style="color: #fff; line-height: 1.875rem;">讲师:{{lecturer_name}}</span>
        </div>
        <div class="box02">
            <div class="lecturer-Ab">
                <span>讲师分红</span>
                <span class="right">累计：<b><i>{{$i18n.t('money')}}</i>{{lecturer_bonus}}</b></span>
            </div>
            <div class="lecturer-Ar">
                <div style="float: left; width: 50%; border-right: solid 0.0625rem rgb(221, 221, 221); padding: 0.375rem 0 0.25rem 0;">
                    <span style="color: #737372; font-size: 15px;">订单分红</span><br><br><span>{{$i18n.t('money')}}{{order_bonus}}</span>
                </div>
                <div style="float: left; width: 50%; padding: 0.375rem 0 0.25rem 0;">
                    <span style="color: #737372; font-size: 15px;">打赏分红</span><br><br><span>{{$i18n.t('money')}}{{reward_bonus}}</span>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="shareholder-order">
            <div id="tabs">
                <van-tabs v-model="activeName">
                    <van-tab name="first">
						<span slot="title" @click="handleClick('0')">全部</span>
					</van-tab>
                    <van-tab name="second">
						<span slot="title" @click="handleClick('1')">未结算</span>
					</van-tab>
                    <van-tab name="third">
						<span slot="title" @click="handleClick('2')">已结算</span>
					</van-tab>
                </van-tabs>
                <div>
                <!-- <mt-tab-container v-model="activeName"> -->
                <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
                    <!--<el-tab-pane label="全部" name="first">-->
                    <div v-show="activeName=='first'">
                    <!-- <mt-tab-container-item id="first"> -->
                        <div class="box03" v-for="(item,i) in first_content" :key='i'>
                            <div>
                                <div class="content01">
                                    <span style="color: #737372; line-height: 1.5rem; font-size: 14px;">订单号：{{item.order_sn}}</span>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">分红类型：{{item.reward_type_name}}</li>
                                        <li style="float: right; color: #f15353;">+{{item.amount}}元</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>
                                <!-- <div style="width:100%;height:0.0625rem;background-color:rgb(221, 221, 221);margin-left:0.75rem;"></div> -->
                            </div>
                        </div>
                    <!-- </mt-tab-container-item> -->
                    </div>
                    <!--</el-tab-pane>-->
                    <div v-show="activeName=='second'">
                    <!-- <mt-tab-container-item id="second"> -->
                    <!--<el-tab-pane label="未结算" name="second">-->
                        <div class="box03" v-for="(item,i) in second_content" :key='i'>
                            <div>
                                <div class="content01">
                                    <span style="color: #737372; line-height: 1.5rem; font-size: 14px;">订单号：{{item.order_sn}}</span>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">分红类型：{{item.reward_type_name}}</li>
                                        <li style="float: right; color: #f15353;">+{{item.amount}}元</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>
                                <!-- <div style="width:100%;height:0.0625rem;background-color:rgb(221, 221, 221);margin-left:0.75rem;"></div> -->
                            </div>
                        </div>
                    <!--</el-tab-pane>-->
                    <!-- </mt-tab-container-item> -->
                    </div>
                    <div v-show="activeName=='third'">
                    <!-- <mt-tab-container-item id="third"> -->
                    <!--<el-tab-pane label="已结算" name="third">-->
                        <div class="box03" v-for="(item,i) in third_content" :key='i'>
                            <div>
                                <div class="content01">
                                    <span style="color: #737372; line-height: 1.5rem; font-size: 14px;">订单号：{{item.order_sn}}</span>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">分红类型：{{item.reward_type_name}}</li>
                                        <li style="float: right; color: #f15353;">+{{item.amount}}元</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                    <ul style="line-height: 1.5rem;">
                                        <li style="float: left;">{{item.created_at}}</li>
                                        <li style="float: right; color: #00da8a;">{{item.status_name}}</li>
                                        <div class="clearfix"></div>
                                    </ul>
                                </div>
                                <!-- <div style="width:100%;height:0.0625rem;background-color:rgb(221, 221, 221);margin-left:0.75rem;"></div> -->
                            </div>
                        </div>
                    <!--</el-tab-pane>-->
                    <!-- </mt-tab-container-item> -->
                    </div>
                <!--</el-tabs>-->
                <!-- </mt-tab-container> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import index_controller from "./index_controller";
export default index_controller;
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
</style>
