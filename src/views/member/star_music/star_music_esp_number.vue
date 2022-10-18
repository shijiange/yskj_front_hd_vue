<template>
  <div class="page">
    <c-title text="星拼资格次数"></c-title>

    <div class="items">
      <div class="item" v-for="(item,key) in listData" :key="key">
        <div class="name">{{item.activity_name}}</div>
        <div class="desc">次数:{{item.open_num}}次</div>
      </div>
    </div>
  </div>
</template>

<script>
import starMusicEspNumberController from "./star_music_esp_number_controller";

export default starMusicEspNumberController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page {
    background: #fff;
    min-height: 100vh;
    padding-bottom: 3.0625rem;
  }

  .items {
    padding: 0 0.938rem;

    .item {
      height: 3.5rem;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      border-bottom: 0.063rem solid #ebebeb;

      .name {
        font-size: 0.813rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .desc {
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }
  }
</style>