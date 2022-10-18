<template>
  <div class="Invoice-header">
    <div class="header">
      <div class="total">
        总数：
        <span style="color: #f14e4e;">{{total}}</span>
      </div>
      <div @click="del">
        <span v-if="isDelete">取消</span>
        <span class="del" v-else>
          <i class="iconfont icon-fontclass-shanchu"></i>删除
        </span>
      </div>
    </div>
    <div class="content" v-if="list&&list.length>0">
      <div class="personal Invoice-header-item">
        <div class="title">普通发票抬头-个人</div>
        <ul class="list-box">
          <li class="list-item" v-for="(item, i) in list" :key="i" v-if="item.type==0">
            <van-checkbox  v-model="item.change"  class="checkbox van-checkbox__icon--checked" icon-size="1rem"  v-show="isDelete" @change="personalChange" >
              <template #icon="props">
                <van-icon  name="success" style="background-color:#f15353;border-color:#f15353"  v-if="item.change" />
                <van-icon  name="success" style="background-color:#d4d4d4;border-color:#d4d4d4" v-else />
              </template>
            </van-checkbox>
            <div class="list-text-box">
              <div class="van-ellipsis text" @click="personalChange(item.change, i, 'personal')" >
                <span>{{ item.collect_name }}</span>
                <div class="default" v-if="item.is_default == 1">默认</div>
              </div>
            </div>
            <div>
              <router-link :to="fun.getUrl('invoiceOperation', { type: 'edit' }, { id: item.id })">
                <i class="iconfont icon-fontclass-xiugai"></i>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
      <div class="company Invoice-header-item">
        <div class="title">普通发票抬头-单位</div>
        <ul class="list-box">
          <li class="list-item" v-for="(item, i) in list" :key="i" v-if="item.type==1">
            <van-checkbox  v-model="item.change" class="checkbox van-checkbox__icon--checked"  icon-size="1rem" v-show="isDelete" @change="personalChange" >
              <template #icon="props">
                <van-icon name="success" style="background-color:#f15353;border-color:#f15353" v-if="item.change"/>
                <van-icon name="success" style="background-color:#d4d4d4;border-color:#d4d4d4" v-else />
              </template>
            </van-checkbox>
            <div class="list-text-box">
              <div class="van-ellipsis text"  @click="personalChange(item.change, i, 'company')" >
                <span> {{ item.collect_name }}</span>
                <div class="default" v-if="item.is_default == 1">默认</div>
              </div>
            </div>
            <div>
              <router-link :to="fun.getUrl('invoiceOperation', { type: 'edit' }, { id: item.id })">
                <i class="iconfont icon-fontclass-xiugai"></i>
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="addInvoice" :class="fun.getPhoneEnv() == 3 ? 'pcStyle' : ''">
      <div class="addInvoice-item" v-show="!isDelete">
        <router-link :to="fun.getUrl('invoiceOperation', { type: 'add' }, {})">添加发票抬头</router-link>
      </div>

      <div class="addInvoice-text" v-show="isDelete">
        已选
        <span style="margin: 0 1px;" :style="{ color: total > 0 ? '#f15353' : '' }">{{ delTotal }}</span>个
      </div>
      <div class="addInvoice-del" v-show="isDelete" @click="deleteDate">删除</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  props:["list","total"],
  data() {
    return {
      checked: false,
      isDelete: false,
      delTotal:0,
    }
  },
  methods: {
    deleteDate() {
      let ids = this.list.map(item=>{
        if(item.change) return item.id
      })
      ids = ids.toString();
      $http.get("plugin.invoice.frontend.rise.destory", { ids }).then(({result,msg}) => {
        if(result == 1){
          Toast.success(msg);
          this.delTotal = 0;
          this.isDelete = false;
          this.$emit("getlist")
        }else Toast.fail(msg)
      })
    },
    personalChange(bool, i, name) {
      if (i >= 0) this.$set(this.list[i], "change", !bool);
      else this.delTotal += bool ? 1 : -1;
    },
    del() {
      this.isDelete = !this.isDelete;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./fixed.scss";
.empty {
  text-align: center;
  padding: 1rem 0;
  img {
    width: 8.63rem;
    height: 7.69rem;
  }
}
.Invoice-header {
  .icon-fontclass-xiugai {
    margin: 0 0.2rem;
  }
  .van-cell {
    padding: 0;
  }
  text-align: left;
  padding-bottom: 3.8rem;
  .header {
    width: 100%;
    line-height: 2.76rem;
    height: 2.76rem;
    display: flex;
    padding: 0 1rem;
    font-size: 0.75rem;
    .total {
      flex: 1;
    }
    .del {
      color: #ff4c4c;
    }
  }
  .content {
    .Invoice-header-item {
      width: 22.19rem;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 0.31rem;
      padding: 0 0.78rem;
      .title {
        font-size: 0.88rem;
        color: #0c0d0e;
        line-height: 3rem;
        border-bottom: 0.03rem #efefef solid;
      }
      .list-item {
        display: flex;
        align-items: center;
        height: 2.7rem;
        .checkbox {
          margin-right: 0.3rem;
        }
        .list-text-box {
          flex: 1;
          display: flex;
          align-items: center;
          overflow-x: hidden;
          .text{
            flex: 1;
          }
          .default {
            width: 2.19rem;
            height: 1.06rem;
            display: inline-block;
            background-color: #ffecec;
            border-radius: 0.53rem;
            text-align: center;
            font-size: 0.63rem;
            color: #f15353;
            margin-left: 0.2rem;
          }
        }
      }
    }
    .personal {
      margin-bottom: 1rem;
    }
  }
  .van-contact-list__bottom {
    display: none;
  }
}
</style>