<template>
  <div id="circleChecklist">
    <c-title :hide="false" text="审核列表"></c-title>
    <div class="tabs" @click="swtichTab">
      <div class="tabItem" data-key="members" :class="{active: currentShowTab == 'members' }">成员申请</div>
      <div class="tabItem" data-key="posts" :class="{ active:currentShowTab == 'posts' }">帖子申请</div>
    </div>
    <d-list v-show="currentShowTab == 'members'" @load="getMembers" :finished="membersPagination.finished" :loading="membersPagination.loading">
      <div class="userList" >
        <div class="userItem" v-for="(memberItem, itemIndex) in memberList" :key="memberItem.id">
          <div class="face">
            <img :src="memberItem.header_img" />
          </div>
          <div class="desc">
            <div class="name">{{ memberItem.name }}</div>
            <div class="label">{{ memberItem.created_at }}</div>
          </div>
          <div class="btns">
            <div class="btn status1" @click="pass(1, memberItem.id, itemIndex)">通过</div>
            <div class="btn status2" @click="rejectAppeal(2, memberItem.id, itemIndex)">驳回</div>
          </div>
        </div>
      </div>
    </d-list>

    <div class="cards" v-show="currentShowTab == 'posts'">
      <d-list
        @load="getPosts"
        :finished="postsPagination.finished"
        :loading="postsPagination.loading"
      >
        <div class="card" v-for="(postItem, itemIndex) in postList" :key="postItem.id">
          <div class="userInfo">
            <div class="face">
              <van-image :src="postItem.avatar" width="2.5rem" height="2.5rem"></van-image>
            </div>
            <div class="right">
              <div class="name">{{ postItem.nickname }}</div>
              <div class="time">{{ postItem.created_at }}</div>
            </div>
            <div class="opet">
              <div class="btn" @click="reviewPost(itemIndex,'pass')">通过</div>
              <div class="btn reject" @click="reviewPost(itemIndex,'reject')">驳回</div>
            </div>
          </div>
          <div class="title" style="text-align: left;">{{ postItem.title }}</div>
          <div class="desc" style="text-align: left;" v-if="postItem.status==1">{{ postItem.content }}</div>
          <div class="contentImg" v-if="postItem.img.length>0&&postItem.status==1">
            <van-image
              :src="postItem.img[0]"
              style="max-width: 18.75rem; max-height: 9.375rem; overflow: hidden;"
            ></van-image>
          </div>
          <div class="contentImg" v-else>
            <video :src="postItem.content" style="width: 100%;" controls></video>
          </div>
          <div class="otherInfo">
            <div class="otherItem">
              <i
                style="font-size: 1.25rem; height: 2.1875rem; margin-right: 0.375rem;"
                class="iconfont icon-fontclass-yulan"
              ></i>
              <span>{{ postItem.browse_count }}</span>
            </div>
          </div>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import circleChecklist_controller from "./circleChecklist_controller";

export default circleChecklist_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleChecklist {
  .tabs {
    background: #fff;
    display: flex;
    justify-content: space-evenly;
    padding: 0.7688rem 0 0.625rem;
    border-bottom: 0.12rem solid #f2f2f2;

    .tabItem {
      font-size: 0.875rem;
      font-weight: bold;
      color: #666;
      display: flex;
      align-items: flex-end;
    }

    .tabItem.active {
      color: #3175fe;
      position: relative;
    }

    .tabItem.active::after {
      content: "";
      display: block;
      width: 1.25rem;
      height: 0.1875rem;
      background-color: #3175fe;
      border-radius: 0.0938rem;
      position: absolute;
      bottom: -0.3125rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .userList {
    padding-top: 0.625rem;
    background: #fff;

    .userItem {
      height: 4.25rem;
      display: flex;
      align-items: center;
      padding: 0 0.9375rem;
      text-align: left;
      border-bottom: 0.12rem solid #f2f2f2;

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
        flex-direction: column;
        flex: 1;
        word-break: break-all;

        .name {
          font-size: 0.9375rem;
          font-weight: bold;
          color: #202020;
        }

        .label {
          color: #999;
          font-size: 0.6875rem;
          font-weight: bold;
        }
      }

      .btns {
        display: flex;

        .btn {
          width: 3.75rem;
          height: 1.5625rem;
          font-size: 0.6875rem;
          font-weight: bold;
          border-radius: 0.7813rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn.status1 {
          background-color: #3175fe;
          color: #fff;
          border: none;
        }

        .btn.status2 {
          margin-left: 0.5rem;
          background-color: #ffa200;
          color: #fff;
          border: none;
        }
      }
    }
  }

  .cards {
    padding-bottom: 1.5625rem;
  }

  .card {
    background-color: #fff;
    padding: 1.0625rem 0.875rem 1.0313rem 0.9375rem;
    margin-bottom: 0.625rem;

    .userInfo {
      display: flex;
      position: relative;

      .face {
        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
        }
      }

      .right {
        margin-left: 0.4688rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          font-size: 0.9375rem;
          font-weight: bold;
          color: #333;
        }

        .time {
          font-size: 0.6875rem;
          font-weight: bold;
          color: #999;
        }
      }
    }

    .opet {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;

      .btn {
        width: 3.75rem;
        height: 1.5625rem;
        background-color: #3175fe;
        border-radius: 0.7813rem;
        color: #fff;
        font-size: 0.8125rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn.reject {
        margin-left: 0.5rem;
        background-color: #ffa200;
        color: #fff;
      }
    }

    .title {
      font-size: 1rem;
      font-weight: bold;
      color: #202020;
      padding-top: 1.0938rem;
      padding-bottom: 0.9375rem;
      word-break: break-all;
    }

    .desc {
      font-size: 0.8125rem;
      font-weight: bold;
      font-stretch: normal;
      color: #868585;
      padding-bottom: 0.625rem;
      word-break: break-all;
    }

    .contentImg {
      img {
        width: 18.75rem;
        height: 9.375rem;
        background-color: #fac337;
        border-radius: 0.4688rem;
      }
    }

    .otherInfo {
      margin-top: 0.4688rem;
      display: flex;
      justify-content: flex-end;

      .otherItem {
        margin-left: 0.9375rem;
        display: inline-flex;
        align-items: flex-end;

        .iconfont {
          display: inline-flex;
          vertical-align: baseline;
          margin-right: 0.1563rem;
          color: #7c7c78;
          align-items: center;
        }

        .iconfont.active {
          color: #3175fe;
        }
      }
    }
  }
}
</style>
