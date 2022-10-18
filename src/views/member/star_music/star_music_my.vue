<template>
  <div class="page">
    <c-title text="我的"></c-title>
    <div class="header">
      <div class="info">
        <div class="face">
          <img :src="member.avatar_image" alt="" />
        </div>
        <div class="name">{{ member.nickname }}</div>
      </div>
      <div class="record" @click="gotoStarMusicRewardsRecord">
        <i class="iconfont icon-fontclass-paihangbang"></i>
        奖励记录
      </div>
    </div>
    <!-- <div class="esp" @click="gotoStarMusicEspNumber">
			<div class="num">星拼资格次数</div>
			<i class="iconfont icon-member_right"></i>
		</div> -->
    <div class="split"></div>
    <div class="items">
      <div class="item" @click="starMusicPersonalGroup('open')">
        <div class="face">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_personal_group.png" alt="" />
        </div>
        <div class="name">我的开团</div>
      </div>
      <div class="item" @click="starMusicPersonalGroup('join')">
        <div class="face">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_join_group.png" alt="" />
        </div>
        <div class="name">我的参团</div>
      </div>
    </div>
  </div>
</template>

<script>
import starMusicMyController from "./star_music_my_controller";

export default starMusicMyController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  height: 7rem;
  padding: 1.6rem 1.438rem 0 1.563rem;
  background-color: #ee2e2b;
  text-align: left;

  .info {
    display: flex;

    .face {
      width: 2.875rem;
      height: 2.875rem;

      img {
        width: 2.875rem;
        height: 2.875rem;
        border-radius: 50%;
      }
    }

    .name {
      padding-left: 0.625rem;
      font-size: 0.8rem;
      color: #fff;
    }
  }

  .record {
    margin-left: 3.5rem;
    width: 5.625rem;
    height: 1.438rem;
    border-radius: 0.719rem;
    border: solid 0.031rem #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;

    .iconfont {
      padding-right: 0.2rem;
    }
  }
}

.esp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.969rem;
  padding-right: 0.938rem;
  color: #fff;
  width: 100%;
  height: 1.75rem;
  background-color: #f14e4e;
  font-size: 0.75rem;
}

.split {
  width: 23.438rem;
  height: 0.625rem;
  background-color: #ebebeb;
}

.items {
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  .item {
    width: 10.313rem;
    height: 3.75rem;
    border-radius: 0.125rem;
    border: solid 0.031rem #d5d5d5;
    padding-left: 0.75rem;
    display: flex;
    align-items: center;

    .face {
      img {
        width: 2.188rem;
        height: 2.188rem;
        background-color: #fe7c4c;
        border-radius: 0.125rem;
      }
    }

    .name {
      font-size: 1rem;
      color: #333;
      padding-left: 0.969rem;
    }
  }
}
</style>
