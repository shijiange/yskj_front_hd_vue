<template>
  <div id="circleMyRelease">
    <c-title :hide="false" text="我的发布"></c-title>
    <div class="member" :style="{ 'background-image': 'url(' + bg_img + ')' }">
      <van-uploader
        :after-read="onRead(false)"
        class="backUpload"
        v-if="!visitor"
      >
        <van-button icon="plus" style="font-size: 0.75rem;">上传背景</van-button>
      </van-uploader>
    </div>

    <div class="main-container">
      <div class="header">
        <div class="header-user">
          <div>
            <div class="header-user-nickname">{{ name }}</div>
            <div class="header-user-signature">
              {{ autograph != "" ? autograph : "个性签名" }}
               <i
                class="iconfont icon-fontclass-bianji"
                @click="showEditSignaturePopup"
                v-if="!visitor"
              ></i>
            </div>
          </div>
          <van-image width="3.75rem" height="3.75rem" round :src="header_img"></van-image>
        </div>
        <ul class="header-statistics">
          <li class="header-statistics-item">
            <div class="header-statistics-count">{{ invitation_count }}</div>
            <div class="header-statistics-title">作品</div>
          </li>
          <li class="header-statistics-item">
            <div class="header-statistics-count">{{ like_count }}</div>
            <div class="header-statistics-title">点赞</div>
          </li>
        </ul>
      </div>

      <div class="tabs">
        <div
          :class="{ tabItem: true, active: currentShowType == 'post' }"
          @click="switchPost('post')"
        >帖子</div>
        <div
          style="margin-left: 1.59rem;"
          :class="{ tabItem: true, active: currentShowType == 'video' }"
          @click="switchPost('video')"
        >视频</div>
      </div>
      <div class="post-list">
        <d-list
          @load="loadMorePost"
          :finished="postPagination.finished"
          :loading="postPagination.loading"
        >
          <div
            v-for="(postItem, itemIndex) in posts"
            :key="postItem.id"
            @click="viewPost(itemIndex)"
          >
            <post-item class="post-item" :data="postItem">
              <div v-if="!visitor" slot="operator" style="text-align: right;">
                <i
                  class="iconfont icon-fontclass-tiezishezhi"
                  @click.stop="displayPostActions(itemIndex)"
                ></i>
              </div>
            </post-item>
          </div>
        </d-list>
      </div>
    </div>

    <van-action-sheet
      v-model="showPostActions"
      :actions="postActions"
      cancel-text="取消"
      close-on-click-action
      @select="selectActionSheet"
      @cancel="currentActionPostIndex=null"
    ></van-action-sheet>

    <van-dialog
      v-model="displayEditSignaturePopup"
      title="修改个性签名"
      show-cancel-button
      @confirm="saveSignature"
    >
      <van-field placeholder="请输入签名内容" name="content" v-model="formSignatureContent"></van-field>
    </van-dialog>
  </div>
</template>

<script>
import circleMyRelease_controller from "./circleMyRelease_controller";

export default circleMyRelease_controller;
</script>

<style scoped>
.main-container {
  padding: 0 0.9375rem;
  transform: translateY(-4.6875rem);
}

.header {
  padding: 0.9375rem 1.25rem;
  background-color: white;
  border-radius: 0.5rem;
}

.header-user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.header-user div:first-of-type {
  width: 14.75rem;
}

.header-user-nickname {
  overflow: hidden;
  font-size: 1.375rem;
  font-weight: bold;
  color: #202020;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.header-user-signature {
  margin-top: 0.6875rem;
  color: #666;
  font-size: 0.75rem;
  word-break: break-all;
}

.header-statistics {
  display: flex;
  justify-content: flex-start;
  margin-top: 1.6875rem;
}

.header-statistics-item {
  display: inline-block;
  margin-right: 1.4375rem;
  padding: 0.5625rem;
}

.header-statistics-count {
  font-size: 0.9375rem;
  color: #202020;
}

.header-statistics-title {
  margin-top: 0.5625rem;
  font-size: 0.75rem;
  color: #666;
}

.signature-form {
  padding: 2.5rem 0.625rem 0.625rem;
  width: 80vw;
  height: 12.5rem;
}

.signature-form button {
  margin-top: 0.625rem;
}

.post-item {
  margin-bottom: 0.625rem;
}

.post-item:first-of-type {
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#circleMyRelease {
  position: relative;

  .member {
    width: 100%;
    height: 9rem;
    background-image: url("https://dev3.yunzmall.com/attachment/image/aae1e9a875eab1b4c9bdc44f69a3c0d7.jpeg");
    background-size: 100%;
    border-bottom-left-radius: 60% 15%;
    border-bottom-right-radius: 60% 15%;
    overflow: hidden;
    position: relative;
    // 上传背景图
    /deep/ .backUpload {
      position: absolute;
      top: 1.34rem;
      right: 0.94rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.63rem;
      color: #fff;
      width: 5rem;
      height: 1.344rem;
      border-radius: 0.125rem;
      border: solid 0.031rem #fff;

      .van-uploader__wrapper {
        height: 100%;

        .van-uploader__input-wrapper {
          height: 100%;

          button {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0;
            transform: scale(0.8);
            margin: 0;
            background: none;
            border: none;
            font-size: 0.125rem;
            color: #fff;

            .van-button__content {
              width: 100%;
            }
          }
        }
      }

      .van-uploader__preview {
        display: none;
      }
    }
    // 上传背景图
    .upimg {
      position: absolute;
      top: 1.34rem;
      right: 0.94rem;
      width: 4.25rem;
      height: 1.34rem;
      border-radius: 0.13rem;
      border: solid 0.05rem #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.63rem;
      color: #fff;

      i {
        font-size: 0.63rem;
        margin-top: 0.0625rem;
      }
    }
  }

  .wrapper {
    position: absolute;
    top: 5.5rem;
    width: 100%;
    padding: 0 0.9375rem;
  }

  .tabs {
    margin-top: 0.625rem;
    background: #fff;
    border-top-left-radius: 0.625rem;
    border-top-right-radius: 0.625rem;
    display: flex;
    padding: 0.863rem 0.969rem 0.5rem;

    /deep/.tabItem {
      font-size: 0.813rem;
      font-weight: bold;
      color: #666;
      display: flex;
      align-items: flex-end;
    }

    /deep/.tabItem.active {
      font-size: 1rem;
      color: #3175fe;
      position: relative;
    }

    /deep/.tabItem.active::after {
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
}
</style>
