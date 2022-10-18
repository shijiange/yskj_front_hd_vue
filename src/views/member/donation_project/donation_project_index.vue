<template>
  <div class="page">
    <c-title text="捐赠查询"></c-title>
    <van-search placeholder="搜索" shape="round" disabled @click="gotoPage('donationProjectSearch', { fromHome: 1 })"></van-search>

    <div class="wrapper">
      <div class="container">
        <div class="container-header">
          <div class="container-title">捐赠信息</div>
          <div class="container-header-next" @click="gotoPage('donationProjectList')">
            <span>查看更多</span>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </div>
        <div class="donation-list ">
          <div class="donation-item" v-for="item in latest_list" :key="item.id">
            <div class="face">
              <img
                v-if="item.project_v && item.project_v.change_img && item.project_v.change_img.length > 0"
                :src="item.project_v.change_img[0]"
                alt=""
                @click="handImagePreview(item.project_v.change_img[0])"
              />
              <span v-else>暂无内容</span>
            </div>
            <div class="desc_info" @click="gotoPage('donationProjectDetails', {}, { id: item.id })">
              <div class="name overflow">姓名：{{ item.name }}</div>
              <div class="price">
                捐赠金额: <span class="small">￥</span><span class="num">{{ item.price }}</span>
              </div>
              <div class="project_name overflow" v-if="item.project_v">项目名称：{{ item.project_v.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="container picture">
        <div class="container-header">
          <div class="container-icon-title">
            <i class="iconfont icon-customform_list_3"></i>
            <span>图片</span>
          </div>
          <div class="container-header-next" @click="gotoPage('donationProjectPicture')">
            <span>查看更多</span>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </div>
        <div class="picture-list">
          <div class="picture-container">
            <div class="picture-item" v-for="(item, key) in picture_list" :key="key">
              <div class="face">
                <img v-if="item.url" :src="item.url" alt="" @click="handPictureImagePreview(key)" />
                <span v-else>暂无内容</span>
              </div>
              <div class="project_name overflow">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="container picture">
        <div class="container-header">
          <div class="container-icon-title">
            <i class="iconfont icon-fontclass-ship"></i>
            <span>视频</span>
          </div>
          <div class="container-header-next" @click="gotoPage('donationProjectVideo')">
            <span>查看更多</span>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </div>
        <div class="picture-list">
          <div class="picture-container">
            <div class="picture-item" v-for="(item, key) in video_list" :key="key">
              <div class="face">
                <div class="videoPayBtn" v-if="item.url">
                  <i class="iconfont icon-fontclass-bofang"></i>
                </div>

                <video v-if="item.url" :src="item.url" @click="handVideoPay(item.url)"></video>
                <span v-else>暂无内容</span>
              </div>
              <div class="project_name overflow">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="video_show" position="center" :overlay="true">
      <video :src="video_src" v-if="video_show" controls class="popup_video" autoplay></video>
    </van-popup>
  </div>
</template>

<script>
import controller from "./donation_project_index_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// .page { background: #fff; min-height: 100vh; padding-bottom: 3.0625rem; }
.wrapper {
  padding: 0.625rem;
}

.popup_video {
  width: 100vw;
  max-height: 100vh;
}

.container {
  width: 100%;
  background-color: #fff;
  border-radius: 0.469rem;

  .container-header {
    display: flex;
    justify-content: space-between;
    padding-top: 0.969rem;
    padding-left: 0.781rem;

    .container-title {
      position: relative;
      display: flex;
      align-items: center;
      font-weight: bold;
      padding-left: 0.469rem;
      font-size: 14px;
      color: #f15353;

      &::before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        content: " ";
        display: block;
        width: 0.125rem;
        height: 0.7rem;
        background: #f15353;
      }
    }

    .container-header-next {
      display: flex;
      align-items: center;
      color: #7f7f7f;
      font-size: 11px;
    }
  }

  .face {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 6.875rem;
    height: 4.563rem;
    margin: 0.2rem 0;
    background-color: #ededed;
    border-radius: 0.313rem;

    img {
      width: 6.875rem;
      height: 4.563rem;
      border-radius: 0.313rem;
      object-fit: cover;
    }

    video {
      width: 6.875rem;
      height: 4.563rem;
      border-radius: 0.313rem;
    }

    .videoPayBtn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);

      .iconfont {
        color: #fff;
        font-size: 1.25rem;
      }
    }

    span {
      font-size: 13px;
      color: #7c7c7c;
    }
    // .playerBtn {
    //   position: absolute;
    //   top: 0;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   width: 1.375rem;
    //   height: 1.375rem;
    //   margin: auto;
    //   border-radius: 50%;
    //   i {
    //     color: #fff;
    //     font-size: 20px;
    //   }
    // }
  }
}

.donation-list {
  padding: 0.4rem 0;

  .donation-item {
    display: flex;
    padding: 0.5rem 0.781rem;
    text-align: left;

    .desc_info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.625rem;
      font-size: 15px;
      color: #333;
      overflow: hidden;

      .price {
        .small {
          font-size: 12px;
          color: #f15353;
        }

        .num {
          font-size: 15px;
          color: #f15353;
        }
      }

      .project_name {
        font-size: 12px;
        color: #6e6e6e;
      }
    }
  }
}

.picture {
  margin-top: 0.625rem;
  padding-bottom: 0.688rem;

  .container-icon-title {
    display: flex;
    align-items: center;
    color: #f15353;

    span {
      margin-left: 0.5rem;
      font-size: 14px;
    }

    .icon-customform_list_3 {
      font-size: 14px;
      transform: translateY(0.05rem);
    }

    .icon-fontclass-ship {
      height: 1rem;
      width: 1.156rem;
      display: flex;
      align-items: center;
      font-size: 22px;
    }
  }

  .picture-list {
    display: flex;
    padding: 0 0.781rem;

    .picture-container {
      display: flex;
      overflow-x: scroll;

      .picture-item {
        display: flex;
        flex-direction: column;
        width: 7.63rem;
        padding-top: 0.6rem;
        padding-left: 0.781rem;

        &:first-child {
          padding-left: 0;
          width: 6.875rem;
        }

        .project_name {
          margin-top: 0.5rem;
          font-size: 11px;
          color: #2a2a2a;
        }
      }
    }
  }
}
</style>
