<template>

  <div class="page">
    <c-title :hide="false" text="我的卡"></c-title>
    <div class="header">
      <div class="headerItem headerItem1">
        <div class="num">{{total_count}}</div>
        <div class="desc">总数</div>
      </div>
      <div class="headerItem headerItem2">
        <div class="num">{{notused_count}}</div>
        <div class="desc">未使用</div>
      </div>
      <div class="headerItem headerItem3">
        <div class="num">{{isused_count}}</div>
        <div class="desc">已使用</div>
      </div>
    </div>
    <van-tabs v-model="active" @change="changeActive">
      <van-tab title="全部"></van-tab>
      <van-tab title="未使用"></van-tab>
      <van-tab title="已使用"></van-tab>
    </van-tabs>

    <div class="listData">
      <van-collapse v-model="activeNames" accordion>
        <template v-for="item in listData">
          <van-collapse-item :title="'提货卡ID：'+item.id" :name="item.id" label-class="vanCollapseItem"
                             v-if="item.status==1" :key="item.id">
            <template #value>
              <span style="color: #f15353;">已使用</span>
            </template>

            <template #default>
              <div class="wrapper" v-if="item.uses_record">
                <div class="t1">
                  <div class="name" v-if="item.uses_record.member">
                    [ID:{{item.uses_record.member.uid}}]{{item.uses_record.member.nickname}}
                  </div>
                  <div class="time">{{item.uses_record.created_at}}</div>
                </div>
                <div class="t2" v-if="item.uses_record.member">
                  {{item.uses_record.member.mobile}}
                </div>
              </div>
            </template>
          </van-collapse-item>


          <van-collapse-item disabled :key="item.id" v-if="item.status==0">
            <template #title>
              <span style="color: #323233;">提货卡ID：{{item.id}}</span>
            </template>
            <template #value>
              <span style="color: #f15353;">未使用</span>
            </template>
            <template #right-icon>
              <span style="color: #f15353; padding-right: 1.3rem;"></span>
            </template>
          </van-collapse-item>
        </template>
      </van-collapse>
    </div>


  </div>


</template>

<script>
import pickUpCardMyDetController from "./pick_up_card_my_det_controller";

export default pickUpCardMyDetController;
</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    background: #fff;
  }

  .header {
    padding-top: 0.938rem;
    display: flex;
    justify-content: space-around;
    background-color: #f6f8fc;

    .headerItem {
      width: 6.25rem;
      height: 3.313rem;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      padding: 0.5rem 0;
      align-items: center;
      border-radius: 0.625rem 0.625rem 0 0;
      color: #fff;

      .num {
        font-size: 1.125rem;
      }

      .desc {
        font-size: 0.813rem;
      }
    }

    .headerItem1 {
      background-color: #ff8988;
    }

    .headerItem2 {
      background-color: #ffbc74;
    }

    .headerItem3 {
      background-color: #3fddbc;
    }
  }

  .listData {
    text-align: left;
  }

  .wrapper {
    .t1 {
      display: flex;
      justify-content: space-between;

      .name {
        width: 12rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

</style>