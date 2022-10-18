<template>
  <div id="detailed">
    <c-title
      :hide="false"
      :text="balanceLang + '明细'"
      
      totext=""
    ></c-title>
    <van-tabs v-model="selected" @click="swichTabTItem">
      <van-tab name="0" title="全部" ></van-tab>
      <van-tab name="1" title="收入" ></van-tab>
      <van-tab name="2" title="支出"></van-tab>
    </van-tabs>

    <!-- tab-container -->
    <div>
    <!-- <mt-tab-container v-model="selected"> -->
      <div v-show="selected==0">
      <!-- <mt-tab-container-item id="0"> -->
        <div v-if="recordsList && recordsList.length > 0">
          <router-link
            v-for="(item,i) in recordsList" :key='i'
            :to="fun.getUrl('details', { item: item })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ item.service_type_name }}</li>
                <li>{{ balanceLang }}：{{ item.new_money }}</li>
                <li class="item1">{{ item.created_at }}</li>
              </ul>
              <div class="item3" v-if="item.type == 1">
                <span class="add">+ {{ item.change_money }}</span>
              </div>
              <div class="item3" v-if="item.type == 2">
                <span class="reduce">{{ item.change_money }}</span>
              </div>
            </div>
          </router-link>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==1">
      <!-- <mt-tab-container-item id="1"> -->
        <!--<div class="times">2017年3月</div>-->
        <div v-if="recordsList && recordsList.length > 0">
          <router-link
            v-for="(item,i) in recordsList" :key='i'
            :to="fun.getUrl('details', { item: item })"
          >
            <div class="tbs">
              <ul class="item2">
                <li>{{ item.service_type_name }}</li>
                <li>{{ balanceLang }}：{{ item.new_money }}</li>
                <li class="item1">{{ item.created_at }}</li>
              </ul>
              <div class="item3">
                <span class="add">+{{ item.change_money }}</span>
              </div>
            </div>
          </router-link>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==2">
      <!-- <mt-tab-container-item id="2"> -->
        <div v-if="recordsList && recordsList.length > 0">
          <router-link
            v-for="(item,i) in recordsList" :key='i'
            :to="fun.getUrl('details', { item: item })"
          >
            <div class="tbs">
              <div class="item2">
                <li>{{ item.service_type_name }}</li>
                <li>{{ balanceLang }}：{{ item.new_money }}</li>
                <li class="item1">{{ item.created_at }}</li>
              </div>
              <div class="item3">
                <span class="reduce">{{ item.change_money }}</span>
              </div>
            </div>
          </router-link>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
    <!-- </mt-tab-container> -->
    </div>
  </div>
</template>
<script>
import member_balance_detailedcontroller from "./member_balance_detailedcontroller";
export default member_balance_detailedcontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#detailed {
  a {
    color: #000;
  }

  .mint-navbar {
    margin-bottom: 0.125rem;
  }

  .mint-navbar .mint-tab-item {
    padding: 0.875rem 0;
  }

  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #ddd;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    padding: 0.625rem 0.875rem;
    border-bottom: 0.0625rem solid #ebebeb;
    font-size: 14px;

    .item1 {
      color: #8c8c8c;
      font-size: 12px;
    }

    .item2 {
      flex: 2;
      text-align: left;

      li {
        line-height: 1.5rem;
      }
    }

    .item3 {
      .add {
        font-size: 18px;
        color: #259b24;
      }

      .reduce {
        font-size: 18px;
        color: #f15353;
      }
    }
  }
}
</style>
