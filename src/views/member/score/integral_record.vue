<template>
  <div id="get_record">
    <c-title :hide="false" :text="'赠送记录'"></c-title>
    <div id="content">
      <ul class="get_state">
        <li>
          <span>已领取</span>
          <span>{{ receive_point }}</span>
        </li>
        <li>
          <span>已使用</span>
          <span>{{ used_point }}</span>
        </li>
        <li>
          <span>已过期</span>
          <span>{{ validity_point }}</span>
        </li>
      </ul>
      <div class="list_box">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">全部</span>
          </van-tab>
          <van-tab name="second">
            <span slot="title" @click="handleClick('1')">已领取</span>
          </van-tab>
          <van-tab name="third">
            <span slot="title" @click="handleClick('2')">使用中</span>
          </van-tab>
          <van-tab name="fourth">
            <span slot="title" @click="handleClick('3')">已使用</span>
          </van-tab>
          <van-tab name="five">
            <span slot="title" @click="handleClick('4')">已过期</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
          <!--<el-tab-pane label="全部" name="first">-->
          <div v-if="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <div class="get_box">
              <div class="list" v-for="(list, i) in dataList" :key="i">
                <div class="state_a">
                  <ul class="state">
                    <li class="left">
                      <div class="img">
                        <img :src="list.avatar"/>
                      </div>
                      <span>{{ list.nickname }}</span>
                    </li>
                    <li class="right">{{ list.status_name }}</li>
                  </ul>
                </div>
                <ul class="state_b">
                  <li>
                    <span>已使用：</span>
                    <span>{{ list.used }}</span>
                  </li>
                  <li>
                    <span>剩余：</span>
                    <span>{{ list.stock }}</span>
                  </li>
                </ul>
                <div class="time">
                  <span>{{ list.created_at }}</span>
                  <span v-show="list.validity_at">有效期至：{{ list.validity_at }}</span>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-if="activeName=='second'">
            <!-- <mt-tab-container-item id="second"> -->
            <div class="get_box">
              <div class="list" v-for="(list, i) in dataList" :key="i">
                <div class="state_a">
                  <ul class="state">
                    <li class="left">
                      <div class="img">
                        <img :src="list.avatar"/>
                      </div>
                      <span>{{ list.nickname }}</span>
                    </li>
                    <li class="right">{{ list.status_name }}</li>
                  </ul>
                </div>
                <ul class="state_b">
                  <li>
                    <span></span>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                    <span>+{{ list.stock }}</span>
                  </li>
                </ul>
                <div class="time">
                  <span>{{ list.created_at }}</span>
                  <span v-show="list.validity_at">有效期至：{{ list.validity_at }}</span>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-if="activeName=='three'">
            <!-- <mt-tab-container-item id="three"> -->
            <div class="get_box">
              <div class="list" v-for="(list, i) in dataList" :key="i">
                <div class="state_a">
                  <ul class="state">
                    <li class="left">
                      <div class="img">
                        <img :src="list.avatar"/>
                      </div>
                      <span>{{ list.nickname }}</span>
                    </li>
                    <li class="right">{{ list.status_name }}</li>
                  </ul>
                </div>
                <ul class="state_b">
                  <li>
                    <span>已使用：</span>
                    <span>{{ list.used }}</span>
                  </li>
                  <li>
                    <span>剩余：</span>
                    <span>{{ list.stock }}</span>
                  </li>
                </ul>
                <div class="time">
                  <span>{{ list.created_at }}</span>
                  <span v-show="list.validity_at">有效期至：{{ list.validity_at }}</span>
                </div>
              </div>
            </div>
            <!--</el-tab-pane>-->
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-if="activeName=='fourth'">
            <!-- <mt-tab-container-item id="fourth"> -->
            <!--<el-tab-pane label="已使用" name="four">-->
            <div class="get_box">
              <div class="list" v-for="(list, i) in dataList" :key="i">
                <div class="state_a">
                  <ul class="state">
                    <li class="left">
                      <div class="img">
                        <img :src="list.avatar"/>
                      </div>
                      <span>{{ list.nickname }}</span>
                    </li>
                    <li class="right">{{ list.status_name }}</li>
                  </ul>
                </div>
                <ul class="state_b">
                  <li>
                    <span></span>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                    <span>-{{ list.used }}</span>
                  </li>
                </ul>
                <div class="time">
                  <span>{{ list.created_at }}</span>
                  <span v-show="list.validity_at">有效期至：{{ list.validity_at }}</span>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <div v-if="activeName=='five'">
            <!-- <mt-tab-container-item id="five"> -->
            <div class="get_box">
              <div class="list" v-for="(list, i) in dataList" :key="i">
                <div class="state_a">
                  <ul class="state">
                    <li class="left">
                      <div class="img">
                        <img :src="list.avatar"/>
                      </div>
                      <span>{{ list.nickname }}</span>
                    </li>
                    <li class="right">{{ list.status_name }}</li>
                  </ul>
                </div>
                <ul class="state_b">
                  <li>
                    <span></span>
                    <span></span>
                  </li>
                  <li>
                    <span></span>
                    <span>-{{ list.used }}</span>
                  </li>
                </ul>
                <div class="time">
                  <span>{{ list.created_at }}</span>
                  <span v-show="list.validity_at">有效期至：{{ list.validity_at }}</span>
                </div>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>
          <!-- </mt-tab-container> -->
        </div>
        <yz-blank :datas="dataList" text="暂无记录" :isBtn="false"></yz-blank>
      </div>
    </div>
  </div>
</template>
<script>
import integral_record_controller from "./integral_record_controller";

export default integral_record_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #get_record {
    #content {
      .get_state {
        margin: 0.625rem 0;
        background-color: #fff;
        display: flex;
        padding: 1rem 0;

        li {
          width: 33.33%;
          border-right: solid 0.0625rem #ebebeb;
          font-size: 20px;

          span {
            display: block;
            line-height: 1.5rem;
          }

          span:first-child {
            color: #8c8c8c;
            font-size: 14px;
          }
        }

        li:last-child {
          border: none;
        }
      }

      .list_box {
        .get_box {
          .list {
            background: #fff;
            margin-bottom: 0.625rem;

            .state_a {
              padding: 0.625rem 0;

              .get {
                display: block;
                text-align: right;
                color: #f15353;
                font-size: 16px;
                padding-right: 0.875rem;
              }

              .state {
                padding: 0 0.875rem;
                display: flex;
                justify-content: space-between;
                font-size: 14px;

                .left {
                  display: flex;
                  line-height: 2.25rem;

                  .img {
                    width: 2.25rem;
                    height: 2.25rem;
                    border-radius: 1.125rem;
                    margin-right: 0.625rem;
                    overflow: hidden;

                    img {
                      width: 100%;
                    }
                  }
                }

                .right {
                  line-height: 2.25rem;
                }
              }
            }

            .state_b {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              padding: 0 0.875rem;
              margin-bottom: 0.625rem;

              li {
                span:last-child {
                  color: #f15353;
                  font-size: 16px;
                }
              }
            }

            .time {
              border-top: solid 0.0625rem #ebebeb;
              height: 2.25rem;
              line-height: 2.25rem;
              padding: 0 0.875rem;
              font-size: 12px;
              color: #8c8c8c;
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
</style>
