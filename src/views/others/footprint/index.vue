<template>
  <div id="member_footprint">
    <c-title :hide="false" :text="'下级足迹'"></c-title>

    <div class="ul">
      <div v-for="(item, index) in projectList" :key="index">
        <div class="list" v-if="!fun.isTextEmpty(item.has_one_member)">
          <div class="img">
            <img :src="item.has_one_member.avatar_image" alt="" />
          </div>
          <div class="info">
            <div class="nickname">{{ item.has_one_member.username }}</div>
            <div class="mobile" v-if="item.has_one_member.mobile">手机号：{{ item.has_one_member.mobile }}</div>
          </div>
          <div class="btn">
            <span @click="gotoDetail(item.has_one_member.uid)">浏览足迹</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allLoad && projectList.length > 0">没有更多了~</div>

    <div class="blank" v-if="projectList.length <= 0">
      <img src="../../../assets/images/blank.png" />
      <span>暂无数据</span>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#member_footprint {
  min-height: 100vh;

  .ul {
    background: #fff;

    .list {
      padding: 1rem;
      display: flex;
      text-align: left;
      border-top: 1px solid #efefef;

      .img {
        width: 2.1875rem;
        height: 2.1875rem;
        margin-right: 1rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .info {
        flex: 1;
        width: 11.75rem;

        .nickname {
          color: #202020;
          font-size: 0.9375rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile {
          color: #666;
          font-size: 0.75rem;
        }
      }

      .btn {
        width: 6.5rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        span {
          background: #f15353;
          color: #fff;
          padding: 0.5rem;
          border-radius: 1.5rem;
        }
      }
    }
  }
}
</style>
