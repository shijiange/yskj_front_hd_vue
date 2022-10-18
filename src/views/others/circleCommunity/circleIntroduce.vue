<template>
  <div id="circleIntroduce">
    <c-title :hide="false" text="圈子简介"></c-title>
    <div class="header">
      <div class="face">
        <img :src="circle_img" />
      </div>
      <div class="desc">
        <div class="name">{{ circle_name }}</div>
        <div class="label">{{ category_name }}</div>
      </div>
    </div>

    <div class="tabs" @click="swtichTab">
      <div
        class="tabItem"
        :class="currentShowTab=='introduce' ? 'active' : ''"
        data-name="introduce"
      >简介</div>
      <div
        style="margin-left: 1.59rem;"
        class="tabItem"
        :class="currentShowTab=='members' ? 'active' : ''"
        data-name="members"
      >成员({{ member_count }})</div>
    </div>

    <div class="introduce" v-show="currentShowTab=='introduce'">{{ synopsis }}</div>

    <d-list
      v-show="currentShowTab=='members'"
      v-if="circleInfo.is_open_member"
      :finished="membersPagination.finished"
      :loading="membersPagination.loading"
      @load="getMembers"
    >
      <div class="userList">
        <div class="userItem" v-for="(item, index) in members" :key="index">
          <div class="face">
            <img :src="item.header_img" />
          </div>
          <div class="desc">
            <div class="name">{{ item.name }}</div>
            <div class="label" v-if="item.circle_master == 1">群主</div>
          </div>
          <div class="btns">
            <div
              :class="{ btn: true, status1: item.is_attention == 1 }"
              @click="attentionMember(index)"
            >{{ item.is_attention?'已关注':'关注' }}</div>
          </div>
        </div>
      </div>
    </d-list>

    <div class="userList" v-show="!show" v-else>圈主未开放成员列表~</div>

    <div class="sumbit" @click="dispatchJoinQuit">{{ circleJoinOfQuitText }}</div>
  </div>
</template>

<script>
import circleIntroduce_controller from "./circleIntroduce_controller";

export default circleIntroduce_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleIntroduce {
  padding-bottom: 3.6rem;

  .header {
    width: 100%;
    height: 6.5625rem;
    display: flex;
    padding-top: 1.375rem;
    padding-left: 0.9688rem;
    background-image: linear-gradient(0deg, #709cf6 0%, #3175fe 100%);
    position: relative;

    .face {
      img {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
        background-color: #03a3a3;
      }
    }

    .desc {
      padding-left: 0.6875rem;
      color: #fff;
      text-align: left;

      .name {
        font-size: 0.9375rem;
      }

      .label {
        padding: 0 0.5rem;
        min-width: 2.8125rem;
        height: 1.3125rem;
        background-color: #8fb2f8;
        border-radius: 0.6563rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.625rem;
      }
    }
  }

  .tabs {
    margin-top: 0.625rem;
    background: #fff;
    display: flex;
    padding: 0.863rem 0.969rem 0.5rem;

    .tabItem {
      font-size: 0.813rem;
      font-weight: bold;
      color: #666;
      display: flex;
      // align-items: flex-end;
      // text-align: center;
    }

    .tabItem.active {
      font-size: 1rem;
      color: #3175fe;
      position: relative;
    }

    .tabItem.active::after {
      content: "";
      display: block;
      width: 1.25rem;
      height: 0.188rem;
      background-color: #3175fe;
      border-radius: 0.094rem;
      position: absolute;
      bottom: -0.4rem;
      left: 50%;
      transform: translateX(-50%);
      // text-align: center;
    }
  }

  .introduce {
    background: #fff;
    font-size: 0.8125rem;
    font-weight: bold;
    color: #575757;
    padding: 0.9375rem 0.9063rem 1rem 0.9063rem;
    text-align: left;
  }

  .userList {
    padding-top: 0.625rem;
    background: #fff;

    .userItem {
      height: 4.25rem;
      display: flex;
      align-items: center;
      padding: 0 0.9375rem;

      .face {
        img {
          width: 2.1875rem;
          height: 2.1875rem;
          border-radius: 50%;
          background-color: #cfcfcf;
        }
      }

      .desc {
        padding-left: 0.5938rem;
        display: flex;
        align-items: center;
        flex: 1;

        .name {
          font-size: 0.9375rem;
          font-weight: bold;
          color: #202020;
        }

        .label {
          margin-left: 0.375rem;
          width: 1.9688rem;
          height: 1rem;
          background-color: #fac337;
          border-radius: 0.125rem;
          display: flex;
          color: #fff;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          font-weight: bold;
        }
      }

      .btns {
        .btn {
          width: 3.75rem;
          height: 1.5625rem;
          font-size: 0.6875rem;
          font-weight: bold;
          border-radius: 0.7813rem;
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          background-color: #3175fe;
          color: #fff;

          &.status1 {
            color: #3175fe;
            background: none;
            border: 0.03rem solid #3175fe;
          }
        }
      }
    }
  }
  // 退出圈子按钮
  .sumbit {
    position: fixed;
    width: 19.13rem;
    height: 2.5rem;
    background-color: #3175fe;
    border-radius: 1.25rem;
    text-align: center;
    font-size: 0.938rem;
    font-weight: normal;
    font-stretch: normal;
    line-height: 2.5rem;
    letter-spacing: 0;
    color: #fff;
    bottom: 1.03rem;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  // 弹窗确认
  .affirmBox {
    width: 20rem;
    height: 11.25rem;
    background-color: #fff;
    border-radius: 0.13rem;

    .van-dialog__message {
      width: 12.69rem;
      height: 0.75rem;
      font-size: 0.75rem;
      font-weight: normal;
      font-stretch: normal;
      line-height: 1.13rem;
      letter-spacing: 0;
      color: #f14e4e;
    }
  }
}
</style>
