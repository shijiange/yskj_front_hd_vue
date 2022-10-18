<template>
  <div id="task_list">
    <c-title :hide="false" text="任务中心"></c-title>
    <div id="content">
      <div class="header">
        <div class="use-header">
          <div class="img">
            <img :src="taskList.avatar" />
          </div>
          <ul>
            <li class="name">{{ taskList.nickname }}</li>
            <li>{{ taskList.level_name }}</li>
          </ul>
        </div>
        <div class="member_time">
          <i
            class="iconfont icon-naozhong"
			style="font-size: 1.125rem; color: #f5ca7f;"
          ></i>
          <div><span>有效期：</span>{{ taskList.validity }}天</div>
        </div>
      </div>

      <div>
        <!-- <div class="member-box" v-for="(item,index) in member_equity" :key="index">
          <div class="top">
            <h1>{{item.level_name}}</h1>
          </div>
          <div class="title-box">
            <div class="left"></div>
            <span>会员权益</span>
            <div class="right"></div>
          </div>
          <ul>
            <li v-for="task in item.task">
              <div>
                <div class="circur"></div>
                直推会员数：{{task.task_member_num || 0}}人
              </div>
              <span v-if="task.award_money">奖励金额：{{task.award_money || 0}}</span>
              <span v-if="task.award_days">等级有效期增加{{task.award_days || 0}}天</span>
            </li>
          </ul>
          <div class="bottom">
            <span>任务进度{{item.task_ret || 0/0}}人</span>
          </div>
        </div> -->
        <!-- 页面优化 -->
        <div class="task_box">
          <div class="title_box">
            <div class="block_left"></div>
            <h2>推荐任务</h2>
            <div class="block_right"></div>
          </div>
          <div class="list_box">
            <ul
              class="list"
              v-for="(item, index) in member_equity"
              :key="index"
            >
              <li class="text_a">
                <i class="iconfont icon-taskconter"></i>
              </li>
              <li class="text_b">
                <span>{{ item.level_name }}：{{ item.member_num }}人 </span
                ><br />
                <span
                  >{{ item.code_name }}：+{{ item.amount }}{{ item.unit }}
                </span>
              </li>
              <li class="text_c">
                <span class="state" v-if="item.status == 1">已完成</span>
                <span class="state" v-else
                  >{{ item.ret }}/{{ item.member_num }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import task_list_controller from "./task_list_controller.js";

export default task_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#task_list {
  background: #fff;

  #content {
    .header {
      width: 100%;

      .use-header {
        background-color: #3b3b4f;
        padding: 1.25rem;
        position: relative;
        display: flex;

        .img {
          width: 3.75rem;
          height: 3.75rem;
          border: solid 0.125rem #fff;
          border-radius: 50%;
          margin-right: 1rem;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        ul {
          text-align: left;

          li {
            line-height: 1.75rem;
            color: #fff;
            font-size: 15px;
          }

          .name {
            font-weight: bold;
          }
        }

        .button {
          width: 21%;
          height: 1.625rem;
          background-color: #fff;
          border-radius: 0.8125rem;
          display: flex;
          justify-content: space-between;
          padding: 0 0.5rem;
          position: absolute;
          margin-top: 1.0625rem;
          right: 0.625rem;

          input {
            border: none;
            color: #f5ca7f;
          }

          i {
            color: #f5ca7f;
            font-size: 1.25rem;
            line-height: 1.625rem;
          }
        }
      }
    }

    .member_time {
      background-color: rgba(59, 59, 79, 0.8);
      text-align: left;
      height: 2.25rem;
      padding: 0 1.25rem;

      div {
        display: inline-block;
        font-size: 14px;
        line-height: 2.25rem;
        color: #f5ca7f;

        span {
          font-weight: bold;
        }
      }

      i {
        margin-right: 0.625rem;
      }
    }

    .member-box {
      margin: 0 0.875rem 1rem 0.875rem;
      background-color: #fff;
      border-radius: 0.375rem;
      box-shadow: 0 0.125rem 0.5rem 0.025rem rgba(0, 0, 0, 0.2);
    }

    .top {
      margin-bottom: 0.625rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #f5d59c;
      border-radius: 0.375rem 0.375rem 0 0;
      color: #333;
      font-size: 16px;
      display: flex;
      padding: 0 0.625rem;
      justify-content: space-between;

      .right {
        display: flex;

        i {
          font-size: 1.25rem;
          color: #6bc57a;
          margin-right: 0.25rem;
        }

        .icon-service_j {
          color: #ff9800;
        }

        .icon-submit {
          color: #6bc57a;
        }
      }
    }

    .title-box {
      display: flex;
      justify-content: space-between;

      .left {
        margin-left: 0.875rem;
        width: 32%;
        height: 0.0625rem;
        background-color: #ccc;
        margin-top: 0.9375rem;
      }

      span {
        font-size: 16px;
        line-height: 1.875rem;
      }

      .right {
        width: 32%;
        height: 0.0625rem;
        background-color: #ccc;
        margin-top: 0.9375rem;
        margin-right: 0.875rem;
      }
    }

    .bottom {
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #f5d59c;
      border-radius: 0 0 0.375rem 0.375rem;
      color: #333;
      display: flex;
      justify-content: flex-end;
      padding: 0 10px;

      span {
        font-size: 15px;
      }

      span:last-child {
        color: #8c8c8c;
      }
    }

    .member-box {
      ul {
        padding: 0 1rem;
        margin-bottom: 0.625rem;

        li {
          line-height: 1.875rem;
          text-align: left;
          display: flex;
          justify-content: space-between;
          font-size: 14px;

          div {
            display: flex;
          }

          .circur {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            background-color: #bbb;
            margin-top: 0.6875rem;
            margin-right: 0.625rem;
          }
        }
      }
    }

    .task_box {
      .title_box {
        height: 2.875rem;
        line-height: 2.875rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fafafa;

        .block_left,
        .block_right {
          width: 0.375rem;
          height: 0.375rem;
          background: #f5ca7f;
          transform: rotate(45deg);
        }

        h2 {
          margin: 0 1rem;
          font-size: 16px;
          color: #666;
        }
      }

      .list_box {
        .list {
          position: relative;
          display: flex;
          padding: 0.625rem 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;

          .text_a {
            margin-right: 0.625rem;

            i {
              font-size: 1.75rem;
              color: #f5ca7f;
              line-height: 3.5rem;
            }
          }

          .text_b {
            height: 3.75rem;
            line-height: 1.875rem;
            font-size: 16px;
            text-align: left;

            span:last-child {
              font-size: 14px;
              color: #f5ca7f;
            }
          }

          .text_c {
            position: absolute;
            line-height: 3.75rem;
            right: 0.875rem;
            font-size: 16px;
            text-align: right;
            color: #f5ca7f;
          }
        }
      }
    }
  }
}
</style>
