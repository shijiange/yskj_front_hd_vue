<template>
  <div id="circleSearch">
    <c-title text="圈子"></c-title>
    <!-- <div class="cline"></div> -->
    <van-search
      v-model="name"
      placeholder="请输入圈子名称"
      shape="round"
      clearable
      @input="searchMember()"
      autofocus
    >
      <span slot="left-icon"></span>
    </van-search>
    <div class="circle-list">
      <d-list
        @load="getCircles"
        :finished="circlesPagination.finished"
        :loading="circlesPagination.loading"
      >
        <div
          v-for="circleItem in circles"
          :key="circleItem.id"
          @click="viewCircle(circleItem.id)"
        >
          <circle-item :data="circleItem" @button-click="viewCircle(circleItem.id)"></circle-item>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import circleSearch_controller from "./circleSearch_controller";

export default circleSearch_controller;
</script>

<style scoped>
.circle-list {
  padding: 0 0.94rem;
  background: #fff;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
#circleSearch {
  .tablis {
    background: #fff;
    padding: 1.19rem 0.94rem 1.19rem 0.84rem;

    .lis:first-child {
      margin-top: 0;
    }

    .lis {
      width: 100%;
      height: 2.38rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2.09rem;

      .right {
        background-color: #3175fe;
        border-radius: 0.78rem;
        font-size: 0.81rem;
        color: #fff;
        padding: 0.38rem 1.06rem 0.41rem 1.06rem;
      }

      .right_one {
        background-color: #a6a6a6;
        border-radius: 0.78rem;
        font-size: 0.81rem;
        color: #fff;
        // padding: 0.38rem 1.06rem 0.41rem 1.06rem;
        width: 3.75rem;
        height: 1.56rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.active {
          background-color: #3175fe;
        }
      }

      .left {
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;

        .circleImg {
          width: 2.19rem;
          height: 2.19rem;
          background-color: #cfcfcf;
          border-radius: 100%;
          margin-right: 0.63rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }

        .circle {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          overflow: hidden;

          .detail {
            display: flex;
            font-size: 0.69rem;

            i {
              font-size: 0.8rem;
              color: #ffa200;
            }

            span {
              margin-left: 0.41rem;
            }

            .member {
              margin-left: 1.34rem;
            }
          }

          .title {
            width: 100%;
            font-size: 0.94rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
        }
      }
    }
  }

  .searchBox {
    width: 23.44rem;
    height: 3.06rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding: 0.44rem 0.94rem 0 0.94rem;

    .search {
      background-color: #eff0f1;
      border-radius: 0.94rem;
      height: 1.88rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        color: #aaa;
        margin-right: 0.5rem;
      }

      input {
        margin-left: 0.75rem;
        border: none;
      }
    }
  }

  .cline {
    width: 100%;
    height: 2.5rem;
  }
}
</style>
