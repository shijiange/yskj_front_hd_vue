<template>
  <div id="circleDetails" v-if="circleInfo">
    <c-title :hide="false" :text="circleInfo.name" :url="backUrl"></c-title>
    <div class="member" :style="{ 'background-image': 'url(' + bg_img + ')' }">
      <div class="memberUser">
        <div class="face">
          <van-image round :src="circle_img" style="width: 3.75rem; height: 3.75rem; border-radius: 50%;"></van-image>
        </div>
        <div class="userInfo">
          <div class="c1">{{ name }}</div>
          <div class="number">
            <div class="productionNum">
              <div class="tipText">作品</div>
              <div class="numShow">{{ invitation_count }}</div>
            </div>
            <div class="productionNum">
              <div class="tipText">成员</div>
              <div class="numShow">{{ member_count }}</div>
            </div>
          </div>
          <div class="c3">简介:{{ synopsis }}</div>
        </div>
        <div class="btn" @click="check(id)">查看</div>
        <i class="iconfont iconSet icon-fontclass-shezhi2" v-if="is_master == 1" @click="setting(id)"></i>
      </div>
    </div>
    <div class="wrapper">
      <div class="acticle" v-if="topList && topList.length > 0">
        <div class="acticleItem" v-for="(item, index) in topList" :key="index">
          <div class="label">置顶</div>
          <div class="title" @click="toPostDetails(index, 'top')">{{ item.title }}</div>
        </div>
      </div>
      <div class="tabs" @click="switchTabs">
        <div class="tabItem" :class="currentShowTab == 'attention' ? 'active' : ''" data-name="attention">关注</div>
        <div style="margin-left: 1.59rem;" class="tabItem" :class="currentShowTab == 'posts' ? 'active' : ''" data-name="posts">帖子</div>
        <div style="margin-left: 1.59rem;" class="tabItem" :class="currentShowTab == 'video' ? 'active' : ''" data-name="video">视频</div>
      </div>
      <d-list @load="loadPost" :finished="postPagination.finished" :loading="postPagination.loading" :showStatusText="circleInfo.is_exist || circlePosts.length > 0">
        <div class="cards">
          <div v-for="(item, itemIndex) in circlePosts" :key="item.id" @click="toPostDetails(itemIndex)">
            <post-item :data="item" :showCircle="false">
              <div slot="operator" style="display: flex;">
                <circle-button class="btn" @click="attentionAuthor(itemIndex)" :border="!item.is_attention" height="1.625rem" :style="{ padding: '0.2rem 0.2125rem' }">{{
                  item.is_attention ? "已关注" : "关注"
                }}</circle-button>
                <img
                  src="../../../assets/images/micro_communities/detail_more@2x.png"
                  v-if="circleInfo.is_master"
                  @click.stop="displayPostActionSheet(itemIndex)"
                  style="margin-left: 0.625rem; width: 1.25rem;"
                />
              </div>
            </post-item>
          </div>
        </div>
      </d-list>

      <div class="noCircle" v-if="circleInfo.is_master == 0 && is_exist == 0">加入圈子查看更多帖子~</div>
    </div>

    <div class="sendBtns">
      <div
        class="sendBtn"
        :class="{ reviewing: circleInfo.member_review == 0 && circleInfo.is_exist == 1 }"
        v-if="(circleInfo.is_master == 0 && is_exist == 0) || circleInfo.member_review == 0"
        @click="joinCircle"
      >
        {{ joinQuitCircleText }}
      </div>
    </div>
    <div class="postBtn">
      <img
        src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/circleDetailPost@3x.png"
        @click="compile(id)"
        v-if="circleInfo.is_master == 1 || (circleInfo.is_posting == 1 && circleInfo.is_exist == 1 && circleInfo.member_review == 1)"
      />
    </div>
    <van-action-sheet :actions="postActionSheet" v-model="showPostActionSheet" cancel-text="取消" close-on-click-action @select="selectPostActionSheet"></van-action-sheet>
  </div>
</template>

<script>
import circleDetails_controller from "./circleDetails_controller";

export default circleDetails_controller;
</script>

<style scoped>
.post-item {
  margin-bottom: 1.25rem;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#circleDetails {
  .member {
    width: 100%;
    height: 9rem;
    // background-image: url("https://dev3.yunzmall.com/attachment/image/aae1e9a875eab1b4c9bdc44f69a3c0d7.jpeg");
    background-size: 100%;
    border-bottom-left-radius: 60% 15%;
    border-bottom-right-radius: 60% 15%;
    overflow: hidden;
    position: relative;
    text-align: left;

    .memberUser {
      flex: 1;
      display: flex;
      padding: 0.938rem;

      .face {
        img {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 50%;
        }
      }

      .userInfo {
        display: flex;
        overflow: hidden;
        flex-direction: column;
        color: #fff;
        padding-left: 0.5rem;

        .c1 {
          font-size: 1.375rem;
          font-weight: bold;
        }

        .number {
          display: flex;
          width: 8.522rem;
          // 作品数量
          .productionNum {
            width: 3.5rem;
            display: flex;
            flex: 1;

            .tipText {
              font-size: 0.875rem;
              font-weight: bold;
              flex: 2;
            }

            .numShow {
              font-size: 0.875rem;
              font-weight: bold;
              flex: 2;
            }
          }
        }

        .c3 {
          font-size: 0.75rem;
          font-weight: bold;
          color: #e1e1e1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .btn {
      position: absolute;
      top: 2rem;
      right: 0.94rem;
      width: 3.75rem;
      height: 1.563rem;
      background-color: #3175fe;
      border-radius: 0.781rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.688rem;
      font-weight: bold;
      color: #fff;
    }

    .iconSet {
      position: absolute;
      top: 0.3rem;
      right: 1.94rem;
      font-weight: bold;
      color: #fff;
    }
  }

  .wrapper {
    width: 100%;
    padding: 0 0.9375rem;
    transform: translateY(-3rem);

    .acticle {
      background: #fff;
      border-radius: 0.625rem;
      padding-left: 0.813rem;
      padding-right: 1rem;
      padding-top: 0.475rem;
      padding-bottom: 0.1rem;

      .acticleItem {
        display: flex;
        align-items: center;
        margin-bottom: 0.319rem;

        .label {
          width: 3rem;
          height: 1.125rem;
          background-color: #d6e4ff;
          border-radius: 0.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.688rem;
          font-weight: bold;
          color: #3175fe;
        }

        .title {
          margin-left: 0.375rem;
          color: #202020;
          font-size: 0.938rem;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .tabs {
    margin-top: 0.625rem;
    background: #fff;
    border-top-left-radius: 0.625rem;
    border-top-right-radius: 0.625rem;
    display: flex;
    padding: 0.863rem 0.969rem 0.5rem;

    .tabItem {
      font-size: 0.813rem;
      font-weight: bold;
      color: #666;
      display: flex;
      align-items: flex-end;
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
      left: 0.3rem;
    }
  }

  .cards {
    padding-bottom: 1.375rem;
  }

  .card:nth-child(1) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .card {
    background-color: #fff;
    border-radius: 0.625rem;
    padding: 0.781rem 0.875rem 1rem 0.938rem;
    margin-bottom: 0.625rem;
    text-align: left;

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
        margin-left: 0.469rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
          font-size: 0.938rem;
          font-weight: bold;
          color: #333;
        }

        .time {
          font-size: 0.688rem;
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
        height: 1.563rem;
        background-color: #3175fe;
        border-radius: 0.781rem;
        color: #fff;
        font-size: 0.688rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .iconfont {
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        height: 2.5rem;
        margin-left: 1.094rem;
      }
    }

    .title {
      font-size: 1rem;
      font-weight: bold;
      color: #202020;
      padding-top: 1rem;
      padding-bottom: 0.8rem;
    }

    .desc {
      font-size: 0.813rem;
      font-weight: bold;
      font-stretch: normal;
      color: #868585;
      padding-bottom: 0.8rem;
    }

    .contentImg {
      img {
        width: 100%;
        height: 100%;
        // width: 18.75rem;
        // height: 9.375rem;
        // background-color: #fac337;
        border-radius: 0.469rem;
      }
    }

    .circleWrapper {
      width: 9.25rem;
      height: 1.188rem;
      background-color: #f1f6ff;
      border-radius: 0.594rem;
      display: flex;
      padding: 0.125rem 0.219rem;

      img {
        width: 0.938rem;
        height: 0.938rem;
        border-radius: 50%;
      }

      .text {
        margin-left: 0.29rem;
        font-size: 0.625rem;
        font-weight: bold;
        color: #6d99f3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .otherInfo {
      margin-top: 0.5rem;
      display: flex;
      justify-content: flex-end;

      .otherItem {
        margin-left: 1rem;
        display: inline-flex;
        align-items: flex-end;

        .iconfont {
          display: inline-flex;
          vertical-align: baseline;
          margin-right: 0.1rem;
          color: #7c7c78;
          align-items: center;
        }

        .iconfont.active {
          color: #3175fe;
        }
      }
    }
  }

  .noCircle {
    font-size: 0.688rem;
    font-weight: bold;
    color: #787878;
    text-align: center;
  }

  .sendBtns {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 1.28rem;
    height: 2.5rem;
    padding: 0 2.125rem;
    margin: 0 auto;
    width: 23.4375rem;

    .sendBtn {
      height: 2.5rem;
      background-color: #3175fe;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.938rem;
      color: #fff;

      &.reviewing {
        filter: grayscale(100%);
      }
    }
  }

  .postBtn {
    position: fixed;
    bottom: 4rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    box-shadow: 0 0 0 0 rgba(190, 190, 190, 0.6);

    @media screen and (min-width: 1025px) {
      left: 50%;
      margin-left: 8.75rem;
      transform: translateX(-50%);
    }

    img {
      width: 3rem;
      height: 3rem;
    }
  }
}
</style>
