<template>

  <div>
    <c-title :hide="false" text='收货地址管理'></c-title>
    <!--<c-addressList :datasource="list"></c-addressList>-->
    <ul v-for="(item,itemIndex) in datasource" :key='itemIndex' @click.stop="selectedAddress(itemIndex)">
      <van-row :gutter="5">
        <!--<el-row :gutter="5">-->
        <!--<el-col :span="1" style="display: list-item"></el-col>-->
        <van-col :span="1" style="display: list-item;"></van-col>
        <!--<el-col :span="22">-->
        <van-col :span="22">
          <font style="font-size: 16px;">{{item.username}}111<span class="moblie">{{item.mobile}}</span></font>
          <br/>
          <font style="font-size: 14px; color: rgba(118, 127, 138, 1);">{{item.province}} {{item.city}}
            {{item.district}} {{item.address}}</font>
        </van-col>
        <!--</el-col>-->

        <!--<el-col :span="18" :offset="1">-->
        <van-col :span="18" :offset="1">
          <div @click.stop="selectBolfun">
            <van-checkbox v-model="checkList[itemIndex]" checked-color="#f15353" shape="square"
                          @change="setDefaultAddress(itemIndex)"></van-checkbox>
            <!--<el-checkbox v-model="checkList[itemIndex]"  @change="setDefaultAddress(itemIndex)"></el-checkbox>--><span>设置为默认地址</span>
          </div>
        </van-col>
        <!--</el-col>-->
        <van-col :span="5">
          <!--<el-col :span="5">-->
          <i class="fa fa-trash-o" @click.stop="deleteHandler(item,itemIndex)"></i><i class="fa fa-pencil-square-o"
                                                                                      @click.stop="alterHandler(itemIndex)"></i>
          <!--</el-col>-->
        </van-col>
        <!--</el-row>     -->
      </van-row>
    </ul>
    <div style="height: 3.125rem;"></div>
    <div class="address_addnav" @click="addendAddress"><i class="fa fa-plus-circle"></i><span>新增收货地址</span></div>
  </div>

</template>
<script>
import address_controller from "./addresslist_controller";

export default address_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  ul {
    .el-col {
      text-align: justify;

      .el-checkbox {
        margin-right: 0.625rem;
      }

      span {
        font-size: 12px;
        color: #888;
      }

      span.moblie {
        float: right;
        font-size: 16px;
        color: #333;
      }

      i {
        color: #888;
        font-size: 1rem;
      }
    }

    .el-col.el-col-22 {
      padding-bottom: 0.625rem;
      border-bottom: 0.0625rem dotted #ddd;

      font {
        line-height: 1.5rem;
        padding-left: 0.9375rem;
        padding-right: 0.9375rem;
      }
    }
  }

  .address_addnav {
    width: 100%;
    padding: 0 3% 0 6% !important;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #f15353 !important;
    color: #fff !important;
    text-align: center;
    height: 2.75rem !important;
    line-height: 2.75rem !important;
    z-index: 7;
  }

  .address_addnav i {
    color: #fff;
    font-size: 22px;
    position: absolute;
    left: 50%;
    top: 50%;
    height: 1.125rem;
    line-height: 1.125rem;
    margin-left: -4.625rem;
    margin-top: -0.5625rem;
  }

  .fa-trash-o {
    margin-right: 1.25rem;
    font-size: 20px;
  }

  .fa-pencil-square-o {
    font-size: 20px;
  }

  .el-row {
    background: #fff;
    padding: 0.625rem 0 0;
    margin-bottom: 0.625rem;

    .el-col {
      vertical-align: middle;
    }

    .el-col-16 {
      text-align: left;
      padding-left: 0.3125rem;
    }

    .el-checkbox,
    i {
      line-height: 2.25rem;
    }
  }

  .address_addnav i {
    color: #fff;
    font-size: 22px;
    position: absolute;
    top: 50%;
    height: 1.125rem;
    line-height: 1.125rem;
    margin-left: -4.625rem;
    margin-top: -0.5625rem;
  }
</style>