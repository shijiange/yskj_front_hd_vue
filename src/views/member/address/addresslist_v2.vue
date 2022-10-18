<template>
  <div id="addresslist">
    <c-title :hide="false"
             text="收货地址管理"></c-title>
    <!--<c-addressList :datasource="list"></c-addressList>-->
    <div class="box">
      <div class="content01"
           v-for="(item, itemIndex) in datasource"
           :key='itemIndex'
           @click.stop="selectedAddress(itemIndex)">
        <ul class="xinxi">
          <li class="name">{{ item.username }}</li>
          <li class="phone">{{ item.mobile }}</li>
          <div class="clearfix"></div>
        </ul>
        <div class="where"
             style="text-align: left; margin-left: 0;">
          {{ item.province }} {{ item.city }} {{ item.district }}
          {{ item.street }} {{ item.address }}
        </div>
        <div class="xuxian"></div>
        <div class="choice">
          <div class="add01"
               @click.stop="selectBolfun">
            <!-- <img src="../../../assets/work/moren.png"> -->
            <van-checkbox checked-color="#f15353"
                          shape="square"
                          v-model="checkList[itemIndex]"
                          @change="setDefaultAddress(itemIndex)">
              <div class="moren">默认地址</div>
            </van-checkbox>
          </div>
          <div class="shanchu"
               @click.stop="deleteHandler(item, itemIndex)">
            <img src="../../../assets/work/shanchu.png"/>
            <div class="del">删除</div>
          </div>
          <div class="bianji"
               @click.stop="alterHandler(itemIndex)">
            <img src="../../../assets/work/bianji.png"/>
            <div class="edit">编辑</div>
          </div>
          <div class="clearfix"></div>
          <div class="bottom-line"></div>
        </div>
      </div>

      <div style="height: 2.8125rem;"></div>

      <div class="content03"
           @click="addendAddress"
           :style="{width:(this.fun.getPhoneEnv() == 3?'375px':'100%')}">
        <div class="new-add">
          <img src="../../../assets/work/add.png"/>
          <div class="dizhi">新增收货地址</div>
          <div style="clear: both;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import address_controller from "./addresslist_controller";

export default address_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #addresslist {
    .box {
      background-color: #f5f5f5;
      margin-bottom: 4rem;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .content01 {
      background-color: #fff;
      padding-left: 0.875rem;
      padding-bottom: 0.625rem;
      padding-top: 0.875rem;
      padding-right: 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;
      border-top: solid 0.0625rem #ebebeb;
      margin-bottom: 0.625rem;
    }

    .content02 {
      background-color: #fff;
      margin-top: 0.75rem;
      padding-top: 0.875rem;
      padding-left: 0.875rem;
      padding-bottom: 0.625rem;
    }

    .xinxi {
      font-size: 16px;
      color: #333;
    }

    .name {
      float: left;
    }

    .phone {
      float: right;
    }

    .clearfix {
      clear: both;
    }

    .where {
      margin-right: 0.625rem;
      font-size: 14px;
      color: #666;
      margin-top: 0.625rem;
      margin-left: 1.875rem;
    }

    .xuxian {
      height: 0.0625rem;
      background-color: #ebebeb;
      margin-top: 0.625rem;
    }

    .choice {
      margin-top: 0.625rem;
      width: 100%;
    }

    .add01 {
      float: right;
    }

    .add01 img {
      float: left;
    }

    .moren {
      float: left;
      font-size: 12px;
      color: #f15353;
      margin-right: 0.625rem;
      z-index: 96;
    }

    .moren02 {
      float: left;
      font-size: 12px;
      color: #797979;
      margin-left: 0.5rem;
    }

    .shanchu {
      float: left;
    }

    .shanchu img {
      float: left;
    }

    .shanchu .del {
      float: left;
      font-size: 12px;
      color: #797979;
      margin-left: 0.5rem;
    }

    .bianji {
      float: left;
      margin-left: 1.25rem;
    }

    .bianji img {
      float: left;
    }

    .bianji .edit {
      float: left;
      font-size: 12px;
      color: #797979;
      margin-left: 0.5rem;
    }

    .content03 {
      width: 100%;
      height: 2.8125rem;
      background-color: #f15353;
      position: fixed;
      display: flex;
      justify-content: center;
      bottom: 0;
      z-index: 99;
    }

    .new-add {
      margin: 0 auto;
      margin-top: 0.875rem;
    }

    .new-add img {
      float: left;
      top: 0.8125rem;
    }

    .new-add .dizhi {
      float: left;
      font-size: 14px;
      color: white;
      line-height: 1.125rem;
      margin-left: 0.625rem;
    }
  }
</style>
