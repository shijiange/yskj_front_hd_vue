<template>
  <div id="lovePeriod">
    <c-title :hide="false" :text="love_name+'团队奖励记录'">
    </c-title>

    <div class="share_holder">
      <div class="left" v-if="dataInfo.member">
        <div class="img-box">
          <img :src="dataInfo.member.avatar" alt="">
        </div>
        <span>{{dataInfo.member.nickname}}</span>
      </div>
      <div class="right">
        <span>{{$i18n.t('money')}}{{dataInfo.amount_total}}</span> <br />
        <span>奖励总额({{$i18n.t('元')}})</span>
      </div>
    </div>
    <div class="share_holder" style="margin-top: -0.5rem;">
      <div class="left">
        团队等级: {{dataInfo.level_name}}
      </div>
      <div class="right">
        团队{{love_name}}数量: {{dataInfo.team_love}}
      </div>
    </div>

    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first" style="color: #3c3c3c; height: 40px;" title="奖励记录"></van-tab>
        </van-tabs>
        <div>
        <!-- <mt-tab-container v-model="activeName"> -->
          <div v-show="activeName=='first'">
          <!-- <mt-tab-container-item id="first"> -->
            <ul class='rationList'>
              <div class="blank"  v-if="recordsList.length<=0">
                <img src="../../../assets/images/blank.png">
                <span>还没有记录哦</span>
              </div>
              <li class="list" v-for="(item,index) in recordsList" :key="index">
                <h4>
                  分红ID: {{item.id}}
                  <span>+ {{item.amount}}</span>
                </h4>

                <div class="one">
                  <div class="time">
                    <span class="left">团队{{love_name}}总额: {{item.team_love_total}}</span>
                    <span class="right">奖励比例: {{item.ratio}}%</span>
                  </div>
                  <div class="time">
                    <span class="left">下级团队奖励金额: {{item.children_amount}}</span>
                    <span class="right last"> {{item.created_at}}</span>
                  </div>
                </div>

              </li>
            </ul>
          <!-- </mt-tab-container-item> -->
          </div>
        <!-- </mt-tab-container> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import love_period_controller from "./love_performance_controller";

export default love_period_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #lovePeriod {
    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }

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
      box-sizing: border-box;
      background-color: #f15353;
      display: flex;

      .left {
        flex: 1;
        display: flex;
        color: #fff;
        box-sizing: border-box;
        padding: 1rem 0.75rem;
        text-align: left;

        .img-box {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          margin-right: 1rem;
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        span {
          align-self: center;
          font-weight: bold;
        }
      }

      .right {
        flex: 1;
        text-align: right;
        color: #fff;
        box-sizing: border-box;
        padding: 1rem 0.75rem;

        span:first-child {
          font-size: 20px;
          line-height: 1.5rem;
          display: inline-block;
        }

        span {
          font-size: 14px;
          line-height: 1.5rem;
          display: inline-block;
        }
      }
    }

    .shareholder-order {
      #tabs {
        .rationList {
          .list {
            margin: 0.375rem 0;
            background-color: #fff;

            h4 {
              line-height: 30px;
              width: 100%;
              box-sizing: border-box;
              padding: 0.625rem 1.25rem;
              text-align: left;
              color: #333;
              font-size: 16px;
              border-bottom: 0.0625rem solid #ececec;

              span {
                display: inline-block;
                font-size: 16px;
                padding: 0.0625rem 0.25rem;
                font-weight: normal;
                color: #f15353;
                float: right;
              }
            }

            ul::after {
              content: "";
              display: block;
              clear: both;
            }

            ul {
              width: 100%;
              padding: 0.625rem 0;

              li {
                width: 33%;
                float: left;
                font-size: 12px;
                color: #8c9295;
                line-height: 1.375rem;

                span {
                  color: #333;
                  font-size: 14px;
                }
              }
            }
          }

          .recordList {
            padding: 0.9375rem;
            font-size: 14px;
            line-height: 1.125rem;
            color: #333;
            text-align: left;
            background-color: #fff;
            margin: 0.125rem;

            span {
              font-size: 14px;
              float: right;
            }
          }

          .one {
            padding: 0 0.75rem 0.5rem 0.75rem;

            .time {
              width: 100%;
              line-height: 1.625rem;
              margin-top: 0.625rem;
              display: flex;
              justify-content: space-between;
            }

            .left {
              color: #282828;
              font-size: 14px;
            }

            .right {
              color: #282828;
              font-size: 14px;
            }

            .last {
              color: #8c8c8c;
            }
          }
        }

        .rationList::after {
          content: "";
          display: block;
          clear: both;
        }
      }
    }
  }
</style>
