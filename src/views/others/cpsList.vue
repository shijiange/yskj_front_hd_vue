<template>
  <div id="cpsList">
    <c-title :hide="false" :text="title"> </c-title>
    <div class="list-wrap">
      <div class="list" v-for="(item, ind) in info" :key="ind" @click="tapDetail(item.id)">
        <div class="left">
          <img :src="item.logo" alt="" />
        </div>
        <div class="right">
          <div class="title">
            <div class="left-icon">
              <img :src="item.logo" alt="" />
            </div>
            <div class="text">{{item.name}}</div>
          </div>
          <div class="price">￥{{item.sale_price}}</div>
          <div class="normal-price">
            <del>官方价￥{{item.face_price}}</del>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cpsList_controller from "./cpsList_controller";

export default cpsList_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
/deep/ .van-tabs__line {
  background-image: url("../../assets/images/index_nav_select2.png");
  background-repeat: no-repeat;
  background-color: transparent;
  background-position: center;
  height: 10px;
}

#cpsList {
  .tabs {
    height: 2.5rem;
    background: #fff;
    line-height: 2.5rem;

    .tab {
      display: inline-block;
      text-align: center;
      width: 4.6875rem;
      position: relative;

      .bottom-icon {
        position: absolute;
        left: 50%;
        right: 50%;
        bottom: 0.375rem;
        transform: translate(-50%, -50%);
      }
    }
  }

  .list-wrap {
    .list {
      width: 22.1875rem;
      background: #fff;
      border-radius: 0.625rem;
      margin: 0 auto;
      box-sizing: border-box;
      margin-top: 0.625rem;
      padding: 0.625rem;
      display: flex;

      .left {
        width: 8.75rem;
        background: #f3f3f3;
        border-radius: 0.375rem;
        margin-right: 0.625rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.375rem;
        }
      }

      .right {
        padding-left: 0.625rem;
        // border-left: 1px solid #f3f3f5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        height: 4rem;

        .title {
          display: flex;

          .left-icon {
            width: 1.125rem;
            height: 1.125rem;
            background: #f3f3f3;
            border-radius: 50%;
            margin-right: 0.625rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
        }

        .price {
          color: #d84c44;
        }

        .normal-price {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
