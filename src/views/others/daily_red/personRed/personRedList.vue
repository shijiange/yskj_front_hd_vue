<template>
  <div id="personRedList">
    <c-title :hide="false" text="个人记录" />
    <van-tabs v-model="active" @change="tabChange">
      <van-tab title="发布记录"></van-tab>
      <van-tab title="领取记录"></van-tab>
    </van-tabs>
    <div class="boxlist">
      <div class="list" v-for="(item, ind) in list" :key="ind" @click="golink('list',item.id)">
        <div class="listTop">
          <div class="top">
            <div class="leftImg">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="rightConten">
              <div class="redName">{{item.title}}</div>
              <div class="middle">
                <div class="middleImg" v-if="item.member">
                  <img :src="item.member.avatar_image" alt="" />
                </div>
                <span>发放人：{{item.member.nickname}}</span>
              </div>
              <div class="redTime">红包截止时间：{{item.created_at}}——{{item.valid_time_date}}</div>
            </div>
          </div>

          <div class="btn" v-if="active == '1'" @click.stop="golink('record',item.id)">领取记录</div>
        </div>
      </div>
      <van-empty image="default" v-if="list.length <= 0" />
    </div>
  </div>
</template>
<script>
import personRedList_controller from "./personRedList_controller";

export default personRedList_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.boxlist {
  padding: 0 0.78rem;
  padding-top: 0.63rem;
  padding-bottom: 1.5rem;
}

.list {
  // margin: 0.63rem 0.78rem 0.63 0.75rem;
  background-color: #fff;
  border-radius: 0.47rem;
  padding: 0.81rem 1.13rem 0.63rem 0.53rem;
  margin-bottom: 0.63rem;

  .listTop {
    display: flex;
    height: 100%;
    align-items: center;
    flex-direction: column;

    .top {
      display: flex;
      width: 100%;
    }

    .btn {
      width: 11.25rem;
      height: 2.19rem;
      border-radius: 1.09rem;
      border: solid 0.03rem #f69a00;
      font-size: 0.88rem;
      color: #f69a00;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.09rem;
    }

    .leftImg {
      width: 3.75rem;
      height: 3.75rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .rightConten {
      flex: 1;
      margin-left: 0.56rem;
      overflow: hidden;

      .redName {
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 0.2rem;
      }

      .middle {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 0.2rem;
        color: #ce2e06;
        font-size: 0.81rem;

        .middleImg {
          width: 1.13rem;
          height: 1.13rem;
          background-color: #999;
          border-radius: 50%;
          margin-right: 0.22rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .redTime {
        font-size: 0.63rem;
        text-align: left;
        color: #ce2e06;
      }
    }
  }
}
</style>
