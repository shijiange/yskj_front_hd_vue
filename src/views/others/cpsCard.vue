<template>
  <div id="cpsCard">
    <c-title :hide="false" text="我的卡券"> </c-title>
    <div class="top">
      <div class="top-box">
        <div class="left"></div>
        <div class="mid">
          <img src="../../assets/images/icon_card_title_left.png" />
          <div style="font-size: 16px; color: #633b26; margin: 0 0.625rem;">热门推荐</div>
          <img src="../../assets/images/icon_card_title_right.png" />
        </div>
        <div class="right"></div>
      </div>
      <div class="top-content">
        <div class="block">
          <div class="item" v-for="(item, ind) in hot" :key="ind" @click="tapCard(item.id,item.name)">
            <div class="item-avatar">
              <img :src="item.logo" alt="" />
            </div>
            <div style="font-size: 12px; margin-top: 0.4375rem;">{{ item.name }}</div>
            <div style="color: #777; font-size: 12px; margin-top: 0.25rem;">{{ item.description }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-tabs v-model="acindex" scrollspy sticky style="padding-top: 1rem;" type="card">
      <van-tab v-for="(item, index) in category" :title="item.name" :key="index">
        <div class="free-welfare">
          <div class="welfare-title">
            <img src="../../assets/images/icon_card_title_left.png" />
            <div style="font-size: 16px; color: #633b26; margin: 0 0.625rem;">{{ category[index] ? category[index].name : "" }}</div>
            <img src="../../assets/images/icon_card_title_right.png" />
          </div>
          <div class="welfare-content">
            <div class="block">
              <div class="item" v-for="(info, index) in category[index].brand" :key="index" @click="tapCard(info.id,info.name)">
                <div class="item-avatar">
                  <img :src="info.logo" alt="" />
                </div>
                <div style="font-size: 12px; margin-top: 0.4375rem;">{{ info.name }}</div>
                <div class="txtTips">{{ info.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import cpsCard_controller from "./cpsCard_controller";

export default cpsCard_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
/deep/.van-tabs__nav--complete {
  // padding-left: 0;
  // padding-right: 0;
}

/deep/.van-tabs__nav--card {
  margin: 0;
  border: none;
  border-radius: 0;
}

/deep/ .van-tabs__nav--card .van-tab {
  border: none;
}

/deep/ .van-tabs__nav {
  background: #353535;
}

/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  color: #633b26;
  background-color: #fcce6a;
  border-radius: 20px;
}

/deep/ .van-tabs__nav--card .van-tab {
  color: #eed9ac;
  border: none;
}

/deep/ .van-sticky--fixed {
  top: 40px;
  padding: 10px 0;
  background: #353535;
}

.txtTips {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #777;
  font-size: 12px;
  margin-top: 0.25rem;
}

#cpsCard {
  overflow: hidden;
  background: #353535;
  min-height: 100vh;

  .top {
    .top-box {
      display: flex;
      justify-content: center;
      width: 21.9375rem;
      margin: 0 auto;
      margin-top: 0.625rem;
      position: relative;

      .left {
        width: 0;
        height: 0;
        border-bottom: 0.75rem solid #f0b914;
        border-left: 0.75rem solid transparent;
        bottom: 0;
        left: 0.6875rem;
        position: absolute;
      }

      .right {
        width: 0;
        height: 0;
        border-bottom: 0.75rem solid #f0b914;
        border-right: 0.75rem solid transparent;
        bottom: 0;
        right: 0.6875rem;
        position: absolute;
      }

      .mid {
        width: 19.0625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.75rem;
        background: #ffdf90;
        border-radius: 0.75rem 0.75rem 0 0;

        img {
          margin: 0;
        }
      }
    }

    .top-content {
      width: 21.9375rem;
      background: #fff;
      border-radius: 0.75rem;
      box-sizing: border-box;
      margin: 0 auto;
      padding: 0.625rem 0;
      padding-bottom: 0;

      .block {
        width: 100%;
        flex-wrap: wrap;
        display: flex;

        .item {
          width: 20%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.625rem;

          .item-avatar {
            width: 2.8125rem;
            height: 2.8125rem;
            background: #d8d8d8;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }

  .tabs {
    margin-top: 0.625rem;
    display: flex;
    padding-left: 0.75rem;
    height: 2.125rem;
    overflow-x: scroll;

    .tab {
      width: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      color: #eed9ac;
      flex-shrink: 0;

      img {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
  }

  .free-welfare:last-child {
    margin-bottom: 30px;
  }

  .free-welfare {
    width: 21.9375rem;
    background: #fff;
    border-radius: 0.75rem;
    margin: 0 auto;
    margin-top: 0.9375rem;
    // margin-bottom: 4rem;
    box-sizing: border-box;

    .welfare-title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.375rem 0;
      border-bottom: solid 0.0625rem #e5e5e5;

      img {
        margin: 0;
      }
    }

    .welfare-content {
      padding: 0.625rem 0;
      padding-bottom: 0;

      .block {
        width: 100%;
        flex-wrap: wrap;
        display: flex;

        .item {
          width: 20%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.625rem;

          .item-avatar {
            width: 2.8125rem;
            height: 2.8125rem;
            background: #d8d8d8;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }

  .active {
    color: #633b26 !important;
  }
}
</style>
