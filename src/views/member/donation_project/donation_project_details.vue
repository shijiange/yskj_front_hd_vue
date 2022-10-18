<template>
  <div class="page">
    <c-title text="个人捐赠详情"></c-title>

    <div class="brief">
      <div class="face">
        <img :src="person.latest_project_img" alt="" />
      </div>
      <div class="desc_info">
        <div class="name overflow">{{ person.name }}</div>
        <div class="choice_time" @click="time_show = true">
          <span>{{ time_text == "" ? "选择时间" : time_text }}</span>
          <i class="iconfont icon-member-bottom"></i>
        </div>
      </div>
    </div>

    <div class="wrapper">
      <div class="container">
        <div class="container-header">
          <div class="container-title">捐赠信息</div>
          <div class="container-header-next" @click="gotoPage('donationProjectInfo')">
            <span>查看更多</span>
            <i class="iconfont icon-advertise-next"></i>
          </div>
        </div>
        <div class="donation-list ">
          <div class="donation-item" v-for="item in info_list" :key="item.id">
            <div class="project_name overflow">{{ item.project_title }}</div>
            <div class="price">
              捐赠金额: <span class="small">￥</span><span class="num">{{ item.price }}</span>
            </div>
            <div class="project_ps" v-if="item.remarks && item.remarks != ''">备注：{{ item.remarks }}</div>
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
                <video v-if="item.url" :src="item.url" controls="controls"></video>
                <span v-else>暂无内容</span>
              </div>
              <div class="project_name overflow">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="time_show" position="bottom" round>
      <div class="time_select">
        <div class="time_select_header">
          <i class="iconfont icon-ht_more_right icon-left" @click="changeYear('recude')"></i>
          <span>{{ current_year }}年</span>
          <i class="iconfont icon-ht_more_right" :class="{ disabled: current_year == max_year }" @click="changeYear('add')"></i>
        </div>
        <div class="time_select_container">
          <div
            class="time_select_item"
            @click="changeMonth(item)"
            :class="[current_month == item ? 'active' : '', current_year >= max_year && item > max_month ? 'disabled' : '']"
            v-for="(item, index) in 12"
            :key="index"
          >
            {{ item }}月
          </div>
        </div>
        <div class="time_searct_btn" @click="timeConfirm">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import controller from "./donation_project_details_controller.js";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  padding-bottom: 1rem;
}

.brief {
  display: flex;
  padding: 0.938rem;
  background: #fff;

  .desc_info {
    padding-left: 0.625rem;
    text-align: left;
    overflow: hidden;

    .name {
      font-size: 15px;
      color: #333;
    }

    .choice_time {
      display: inline-flex;
      align-items: center;
      height: 1.625rem;
      margin-top: 0.938rem;
      padding: 0 0.688rem;
      color: #f15353;
      border-radius: 0.188rem;
      border: solid 0.031rem #f15353;

      span {
        font-size: 12px;
        padding-right: 0.4rem;
      }
    }
  }
}

.wrapper {
  padding: 0.625rem;
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
      font-size: 0.875rem;
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
}

.donation-list {
  padding: 0.4rem 0;
  padding-bottom: 0.8rem;

  .donation-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.9rem 0.781rem;
    text-align: left;
    border-bottom: 0.031rem solid #f6f6f6;

    &:last-child {
      border-bottom: 0;
    }

    .project_name {
      font-size: 15px;
      color: #333;
    }

    .price {
      margin-top: 0.4rem;
      font-size: 13px;
      color: #333;

      .small {
        font-size: 12px;
        color: #f15353;
      }

      .num {
        font-size: 15px;
        color: #f15353;
      }
    }

    .project_ps {
      margin-top: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 11px;
      color: #6f6f6f;
    }
  }
}

.picture {
  margin-top: 0.625rem;

  .container-icon-title {
    display: flex;
    align-items: center;
    color: #f15353;

    span {
      margin-left: 0.5rem;
      font-size: 16px;
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
    padding-bottom: 0.688rem;

    .picture-container {
      display: flex;
      overflow-x: scroll;

      .picture-item {
        display: flex;
        flex-direction: column;
        width: 7.63rem;
        padding-top: 0.6rem;
        padding-left: 0.781rem;
        padding-bottom: 0.688rem;

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

.face {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

  span {
    font-size: 13px;
    color: #7c7c7c;
  }

  .playerBtn {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 1.375rem;
    height: 1.375rem;
    margin: auto;
    border-radius: 50%;

    i {
      color: #fff;
      font-size: 20px;
    }
  }
}

.time_select {
  padding-bottom: 1.375rem;

  .disabled {
    opacity: 0.5;
  }

  .time_select_header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1.53rem;

    .icon-left {
      transform: rotateY(180deg);
    }

    .iconfont {
      color: #a0a0a0;
      font-size: 13px;
    }

    span {
      padding: 0 1.5rem;
      font-size: 18px;
      color: #151414;
    }
  }

  .time_select_container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-items: center;
    padding-top: 0.3rem;

    .time_select_item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.688rem;
      height: 1.375rem;
      margin-top: 2rem;
      font-size: 14px;
      color: #202020;
      border-radius: 0.125rem;

      &.active {
        color: #fff;
        background-color: #f15353;
      }
    }
  }

  .time_searct_btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15.906rem;
    height: 2.125rem;
    margin: 2.3rem auto 0;
    font-size: 16px;
    color: #fff;
    background-color: #f15353;
    border-radius: 0.313rem;
  }
}
</style>
