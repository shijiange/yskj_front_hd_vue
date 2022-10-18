<template>
  <div class="page">
    <c-title text="开团"></c-title>

    <div class="items">
      <div class="item" :class="{ active: sid == item.activity_id }" v-for="(item, key) in listData" :key="key" @click="setSid(item)">
        <div class="face">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="name">
          {{ item.title }}
        </div>
        <div class="num">开团次数：{{ item.open_num }}</div>
      </div>
    </div>

    <div class="sendWrapper">
      <div class="send" @click="openGroup">开团</div>
    </div>

    <div class="float">
      <div class="btn" @click="gotoStarMusicIndex">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_index.png" alt="" />
      </div>
      <div class="btn" @click="gotoStarMusicMy">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_my.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import starMusicOpenGroupController from "./star_music_open_group_controller";

export default starMusicOpenGroupController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #f4f4f4;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.items {
  padding: 0.938rem 0.906rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: left;

  .item {
    width: 10.438rem;
    height: 15rem;
    background-color: #fff;
    border-radius: 0.313rem;
    margin-bottom: 0.906rem;

    &.active {
      border: 0.05rem solid #f14e4e;
    }

    .face {
      img {
        width: 100%;
        height: 10.469rem;
        background-color: #aeaeae;
        border-radius: 0.313rem 0.313rem 0 0;
      }
    }

    .name {
      padding: 0 0.469rem 0 0.469rem;
      font-size: 0.938rem;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .num {
      margin-top: 0.25rem;
      padding-left: 0.469rem;
      font-size: 0.625rem;
      color: #333;
    }
  }
}

.sendWrapper {
  position: fixed;
  left: 2.2rem;
  right: 2.2rem;
  bottom: 1.563rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: 0.3s;

  .send {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    background-color: #f14e4e;
    border-radius: 0.469rem;
    width: 340px;

    &:active {
      background-color: #ef3b3b;
    }
  }
}

.float {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-10rem);

  .btn {
    width: 2.813rem;
    height: 2.813rem;
    margin-top: 0.5rem;

    img {
      width: 2.813rem;
      height: 2.813rem;
    }
  }
}
</style>
