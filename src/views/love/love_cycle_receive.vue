<template>
  <div id="shareholderCenter">
    <c-title :hide="false" :text="love_name+'周期释放'"></c-title>
    <div class="header-receive">
      <div class="header-receive-text">可领取{{love_name}}</div>
      <div class="header-receive-price">{{details.gettable}}</div>
      <div class="header-receive-btn" @click="receiveAwardGain" :class="[details.receivable==0 ? 'disabled' : '']" >点击领取</div>
    </div>

    <div class="share_info">
      <div class="left">
        <span>{{details.reward_total}}</span
        ><br />
        赠送总额
      </div>
      <div>
        <span>{{details.rewarded}}</span
        ><br />
        已赠送
      </div>
    </div>

    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs  v-model="tabsIndex" @change="changeTabsIndex">
          <van-tab>
            <span slot="title">全部</span>
          </van-tab>
          <van-tab>
            <span slot="title">赠送中</span>
          </van-tab>
          <van-tab>
            <span slot="title">已完成</span>
          </van-tab>
        </van-tabs>

        <div>
          <ul class="rationList">
            <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
      
              <li v-for="(item, i) in listData" :key="i" class="list">
                <h4>
                  队列ID:{{ item.id }}
                  <span>{{ item.status==1 ? '赠送中' : '赠送完成' }}</span>
                </h4>
                <ul>
                  <li>
                    总赠送<br />
                    <span>{{ item.total }}</span>
                  </li>
                  <li>
                    未赠送<br />
                    <span>{{ item.not_rewarded }}</span>
                  </li>
                  <li>
                    已赠送<br />
                    <span>{{ item.rewarded }}</span>
                  </li>
                </ul>

                <div class="Record" @click="gotoLoveCashbackRecord(item.id)">
                  <span class="left look">查看记录</span>
                  <i class="fa fa-angle-right"></i>
                </div>
              </li>
            </d-list>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import love_cycle_receive_controller from "./love_cycle_receive_controller";

export default love_cycle_receive_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.header-receive {
  padding: 1rem 0;
  margin: 0.435rem 0;
  background: #fff;

  .header-receive-text {
    font-size: 14px;
    color: #101010;
  }

  .header-receive-price {
    margin-top: 0.375rem;
    font-size: 21px;
    color: #ee8e07;
  }

  .header-receive-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 9.25rem;
    height: 1.937rem;
    margin: 0.937rem auto 0;
    font-size: 12px;
    color: #f8f8f8;
    border-radius: 1.25rem;
    background: #ee6363;

    &.disabled {
      color: #f8f8f8;
      background: #c6c6c6;
    }
  }
}

#shareholderCenter {
  .share_info {
    width: 100%;
    height: 4.625rem;
    background-color: #fff;
    margin-bottom: 0.625rem;

    .left {
      border-right: solid 0.0625rem #e2e2e2;
    }

    div {
      color: #8c8c8c;
      font-size: 12px;
      margin: 1rem 0;
      line-height: 1.25rem;
      float: left;
      width: 50%;
      box-sizing: border-box;

      span {
        color: #e84f40;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .shareholder-order {
    #tabs {
      .rationList {
        .list {
          margin: 0.375rem 0;
          background-color: #fff;

          .Record {
            display: flex;
            justify-content: space-between;
            width: 100%;
            line-height: 2.75rem;
            padding: 0 0.75rem;

            i {
              font-size: 20px;
              color: #929292;
              line-height: 2.75rem;
            }
          }

          h4 {
            display: flex;
            align-items: center;
            height: 40px;
            width: 100%;
            box-sizing: border-box;
            padding: 0 0.75rem;
            text-align: left;
            color: #333;
            font-size: 14px;
            border-bottom: 0.0625rem solid #ececec;

            span {
              flex: 1;
              text-align: right;
              font-size: 14px;
              font-weight: normal;
              color: #f15353;
              border-radius: 0.3125rem;
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
              width: 33.3%;
              float: left;
              font-size: 12px;
              color: #8c8c8c;
              line-height: 1.375rem;

              span {
                color: #f15353;
                font-size: 14px;
              }
            }
          }

          p {
            color: #aab2b9;
            text-align: left;
            box-sizing: border-box;
            padding: 0 1.25rem 0.9375rem;

            span {
              color: #728ae3;
              float: right;
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
          margin-top: 0.0625rem;

          span {
            font-size: 14px;
            float: right;
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
