<template>
  <div id="allowanceTeam">
    <c-title class="circle_title" :hide="false" text="团队人员"></c-title>
    <van-tabs v-model="active" title-active-color="#ee2e2b">
      <van-tab :title="`${item.name}(${item.nums})`" v-for="(item, index) in info" :key="index">
        <div class="listbox">
          <div class="lis" v-for="(itemk, ind) in item.list" :key="ind">
            <div class="lisLeft">
              <div class="img">
                <img :src="itemk.avatar" alt="" />
              </div>
              <div class="name">{{ itemk.nickname }}</div>
            </div>
            <div class="lisRight">
              <div class="txt1">
                团队人数：
                <div class="total">{{ itemk.childs_num }}</div>
                人
              </div>
              <div class="txt1">
                团队业绩金额：
                <div class="price">{{ $i18n.t('money') }}{{ itemk.team_total }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      active: 0,
      info: []
    };
  },
  activated() {
    this.getData();
  },
  methods: {
    getData() {
      $http.post("plugin.agency-subsidy.frontend.controllers.team.index", {}, "加载中...").then(res => {
        if (res.result == 1) {
          this.info = res.data;
        } else {
          Toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.listbox {
  background: #fff;
  padding: 0 0.91rem;
  .lis:last-child {
    border-bottom: none;
  }
  .lis {
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
    padding: 0.91rem 0;
    .lisLeft {
      display: flex;
      align-content: center;
      .img {
        width: 1.88rem;
        height: 1.88rem;
        background-color: #f05152;
        border-radius: 100%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }
      .name {
        font-size: 0.75rem;
        color: #202020;
        margin-left: 0.34rem;
        display: flex;
        align-items: center;
      }
    }
    .lisRight {
      flex: 1;
      display: flex;
      /* align-items: center; */
      flex-direction: column;
      align-items: flex-end;
      .txt1 {
        display: flex;
        align-items: center;
        font-size: 0.69rem;
        .total,
        .price {
          color: #f15353;
        }
      }
    }
  }
}
</style>