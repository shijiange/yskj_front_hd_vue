<template>
  <div id="address-manage"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">
    <c-title :hide="false"
             :text="'提出地址管理'"></c-title>
    <div class="manage-box">
      <div class="box">

        <ul>
          <van-radio-group v-model="radio">
            <li class="box-item"
                v-for="(item,index) in address"
                :key='index'>
              <div class="where">
                {{item.address}}
              </div>
              <div class="choose">
                <div class="left">
                  <div class="delete"
                       @click="del(item,index)">
                    <i class=" iconfont icon-delete"></i>
                    <span class="del-text">删除</span>
                  </div>
                  <div class="edit"
                       @click="toPage(item)">
                    <i class=" iconfont icon-edit"></i>
                    <span class="edit-text">编辑</span>
                  </div>
                </div>
                <div class="right">
                  <van-radio :name="item.id"
                             checked-color="#f15353"
                             class="moren"
                             @click="change(item.id)">默认地址</van-radio>
                </div>
              </div>
            </li>
          </van-radio-group>
        </ul>
      </div>
      <router-link :to="fun.getUrl('addressAdd')"
                   class="add-address"
                   tag="div">
        <div class="new-add">
          <img src="../../../assets/work/add.png" />
          <div class="dizhi">新增提出地址</div>
          <div style="clear: both;"></div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import address_manage_controller from "./address_manage_controller";
export default address_manage_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#address-manage {
  padding-bottom: 2.8125rem;

  .manage-box {
    background-color: #f5f5f5;

    .box {
      .box-item {
        background-color: #fff;
        padding-top: 0.875rem;
        padding-bottom: 0.625rem;
        padding-left: 0.875rem;
        padding-right: 0.875rem;
        margin-bottom: 0.625rem;
        border-top: solid 1px #ebebeb;
        border-bottom: solid 1px #ebebeb;

        .where {
          text-align: left;
          padding-bottom: 0.625rem;
          border-bottom: solid 1px #ebebeb;
          word-wrap: break-word;
        }

        .choose {
          margin-top: 0.625rem;
          display: flex;
          justify-content: space-between;

          .left {
            display: flex;

            .delete {
              display: flex;
              align-items: center;

              .del-text {
                margin-left: 0.5rem;
                color: #797979;
              }
            }

            .edit {
              display: flex;
              align-items: center;
              margin-left: 1.25rem;

              .edit-text {
                margin-left: 0.5rem;
                color: #797979;
              }
            }
          }

          .right {
            color: #f15353 !important;
          }
        }
      }
    }

    .add-address {
      width: 100%;
      height: 45px;
      height: 2.8125rem;
      background-color: #f15353;
      position: fixed;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-pack: center;
      justify-content: center;
      bottom: 0;
      z-index: 99;

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
  }
}

#address-manage.pcStyle {
  .add-address {
    width: 375px;
  }
}
</style>
