<template>
  <div id="info_change"
       ref="info_change">
    <c-title :hide="false"
             text="用户信息变更记录"></c-title>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul class="new-box">
          <li class="list"
              v-for="(item,index) in datas"
              :key="index">
            <div class="left">
              <p class="bottom">请求号</p>
              <p class="bottom">请求时间</p>
              <p class="bottom">变更状态</p>
              <p class="bottom">变更类型</p>

            </div>
            <div class="right">
              <p class="bottom">{{item.reqSn}}</p>
              <p class="bottom">{{item.created_at}}</p>
              <p class="bottom">{{item.status_name}}</p>
              <p class="bottom">{{item.operation_type}}</p>
            </div>
          </li>
        </ul>
      </van-pull-refresh>
      <div class="blank"
           v-if="datas.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import info_change_controller from "./info_change_controller";
export default info_change_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#info_change {
  background-color: #fff;

  .content {
    height: 100%;

    .tab_box {
      background: #fff;
      position: relative;

      .tab_list {
        height: 44px;
        line-height: 44px;
        border-bottom: solid 1px #ebebeb;
        // overflow-x: scroll;
        overflow-x: hidden;
        overflow-y: hidden;
        transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-duration: 300ms;
        font-size: 18px;
      }
    }

    .new-box {
      background-color: #fff;
      padding: 0 1rem;
      padding-top: 1rem;

      .list {
        margin-top: 1rem;
        border-bottom: solid 1px #ccc;
        display: flex;
        justify-content: space-between;
        padding-bottom: 1rem;
        flex-wrap: wrap;

        .left {
          .bottom {
            font-size: 12px;
            color: #f76d6d;
            margin-top: 0.5rem;
            text-align: left;
          }
        }

        .right {
          .bottom {
            font-size: 12px;
            color: #999;
            margin-top: 0.5rem;
            text-align: right;
          }
        }

        .remark {
          width: 100%;
          text-align: left;
          margin-top: 0.5rem;
          font-size: 12px;
        }
      }

      .list:first-child {
        margin-top: 0;
      }
    }

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
  }
}
</style>
