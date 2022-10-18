<template>
  <div id="case-mobile">
    <div class="list" v-for="(item, index) in datas" :key="index" @click="gotoDetail(item.id)">
      <div class="img">
        <img :src="item.img_src || emptyImage" alt="" />
      </div>
      <div class="right">
        <div class="one">
          {{ item.case_name }}
        </div>
        <div class="two">
          <span v-for="(item1, index1) in item.label" :key="index1" @click.stop="gotoLabel(item1.id)">
            {{ item1.label_name }}
          </span>
        </div>
        <div class="three">
          <div class="member1" v-if="item.member&&item.member!=null">
            <div class="img1">
              <img :src="item.member.avatar || emptyImage" alt="" />
            </div>
            <div class="nickname">{{item.member.nickname}}</div>
          </div>
          <div class="look">
            <i class="iconfont icon-ht_operation_perview"></i>
            {{ item.read_num }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import case_mobile_controller from './case_mobile_controller';

export default case_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-mobile {
  .list {
    display: flex;
    width: 100%;
    overflow: hidden;
    padding: 0.9375rem;
    border-bottom: 1px solid #f6f6f6;

    .img {
      min-width: 4.375rem;
      width: 4.375rem;
      height: 4.375rem;
      border-radius: 5px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 1rem;
      width: calc(100% - 1rem);
      overflow: hidden;

      .one {
        font-size: 0.875rem;
        text-align: left;
        color: #333;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .two {
        overflow: auto;
        white-space: nowrap;
        text-align: left;

        span {
          display: inline-block;
          border-radius: 2px;
          background: #f7f7f7;
          line-height: 1.0625rem;
          padding: 0 0.5rem;
          color: #666;
          font-size: 0.75rem;
          margin-right: 0.625rem;
        }
      }

      .three {
        display: flex;

        .member1 {
          display: flex;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;

          .img1 {
            width: 1.125rem;
            height: 1.125rem;
            min-width: 1.125rem;
            border-radius: 50%;
            text-align: left;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .nickname {
            font-size: 12px;
            font-weight: 600;
            color: #333;
            margin-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .look {
          // flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
