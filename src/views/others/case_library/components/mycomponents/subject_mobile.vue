<template>
  <div id="case-mobile">
    <div class="list" v-for="(item, index) in datas" :key="index" @click="gotoDetail(item.id)">
      <div class="img">
        <img :src="item.special_banner_src || emptyImage" alt="" />
      </div>
      <div class="right">
        <div class="one">
          {{item.special_name}}
        </div>
        <div class="two">
          <div class="img-list">
            <div class="img1" v-for="(item1, index1) in item.case_data" :key="index1">
              <img :src="item1.img_src || emptyImage" alt="" />
            </div>
          </div>

          <div class="total">共{{item.case_data.length}}个</div>
        </div>
        <div class="three">
          <div class="time">{{item.created_at}}</div>
          <div class="look">
            <i class="iconfont icon-ht_operation_perview"></i>
            {{item.read_num}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subject_mobile_controller from './subject_mobile_controller';

export default subject_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#case-mobile {
  .list {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    padding: 0.9375rem;
    border-bottom: 1px solid #f6f6f6;

    .img {
      min-width: 5rem;
      width: 5rem;
      height: 2.65rem;

      img {
        width: 100%;
        height: 100%;
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
        // width: 16rem;
        font-size: 0.875rem;
        text-align: left;
        color: #333;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .two {
        // width: 16rem;
        display: flex;

        .img-list {
          overflow: auto;
          white-space: nowrap;
          text-align: left;

          .img1 {
            display: inline-block;
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 50%;
            text-align: left;
            margin-right: 0.25rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .total {
          width: 3.5rem;
          font-size: 0.75rem;
        }
      }

      .three {
        display: flex;
        text-align: left;

        .time {
          flex: 1;
          color: #999;
          font-size: 0.625rem;
        }

        .look {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}

.pcStyle #case-mobile .list {
  width: 375px;
  // margin: 0 auto;
}
</style>
