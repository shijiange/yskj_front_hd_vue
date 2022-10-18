<template>
  <div id="detailed">
    <c-title :hide="false"
             :text="integral?integral+'列表':'积分'+'明细'"></c-title>
    <van-tabs v-model="selected" @click="swichTabTItem">
      <van-tab name="" title="全部"></van-tab>
      <van-tab name="1" title="收入"></van-tab>
      <van-tab name="-1" title="支出"></van-tab>
    </van-tabs>
    <!-- tab-container -->
    <div>
    <!-- <mt-tab-container v-model="selected"> -->
      <div v-show="selected==''">
      <!-- <mt-tab-container-item id=""> -->
        <!--<div class="times">2017年3月</div>-->

        <!--Object after_point : "2645.00" before_point : "2644.00" created_at : "2017-04-12 15:12:29" deleted_at : 0 id : 15 member_id : 1 order_id : 0 point : "1.00" point_income_type : 1 point_mode : "后台充值" remark : "后台充值[1]积分" uniacid : 2 updated_at : "2017-04-12 15:12:29-->
        <div class="tbs"
             v-for="(item,i) in recordsList"
             :key='i'
             @click="expand(item)">
          <div class="wrap">
            <ul class="item2">
              <li>{{item.source_name}}</li>
              <li>{{integral?integral:'积分'}}：{{item.after_point}}</li>
              <li class="item1">{{item.updated_at}}</li>
            </ul>
            <div class="item3"
                 v-if="item.point<0"><span class="add">{{item.point}}</span></div>
            <div class="item3"
                 v-if="item.point>0"><span class="reduce">+{{item.point}}</span></div>
          </div>
          <div v-if="item.checked&&item.transfer_info"
               class="hide-item">
          <div>{{item.transfer_info.type}}ID:{{item.transfer_info.id}}</div>
          <div style="margin-top: 0.5rem;">昵称:{{item.transfer_info.name}}</div>
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==1">
      <!-- <mt-tab-container-item id="1"> -->
        <div class="tbs"
             v-for="(item,i) in recordsList"
             :key='i'  @click="expand(item)">
          <div class="wrap">
                 <ul class="item2">
            <li>{{item.source_name}}</li>
            <li>{{integral?integral:'积分'}}：{{item.after_point}}</li>
            <li class="item1">{{item.updated_at}}</li>
            </ul>
            <div class="item3"
                v-if="item.point<0"><span class="add">{{item.point}}</span></div>
            <div class="item3"
                v-if="item.point>0"><span class="reduce">+{{item.point}}</span></div>
          </div>
            <div v-if="item.checked&&item.transfer_info"
               class="hide-item">
          <div>{{item.transfer_info.type}}ID:{{item.transfer_info.id}}</div>
          <div style="margin-top: 0.5rem;">昵称:{{item.transfer_info.name}}</div>
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
      <div v-show="selected==-1">
      <!-- <mt-tab-container-item id="-1"> -->
        <div class="tbs"
             v-for="(item,i) in recordsList"
             :key='i'  @click="expand(item)">
            <div class="wrap">
                <ul class="item2">
                  <li>{{item.source_name}}</li>
                  <li>{{integral?integral:'积分'}}：{{item.after_point}}</li>
                  <li class="item1">{{item.updated_at}}</li>
                </ul>
                <div class="item3"
                    v-if="item.point<0"><span class="add">{{item.point}}</span></div>
                <div class="item3"
                    v-if="item.point>0"><span class="reduce">+{{item.point}}</span></div>
            </div>
              <div v-if="item.checked&&item.transfer_info"
               class="hide-item">
           <div>{{item.transfer_info.type}}ID:{{item.transfer_info.id}}</div>
          <div style="margin-top: 0.5rem;">昵称:{{item.transfer_info.name}}</div>
          </div>
        </div>
      <!-- </mt-tab-container-item> -->
      </div>
    <!-- </mt-tab-container> -->
    </div>
  </div>
</template>
<script>
import member_integraldetailcontroller from './member_integrallistcontroller';
export default member_integraldetailcontroller;
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
    font-size: 14px;

    .wrap {
      padding: 0.625rem 0.875rem;
      border-bottom: 1px solid #ebebeb;
    }

    .wrap::after {
      clear: both;
      display: block;
      content: '';
    }

    .hide-item {
      padding: 0.625rem 0.875rem;
      border-bottom: 1px solid #ebebeb;
      text-align: left;
    }

    .item1 {
      color: #8c8c8c;
      font-size: 12px;
    }

    .item2 {
      float: left;
      width: 70%;
      text-align: left;

      li {
        line-height: 1.5rem;
      }
    }

    .item3 {
      font-size: 18px;
      float: left;
      width: 30%;
      text-align: right;

      .add {
        color: #259b24;
      }

      .reduce {
        color: #f15353;
      }
    }
  }
}
</style>