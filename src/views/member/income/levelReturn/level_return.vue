<template>
  <div id="levelReturn">
    <c-title :hide="false" text="分销商全返"></c-title>
    <div class="share_holder">
      <p>
        <span>{{ level }}</span>
        <span v-if="is_days == '1'">返还天数:{{ return_time }}</span>
      </p>
      <ul class="today_bonus">
        <li v-for="(item,i) in ratioDatas" :key='i' :class="item.name">
          <span>{{ item.money }}</span>
          <br/>
          <b>{{ item.data }}</b>
        </li>
      </ul>
    </div>

    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功" v-if="all_goload">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">全部</span>
          </van-tab>
          <van-tab name="second">
            <span slot="title" @click="handleClick('1')">未返还</span>
          </van-tab>
          <van-tab name="third">
            <span slot="title" @click="handleClick('2')">已返还</span>
          </van-tab>
          <van-tab name="fourth">
            <span slot="title" @click="handleClick('3')">无效</span>
          </van-tab>
        </van-tabs>
        <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <!--<el-tab-pane label="全部" name="first">-->

            <ul class="rationList">
              <li v-for="(elem,i) in first_content" :key='i'>
                <div class="detail">
                  <span class="month">{{ elem.created_at }}</span>
                  <div class="info">
                    <div class="left">
                      <span>返还ID:{{ elem.id }}</span>
                      <p v-if="is_days == '1'">
                        返还时间:{{ elem.return_time }}天
                      </p>
                    </div>
                    <div class="right">
                      <b>{{ elem.amount }}元</b>
                      <br/>
                      <span>{{ elem.status_name }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="未返还" name="second">-->
          <div v-show="activeName=='second'">
            <!-- <mt-tab-container-item id="second"> -->
            <ul class="rationList">
              <li v-for="(elem,i) in second_content" :key='i'>
                <div class="detail">
                  <span class="month">{{ elem.created_at }}</span>
                  <div class="info">
                    <div class="left">
                      <span>返还ID:{{ elem.id }}</span>
                      <p v-if="is_days == '1'">
                        返还时间:{{ elem.return_time }}天
                      </p>
                    </div>
                    <div class="right">
                      <b>{{ elem.amount }}元</b>
                      <br/>
                      <span>{{ elem.status_name }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="已返还" name="third">-->
          <div v-show="activeName=='third'">
            <!-- <mt-tab-container-item id="third"> -->
            <ul class="rationList">
              <li v-for="(elem,i) in third_content" :key='i'>
                <div class="detail">
                  <span class="month">{{ elem.created_at }}</span>
                  <div class="info">
                    <div class="left">
                      <span>返还ID:{{ elem.id }}</span>
                      <p v-if="is_days == '1'">
                        返还时间:{{ elem.return_time }}天
                      </p>
                    </div>
                    <div class="right">
                      <b>{{ elem.amount }}元</b>
                      <br/>
                      <span>{{ elem.status_name }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->

          <!--<el-tab-pane label="无效" name="fourth">-->
          <div v-show="activeName=='fourth'">
            <!-- <mt-tab-container-item id="fourth"> -->
            <ul class="rationList">
              <li v-for="(elem,i) in fourth_content" :key='i'>
                <div class="detail">
                  <span class="month">{{ elem.created_at }}</span>
                  <div class="info">
                    <div class="left">
                      <span>返还ID:{{ elem.id }}</span>
                      <p v-if="is_days == '1'">
                        返还时间:{{ elem.return_time }}天
                      </p>
                    </div>
                    <div class="right">
                      <b>{{ elem.amount }}元</b>
                      <br/>
                      <span>{{ elem.status_name }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <!-- </mt-tab-container> -->
        </div>
        <!--</el-tabs>-->
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import level_return_controller from "./level_return_controller";

export default level_return_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  #levelReturn {
    .share_holder {
      font-size: 14px;

      p {
        margin-bottom: 0.625rem;
        padding: 1rem 0.75rem;
        line-height: 1.5rem;
        box-sizing: border-box;
        background: #f15353;
        color: #fff;
        display: flex;
        justify-content: space-between;

        span:first-child {
          line-height: 1.5rem;
        }

        span:nth-child(2) {
          line-height: 1.5rem;
        }
      }

      .today_bonus {
        width: 100%;
        height: 5.375rem;
        background: #fff;
        padding: 1rem 0;
        box-sizing: border-box;
        position: relative;
        border-bottom: 0.0625rem solid #ebebeb;

        li.line {
          position: absolute;
          width: 0.0625rem;
          height: 2.8125rem;
          background: #ddd;
          margin-top: 0.625rem;
          top: 0;
          right: 32%;

          .careat {
            position: absolute;
            width: 0.0625rem;
            height: 4.0625rem;
            background: #ddd;
            top: 0;
            right: 32%;
          }
        }

        li {
          text-align: center;
          float: left;

          span {
            margin-bottom: 0.625rem;
            display: inline-block;
            font-size: 17px;
            line-height: 1.625rem;
          }

          b {
            font-size: 11px;
            color: #333;
          }
        }

        li.data {
          width: 25%;

          span {
            color: #ffa800;
          }
        }

        li:first-child,
        li:nth-child(2) {
          border-right: 0.0625rem solid #ebebeb;
        }

        li:nth-child(3) {
          border-right: 0.0625rem solid #ebebeb;
        }

        li.mounth {
          width: 33%;

          span {
            color: #f15353;
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
        background-size: 1.25rem;
      }
    }

    .content {
      .ratioNav {
        padding: 0;
        margin: 0;
        height: 2.375rem;
        width: 100%;
        background: #fff;
        border-bottom: 0.0625rem solid #f15353;
        border-top: 0.0625rem solid #f15353;

        li {
          float: left;
          width: 25%;
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
          border-bottom: 0.0625rem solid #e2e2e2;

          span.month {
            display: block;
            height: 1.5625rem;
            line-height: 1.5625rem;
            text-align: left;
            padding: 0.3125rem 0.625rem;
            background: #fff;
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
                height: 1.25rem;
                line-height: 1.25rem;
                color: #333;
              }

              p {
                font-size: 12px;
                height: 1.25rem;
                line-height: 1.25rem;
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

              p {
                margin: 0;
                padding: 0;
                font-size: 12px;
                color: #888;
              }

              b {
                font-weight: normal;
                color: #f15353;
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
</style>
