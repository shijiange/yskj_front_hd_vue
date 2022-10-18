<template>
  <div id="circleMyCircle">
    <c-title :hide="false" text="我的圈子"></c-title>
    <div class="tabs" @click="switchTab">
      <div
        class="tabItem"
        :class="{ active:currentShowTabType=='created' }"
        data-type="created"
      >我创建的圈子</div>
      <div
        class="tabItem"
        :class="{ active:currentShowTabType=='joined' }"
        data-type="joined"
      >我加入的圈子</div>
    </div>
    <div v-if="currentShowTabType=='created'">
      <div class="tabStatus" @click="switchCreatedType">
        <div
          class="tabStatusItem"
          :class="{ active:currentShowCreatedType=='0' }"
          data-status="0"
        >审核中</div>
        <div
          class="tabStatusItem"
          :class="{ active:currentShowCreatedType=='1' }"
          data-status="1"
        >已发布</div>
        <div
          class="tabStatusItem"
          :class="{ active:currentShowCreatedType=='2' }"
          data-status="2"
        >已驳回</div>
      </div>

      <d-list
        @load="loadMyCreated"
        :finished="createdPagination.finished"
        :loading="createdPagination.loading"
      >
        <div class="tablis">
          <div class="circle-item-wrapper" v-for="circleItem in myCreated" :key="circleItem.id">
            <div @click="goToMyCreatedCircle(circleItem.id,circleItem.is_review)">
              <circle-item :data="circleItem">
                <span
                  class="circle-review-status"
                  :status="circleItem.is_review"
                >{{ circleItem.is_review==0?'审核中':circleItem.is_review==1?'已通过':'已驳回' }}</span>
              </circle-item>
            </div>
          </div>
        </div>
      </d-list>
    </div>
    <div v-if="currentShowTabType=='joined'">
      <d-list
        @load="loadMyJoined"
        :finished="joinedPagination.finished"
        :loading="joinedPagination.loading"
      >
        <div class="tablis">
          <div
            class="circle-item-wrapper"
            v-for="(circleItem,itemIndex) in myJoined"
            :key="circleItem.id"
            @click="goToCircle(circleItem.id)"
          >
            <circle-item :data="circleItem">
              <circle-button @click="quitCircle(itemIndex)">退出圈子</circle-button>
            </circle-item>
          </div>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import circleMyCircle_controller from "./circleMyCircle_controller";

export default circleMyCircle_controller;
</script>

<style scoped>
.circle-item-wrapper {
  padding: 0 0.94rem 0 0.84rem;
  border-top: 1px solid #f2f2f2;
  background: #fff;
}

.circle-review-status {
  font-weight: bold;
  color: #585858;
}

.circle-review-status[status="0"] {
  color: #eb3939;
}

.circle-review-status[status="2"] {
  color: #ffa200;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#circleMyCircle {
  .tabs {
    background: #fff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 2.375rem;
    line-height: 2.375rem;

    .tabItem {
      flex-grow: 1;
      font-size: 0.813rem;
      font-weight: bold;
      color: #666;
      text-align: center;
    }

    .tabItem.active {
      color: #3175fe;
      position: relative;
    }

    .tabItem.active::after {
      content: "";
      display: block;
      width: 1.25rem;
      height: 0.188rem;
      background-color: #3175fe;
      border-radius: 1.194rem;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .tabStatus {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 2.375rem;
    line-height: 2.375rem;

    .tabStatusItem {
      height: 2.375rem;
      font-size: 0.813rem;
      font-weight: bold;
      color: #666;
      text-align: center;
    }

    .tabStatusItem.active {
      color: #fac337;
      position: relative;
    }

    .tabStatusItem.active::after {
      content: "";
      display: block;
      width: 1.25rem;
      height: 0.188rem;
      background-color: #fac337;
      border-radius: 1.194rem;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .tablis {
    background: #fff;

    .lis {
      width: 100%;
      height: 4.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 0.05rem solid #f2f2f2;
      padding: 0.73rem 0.31rem 0.8rem 0.9rem;

      .right {
        font-size: 0.688rem;
        color: #fff;
        width: 3.75rem;
        height: 1.563rem;
        background-color: #3175fe;
        border-radius: 0.781rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .right_one {
        font-size: 0.813rem;
        font-weight: bold;
        color: #585858;
      }

      .right_one.status1 {
        color: #eb3939;
      }

      .right_one.status2 {
        color: #585858;
      }

      .right_one.status3 {
        color: #ffa200;
      }

      .left {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;

        .circleImg {
          width: 2.188rem;
          height: 2.188rem;
          background-color: #cfcfcf;
          border-radius: 100%;
          margin-right: 0.63rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }
      }

      .circle {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        overflow: hidden;

        .detail {
          display: flex;
          font-size: 0.69rem;

          i {
            font-size: 0.8rem;
            color: #ffa200;
            height: 1rem;
            display: inline-flex;
          }

          .text {
            margin-left: 0.41rem;
          }

          .tiezi {
            display: flex;
          }

          .member {
            display: flex;
            margin-left: 1.34rem;
          }
        }

        .title {
          width: 100%;
          font-size: 0.938rem;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          color: #202020;
        }
      }
    }
  }
}
</style>
