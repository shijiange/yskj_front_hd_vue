<template>
  <div id="store_verification">
         <c-title text='项目列表'></c-title>
    <div class="nearby_project" >
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getNearyData" :immediate-check="false">
        <van-cell v-for="(item, key) in nearyData" :key="key" class="project_list">
          <div class="top" @click="btnDetail(item.id)">
            <img :src="item.thumb" alt="" />
            <div class="project">
              <span class="project_name">{{ item.title }}</span>
              <div class="detail">
                <div class="top">
                  <span class="num">{{ item.total_sell_count }}</span>
                  <span class="num_name">次</span>
                </div>
                <span class="bottom">累计销售</span>
              </div>
            </div>
            <div class="classification">
              <div class="left">{{ item.category_name }}</div>
              <div class="right">
                <span class="other store_num"><i class="iconfont  icon-fontclass-tuanduifenxiaoshang"></i>{{ item.store_count }}家</span>
                <span class="other distance"><i class="iconfont icon-order_locate"></i>{{ item.store_distance }}{{ item.store_distance_unit }}</span>
                <span class="other day"><i class="iconfont icon-fontclass-qixian"></i>{{ item.period }}</span>
              </div>
            </div>
            <span class="project_brief">
              {{ item.description }}
            </span>
          </div>
        </van-cell>
      </van-list>
    </div>
   <serviceCard></serviceCard>
  </div>
</template>

<script>
import category_project_list_controller from "./category_project_list_controller";

export default category_project_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.nearby_project {
  .project_list {
    margin-bottom: 0.8rem;
    padding-top: 0.91rem;
  }

  .top {
    img {
      width: 100%;
      height: 10.71rem;
      border-radius: 0.54rem;
    }

    .project {
      display: flex;
      text-align: left;
      justify-content: space-between;
      margin-top: 0.3rem;

      .project_name {
        flex: 5;
        font-size: 16px;
        font-weight: bold;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin-right: 1rem;
      }

      .detail {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          display: flex;
          align-items: center;
          padding: 0;
          justify-content: flex-end;

          .num {
            color: #ce811d;
            font-size: 16px;
          }
        }

        .bottom {
          color: #9f9f9f;
          display: flex;
          justify-content: flex-end;
        }
      }
    }

    .classification {
      display: flex;
      justify-content: space-between;
      margin: 0.8rem 0;

      .left {
        color: #f14e4e;
      }

      .right {
        .other {
          margin-left: 1rem;
          color: #ce811d;
        }
      }
    }

    .project_brief {
      display: flex;
      text-align: left;
    }
  }
}

.suspension {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 10%;
  transform: translateX(10rem);
  right: 50%;

  img {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1.21rem;
  }
}

.search_box {
  width: 100%;
  // padding: 0.7rem 0;
  padding: 0.5rem 0;
  background: #fff;

  .search {
    width: 100%;
    height: 1.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem;
    background: #fff;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;

      .icon-order_locate {
        position: relative;
        color: #303030;
      }

      .address_name {
        display: block;
        margin: 0 0.25rem;
        max-width: 6.28rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }

      .address_name {
        max-width: 6.28rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.71rem;
        color: #666;
      }
    }

    .right {
      width: 15.61rem;
      height: 2.14rem;
      // background: rgb(255, 255, 255);
      background: #f5f5f5;
      display: flex;
      line-height: 1.875rem;
      border-radius: 0.94rem;
      padding: 0 0.625rem;
      font-size: 14px;
      justify-content: center;
      align-items: center;

      .icon-sousuo {
        color: #999;
        margin-right: 0.3rem;
        font-size: 20px;
      }

      .search_input {
        border: none;
        width: 100%;
      }
    }
  }
}
</style>
