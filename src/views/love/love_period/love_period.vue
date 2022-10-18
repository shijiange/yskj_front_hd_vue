<template>
  <div id="lovePeriod">
    <c-title :hide="false" :text="love_name + '周期奖励记录'"> </c-title>

    <div class="share_holder">
      <div class="left" v-if="dataInfo.member">
        <div class="img-box">
          <img :src="dataInfo.member.avatar" alt="" />
        </div>
        <span>{{ dataInfo.member.nickname }}</span>
      </div>
      <div class="right">
        <span>{{ $i18n.t("money") }}{{ dataInfo.amount_total }}</span> <br />
        <span>奖励总额({{ $i18n.t("元") }})</span>
      </div>
    </div>

    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName" @change="changeHandle">
          <van-tab name="first" title="奖励记录" style="color: #3c3c3c; height: 40px;"></van-tab>
          <van-tab name="second" title="待打款记录" style="color: #3c3c3c; height: 40px;"></van-tab>
        </van-tabs>
        <div>
          <div v-show="activeName == 'first'">
            <ul class="rationList">
              <div class="blank" v-if="recordsList.length <= 0">
                <img src="../../../assets/images/blank.png" />
                <span>还没有记录哦</span>
              </div>
              <li class="list" v-for="(item, index) in recordsList" :key="index">
                <h4>
                  分红ID: {{ item.id }}
                  <span>+ {{ item.amount }}</span>
                </h4>

                <div class="one">
                  <div class="time" v-if="control">
                    <span class="left">商城周期营业额: {{ item.turnover }}</span>
                    <span class="right"></span>
                    <span class="right">分红比例: {{ item.ratio }}%</span>
                  </div>
                  <div class="time">
                    {{ control ? "商城周期" + love_name + "总数:" + item.love_total : "" }}
                    <span class="left"></span>
                    <span class="right">{{ love_name }}单价: {{ item.love_unit }}</span>
                  </div>
                  <div class="time">
                    <span class="left">个人{{ love_name }}总数: {{ item.member_love }}</span>
                    <span class="right last"> {{ item.created_at }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-show="activeName == 'second'">
            <div class="blank" v-if="play_with.length <= 0">
              <img src="../../../assets/images/blank.png" />
              <span>还没有记录哦</span>
            </div>
            <div class="main">
              <van-cell-group>
                <van-cell class="content" v-for="item in play_with" :key="item.id">
                  <!-- 使用 title 插槽来自定义标题 -->
                  <template #title>
                    <div class="record-left">
                      <span>ID：{{ item.id }}</span>
                      <span class="time">{{ item.created_at }}</span>
                    </div>
                  </template>
                  <template #default>
                    <div class="record-right">
                      <div>
                        <span class="c-333">变动金额：</span><span class="main-c">{{ item.amount }}</span>
                      </div>
                      <div>
                        <span class="c-333">累计待打款：</span><span class="main-c">{{ item.amount_total }}</span>
                      </div>
                    </div>
                  </template>
                </van-cell>
              </van-cell-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import love_period_controller from "./love_period_controller";

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
  .main {
    border-top: 0.14rem solid #ebebeb;
    padding-bottom: 2rem;
  }
  // 记录
  .content {
    border-bottom: 0.14rem solid #ebebeb;
  }
  .record-left {
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .record-right {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
  .time {
    color: #8c8c8c;
  }
  // 主色调
  .main-c {
    color: #f15353;
  }
  .c-333 {
    color: #333;
  }
  .load-more-text {
    margin-top: 1rem;
  }
}
</style>
