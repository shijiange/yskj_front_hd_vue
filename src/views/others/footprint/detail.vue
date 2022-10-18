<template>
  <div id="footprint-member-detail">
    <c-title :hide="false" :text="'下级足迹'"></c-title>
    <van-tabs v-model="active" @change="onClick">
      <van-tab title="商品"></van-tab>
      <van-tab title="文章"></van-tab>
    </van-tabs>
    <div class="ul">
      <div v-for="(item, index) in projectList" :key="index">
        <div class="list" v-if="!fun.isTextEmpty(item.content_info)" @click="gotoDetail(item)">
          <div class="img">
            <img :src="item.content_info.thumb" alt="" />
          </div>
          <div class="right">
            <div class="title">{{ item.content_info.title }}</div>
            <div class="btm">
              <div class="price" v-if="active==0">
                <sapn class="p1">{{ $i18n.t("money") }}</sapn
                >{{ item.content_info.price }}
              </div>
              <div class="time">浏览日期:{{ item.created_at }}</div>
            </div>
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
import detail_controller from "./detail_controller";

export default detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#footprint-member-detail {
  .ul {
    text-align: left;
    background: #fff;

    .list {
      padding: 0.625rem 0.9375rem;
      display: flex;
      border-bottom: #f5f5f5 0.625rem solid;

      .img {
        min-width: 5rem;
        width: 5rem;
        height: 5rem;
        border-radius: 0.3125rem;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.3125rem;
        }
      }

      .right {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;

        .title {
          color: #333;
          font-size: 0.9375rem;
          line-height: 1.5rem;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .btm {
          display: flex;
          align-items: center;
          width: 100%;
          overflow: hidden;

          .price {
            color: #f14e4e;
            font-size: 1.125rem;

            .p1 {
              font-size: 0.75rem;
            }
          }

          .time {
            flex: auto;
            font-size: 0.75rem;
            color: #999;
            text-align: right;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
