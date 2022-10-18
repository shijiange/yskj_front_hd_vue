<template>
  <div id="rewards_record">
    <c-title :hide="false" :text="name"></c-title>
    <div class="header_box" v-if="member">
      <div class="header_box1">
        <div class="header">
          <img :src="member.avatar_image" />
        </div>
        <div class="name">{{ member.nickname }}</div>
      </div>
    </div>
    <div class="level">
      <div class="level_name">
        <div class="level_name_white">
          <div class="level_name_red" v-if="member.level_name">
            {{member.level_name}}
          </div>
        </div>
      </div>
      <div class="level_money">
        <div class="money_title">
          累计奖励金额（{{$i18n.t('元')}}）
        </div>
        <div class="money_num">
          {{total_amount}}
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list_title_left"></div>
      <div class="list_title">
        奖励记录
      </div>
      <div class="list_box" v-if="recordsList.length>0">
        <div class="box" v-for="(item,i) in recordsList" :key='i'>
          <div @click.stop="showDetail(item)">
            <div class="box1">
              <div class="box1_all">
                <div class="box1_id">
                  奖励ID：{{item.id}}
                </div>
                <div class="box1_time">
                  {{item.created_at}}
                </div>
              </div>
              <div class="box1_money">
                {{item.manage_amount}}{{$i18n.t('元')}}
              </div>
            </div>
          </div>
          <div class="detail" v-if="item.show">
            <div class="detail_left">
              <div>结算金额</div>
              <div class="detail_num">{{$i18n.t('money')}}{{item.amount}}</div>
            </div>
            <div class="detail_right">
              <div>分红比例</div>
              <div class="detail_num">{{item.rate}}%</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="line-height: 2.5rem; color: #8d8d8d;">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import rewards_record_controller from "./rewards_record_controller";

export default rewards_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#rewards_record {
  .header_box {
    // background: #f15353;
    background:
      -webkit-linear-gradient(
        left,
        #ff7459,
        #ff8a73
      ); /* Safari 5.1 to 6.0 */

    background:
      -o-linear-gradient(
        right,
        #ff7459,
        #ff8a73
      ); /* Opera 11.1 to 12.0 */

    background:
      -moz-linear-gradient(
        right,
        #ff7459,
        #ff8a73
      ); /* Firefox 3.6 to 15 */

    background: linear-gradient(to right, #ff7459, #ff8a73); /* 标准语法 */
    color: #fff;
    padding: 1.25rem 0.875rem 2.5rem 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center; /* 水平居中 */
    .header_box1 {
      display: flex;
      align-items: center;
      justify-content: center; /* 水平居中 */
      width: 100%;
      flex-direction: column;

      .header {
        width: 3.75rem;
        height: 3.75rem;
        border: solid 0.125rem #fff;
        margin-right: 0.625rem;
        overflow: hidden;
        border-radius: 3.75rem;
        background: #f2f2f2;

        img {
          width: 100%;
        }
      }

      .name {
        font-weight: 700;
        font-size: 16px;
        line-height: 2.5rem;
      }
    }
  }

  .level {
    border-radius: 0.25rem;
    background: #fff;
    margin: 0 0.5rem;
    padding: 1rem;
    position: relative;
    top: -1.25rem;
    right: 0;

    .level_name {
      color: white;
      display: flex;
      align-items: center;
      justify-content: center; /* 水平居中 */
      position: relative;
      top: -2rem;
      right: 0;
      text-align: center;

      .level_name_white {
        padding: 0.1rem;
        border-radius: 1rem;
        background: #fff;

        .level_name_red {
          padding: 0 1rem;
          border-radius: 1rem;
          line-height: 1.75rem;
          height: 1.75rem;
          background:
            -webkit-linear-gradient(
              left,
              #ff7459,
              #ff8a73
            ); /* Safari 5.1 to 6.0 */

          background:
            -o-linear-gradient(
              right,
              #ff7459,
              #ff8a73
            ); /* Opera 11.1 to 12.0 */

          background:
            -moz-linear-gradient(
              right,
              #ff7459,
              #ff8a73
            ); /* Firefox 3.6 to 15 */

          background:
            linear-gradient(
              to right,
              #ff7459,
              #ff8a73
            ); /* 标准语法 */

          width: 100%;
        }
      }
    }

    .level_money {
      display: flex;
      align-items: center;
      justify-content: center; /* 水平居中 */
    }

    .money_title {
      width: 50%;
      text-align: left;
      color: #8c8c8c;
    }

    .money_num {
      width: 50%;
      text-align: right;
      font-weight: 700;
      font-size: 1.25rem;
    }
  }

  .list {
    border-radius: 0.25rem;
    background: #fff;
    margin: 0 0.5rem;
    padding-bottom: 1rem;
    position: relative;

    .list_title_left {
      position: absolute;
      left: 0;
      top: 0.25rem;
      line-height: 1.5rem;
      height: 1.5rem;
      width: 0.2rem;
      background: #ff5f00;
      text-align: left;
    }

    .list_title {
      line-height: 2rem;
      height: 2rem;
      font-size: 1rem;
      text-align: left;
      border-bottom: 0.0625rem solid #ddd;
      font-weight: 700;
      padding-left: 1rem;
    }

    .list_box {
      padding: 0 0.875rem;

      .box {
        background: #fff;
        padding: 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;
        margin: 0.125rem 0;

        .box1 {
          font-size: 15px;
          align-items: center;
          display: flex;

          .box1_all {
            width: 70%;
            text-align: left;
          }

          .box1_id {
            line-height: 1.8rem;
          }

          .box1_time {
            font-size: 12px;
            color: #8c8c8c;
          }

          .box1_money {
            font-size: 1.25rem;
            font-weight: 500;
            width: 30%;
            text-align: right;
            color: #ff5f00;
          }
        }

        .detail {
          margin: 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center; /* 水平居中 */
          font-size: 0.75rem;
          color: #8c8c8c;

          .detail_left {
            width: 50%;
            border-right: 1px solid #ff5f00;
          }

          .detail_right {
            width: 50%;
          }

          .detail_num {
            font-weight: 600;
            line-height: 1.25rem;
          }
        }

        li {
          line-height: 1.875rem;
          display: flex;
          justify-content: space-between;
          font-size: 15px;

          .sum {
            color: #f15353;
          }

          .time {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }

      .show_hide_box {
        padding: 0 0.875rem;
        background: #fff;
        margin-bottom: 0.625rem;

        .detail {
          text-align: left;
          font-size: 13px;
          line-height: 1.25rem;
          color: #8a8a8a;
        }
      }
    }
  }
}
</style>
