<template>
  <div id="case-template">
    <div class="li" v-for="(item, index) in datas" :key="index" @click="gotoCaseDetail(item.id)">
      <div class="top">
        <div class="img">
          <img :src="item.img_src || emptyImage" alt="" />
          <!-- <div class="icon">
            <img src="../../../../../assets/images/radius-alipay.png" alt="" />
          </div> -->
        </div>
        <div class="content">
          <div class="title">{{item.case_name}}</div>
          <div class="detail">{{item.desc}}</div>
        </div>
      </div>
      <div class="bottom-a">
        <div class="rate">
          <van-rate v-model="item.level" :size="15" color="#ffd21e" void-icon="star" void-color="#eee" readonly allow-half />
          <span class="number">{{item.level}}</span>
        </div>
        <div class="look">
          <i class="iconfont icon-ht_operation_perview"></i>
          {{item.read_num}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import case_controller from './case_controller';

export default case_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-template {
  background: #fff;
  display: flex;
  flex-wrap: wrap;

  .li {
    width: 281px;
    height: 149px;
    border: 1px solid #eee;
    padding: 20px;
    margin: 21px 25px 21px 0;

    .top {
      display: flex;

      .img {
        min-width: 71px;
        width: 71px;
        height: 71px;
        margin-right: 10px;
        position: relative;

        img {
          width: 100%;
          height: 100%;
        }

        .icon {
          position: absolute;
          top: 0;
        }
      }

      .content {
        flex: 1;
        text-align: left;
        width: 167px;

        .title {
          font-size: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .detail {
          color: #666;
          padding-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .bottom-a {
      display: flex;
      margin-top: 10px;
    }

    .rate {
      flex: 1;
      text-align: left;

      .number {
        display: inline-block;
        padding: 0 10px;
      }
    }
  }

  .li:hover {
    cursor: pointer;
    box-shadow: 1px 2px 10px #eee;
  }

  .li:nth-child(4n + 0) {
    margin-right: 0;
  }
}
</style>
