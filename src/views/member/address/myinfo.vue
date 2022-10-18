<template>
  <div id="alterAddress">
    <c-title :hide="false" text="我的信息" :goback='true'></c-title>
    <div style="margin-top: 0.625rem;"></div>
    <ul class="info_box">
      <li class="info_list">
        <van-field v-model="form.member_name" label="真实姓名" placeholder="请输入真实姓名" />
      </li>
      <li class="info_list">
        <van-field v-model="form.member_card" label="身份证号码" placeholder="请输入身份证号码" />
      </li>
    </ul>
    <div class="address_addnav1" @click="saveInfo"><span>确认保存</span></div>
    <div class="agreement">
      <h1>{{ explain_title }}</h1>
      <p>{{ explain_content }}</p>
    </div>
    
  </div>
</template>
<script>
import myinfo_controller from "./myinfo_controller";
export default myinfo_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#alterAddress {
  .info_box {
    background: #fff;
    padding-left: 0.875rem;

    .info_list {
      border-bottom: solid 0.0625rem #ebebeb;
      line-height: 2.875rem;
      display: flex;
      align-items: center;
      font-size: 16px;
      text-align: left;

      span {
        display: block;
        width: 6.875rem;
      }
    }

    li:last-child {
      border: none;
    }
  }
}

.address_addnav1 {
  width: 90%;
  margin: 1.25rem auto;
  background: #f15353 !important;
  color: #fff !important;
  text-align: center;
  height: 2.8125rem !important;
  line-height: 2.8125rem !important;
  border-radius: 0.375rem;
  font-size: 16px;
}

.agreement {
  color: #666;
  text-align: left;
  padding: 0 1.25rem;

  h1 {
    font-size: 15px;
    line-height: 1.875rem;
  }

  p {
    font-size: 13px;
  }
}

.address_addnav {
  width: 100%;
  padding: 0 3% 0 6% !important;
  position: fixed;
  bottom: 0;
  left: 0;
  color: #000 !important;
  text-align: center;
  height: 2.75rem !important;
  line-height: 2.75rem !important;
}

.red {
  color: red !important;
}

.popup-con {
  width: 100%;
}

#alterAddress .mint-field .mint-cell-title {
  text-align: left;
}

.address_addnav i {
  color: #fff;
  font-size: 22px;
  position: absolute;
  top: 50%;
  height: 1.125rem;
  line-height: 1.125rem;
  margin-left: -2.125rem;
  margin-top: -0.5625rem;
}

.maleall {
  background: #fff;
  text-align: left;
}

#alterAddress .males {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #d9d9d9;
  margin-left: 0.625rem;
}

.mydefault {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #d9d9d9;
  margin-left: 0.625rem;
  align-items: center;
}

.maleall span {
  font-size: 16px;
  vertical-align: middle;
  width: 6.5625rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
}

.address {
  flex: 1;
  line-height: 3.125rem;

  .mint-button--default {
    line-height: 3.125rem;
    text-align: left;
    font-size: 16px;
  }
}

#alterAddress .van-cell {
  padding: 10px 8px;
  font-size: 16px;

  /deep/.van-field__label {
    margin-right: 0;
  }
}
</style>
