<template>
  <div id="info">
    <c-title :hide="false" text="我的信息"></c-title>
    <div style="height: 15px;"></div>
    <div class="user" v-if="fun.getWebEnv() != '5'">
      <div class="left">
        <div class="user-avatar">
          <img :src="avatar_image || emptyImage" />
        </div>
        <div style="margin-left: 1rem; margin-top: 0.5rem;">{{ nickname }}</div>
      </div>
      <div class="update-btn" @click="updateInfo">更新资料</div>
    </div>

    <van-cell-group title="基本信息" class="customMessage">
      <template v-if="change_info">
        <div class="member_photo">
          <div>会员头像</div>
          <van-uploader v-model="fileList" :max-count="1"   :after-read="afterRead"/>
        </div>
        <van-cell :border="false">
          <van-field v-model="info_form.nickname" label="会员昵称：" maxlength="10" clearable  />
        </van-cell>
      </template>
      <van-cell :border="false" v-if="formName" id="nameIs">
        <van-field v-model="info_form.realname" label="姓名：" maxlength="10" clearable placeholder="请输入您的姓名" :required="name_must" />
      </van-cell>
      <van-cell is-link @click.native="bindTel" class="customflex" :border="false">
        <van-field
          slot="title"
          v-model="info_form.mobile"
          label="手机号："
          type="tel"
          readonly
          maxlength="11"
          clearable
          placeholder="请输入手机号"
        />
        <span style="width: 100px;">{{ bind_btn }}</span>
      </van-cell>
      <van-cell is-link class="customflex" v-if="false" :border="false">
        <van-field
          slot="title"
          v-model="info_form.mobile"
          label="手机号："
          type="tel"
          readonly
          maxlength="11"
          clearable
          placeholder="请输入手机号"
        />
        <span style="width: 100px;">{{ bind_btn }}</span>
      </van-cell>
      <van-cell is-link class="customflex" @click.native="showSexInfo" v-if="isShowSex" :border="false">
        <van-field
          slot="title"
          v-model="sexName"
          label="性别："
          type="tel"
          readonly
          maxlength="11"
          clearable
          placeholder="请选择性别"
        />
      </van-cell>
      <van-cell is-link class="customflex" @click.native="openPicker" v-if="isShowBirthday" :border="false">
        <van-field
          slot="title"
          v-model="info_form.birthday"
          label="生日："
          type="tel"
          readonly
          maxlength="11"
          clearable
          placeholder="请选择生日"
        />
      </van-cell>
      <van-cell :border="false">
        <van-field v-model="info_form.wx" label="微信号："  clearable placeholder="请输入微信号" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="支付宝信息">
      <van-cell :border="false">
        <van-field
          v-model="info_form.alipay"
          label="支付宝账号："
          maxlength="40"
          clearable
          placeholder="请输入支付宝账号"
        />
      </van-cell>
      <van-cell :border="false">
        <van-field
          v-model="info_form.alipay_name"
          label="账号姓名："
          maxlength="40"
          clearable
          placeholder="请输入支付宝账号姓名"
        />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="所在地信息" v-if="isShowAddress" :border="false">
      <van-cell is-link class="customflex" :border="false">
        <van-field
          slot="title"
          v-model="districtName"
          @click.stop="showAdd = true"
          label="所在地区："
          type="tel"
          readonly
          maxlength="11"
          clearable
          placeholder="请选择地区"
        />
      </van-cell>
    </van-cell-group>
    <van-field
      v-if="isShowAddress"
      class="teaText"
      v-model="info_form.address"
      rows="3"
      type="textarea"
      maxlength="100"
      placeholder="请输入详细地址"
      show-word-limit
    />

    <van-cell-group title="其他信息" v-if="isForm" class="customMessage">
      <van-cell :border="false" v-for="(cItem, i) in customDatas" :key="i">
        <van-field
          v-model="cItem.value"
          :label="cItem.name + ':'"
          maxlength="40"
          clearable
          :placeholder="'请输入' + cItem.name"
          :required="formOpen"
          :disabled="formEdit"
        />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="易合支付" v-if="yopshow">
      <van-cell
        :border="false"
        @click.native="aggregBtn"
        is-link
        title-style="text-align:left;padding-left:8px;color:#555"
      >
        <span slot="title">分账入网</span>
        <span slot="default">{{ netEntState }}</span>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="易合专业版支付" v-if="yopProshow">
      <van-cell
        :border="false"
        @click.native="aggregProBtn"
        is-link
        title-style="text-align:left;padding-left:8px;color:#555"
      >
        <span slot="title">分账入网</span>
        <span slot="default">{{ netProEntState }}</span>
      </van-cell>
    </van-cell-group>

    <van-cell-group title="银行卡信息">
      <van-cell is-link class="customflex" :border="false" @click.native="editBank">
        <van-field slot="title" label="银行卡" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="CMC账号管理" v-if="cmcShow">
      <van-cell is-link class="customflex" :border="false" @click.native="editCmc">
        <van-field slot="title" label="CMC账号" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="支付密码" v-if="isBalancePwd">
      <van-cell is-link class="customflex" :border="false" @click.native="editBalancePwd">
        <van-field slot="title" label="支付密码" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group :title="custom_title + '信息'" v-if="is_custom">
      <van-cell is-link class="customflex" :border="false" @click.native="editCustom">
        <van-field
          slot="title"
          :label="custom_title"
          type="text"
          v-model="custom_value"
          readonly
          clearable
          placeholder=""
        />
      </van-cell>
    </van-cell-group>

    <van-cell-group :title="`银行卡${this.fun.initWithdrawal()}信息`" v-if="isBankRecharge">
      <van-cell is-link class="customflex" :border="false" @click.native="gotoBankCash">
        <van-field slot="title" label="开户信息" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="实名认证">
      <van-cell is-link class="customflex" :border="false" @click.native="gotoCertified">
        <van-field slot="title" label="认证信息" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="结算账户信息" v-if="is_open_converge_pay">
      <van-cell is-link class="customflex" :border="false" @click.native="editUSer">
        <van-field slot="title" label="账户信息" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-cell-group title="注销服务" v-if="memberCancel == 1">
      <van-cell is-link class="customflex" :border="false"  @click.native="goMemberCancel">
        <van-field slot="title" label="账户注销" type="text" readonly clearable placeholder="" />
      </van-cell>
    </van-cell-group>

    <van-action-sheet v-model="showSex" :actions="actions" cancel-text="取消" @select="onSelect" />
    <yd-cityselect v-model="showAdd" :callback="resultAdd" :items="district"></yd-cityselect>
    <div class="van-button-group">
      <van-button color="#ef4f4f" style="height: 40px;" size="large" type="danger" @click.native="submitInfo($event)"
        >确认修改</van-button
      >
    </div>
    <div style="height: 1.875rem;"></div>

    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="handleConfirm"
        @cancel="cancelbtn"
      />
    </van-popup>
    <!-- 聚合支付入网选择弹框 -->

    <van-action-sheet v-model="aggreshow" :actions="aggreItems" cancel-text="取消" @select="onSelectProposalForm" />
    <van-action-sheet v-model="aggreProshow" :actions="aggreProItems" cancel-text="取消" @select="onSelectProposalProForm" />
  </div>
</template>
<script>
import info from './info_v2_controller';
export default info;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.van-button-group {
  padding-top: 15px;
  padding-left: 12px;
  padding-right: 12px;
}

#info span {
  font-size: 14px !important;
}

.user {
  padding: 1rem;
  background-color: #fff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;

    .user-avatar {
      width: 3.75rem;
      height: 3.75rem;

      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }
  }

  .update-btn {
    width: 5rem;
    height: 1.75rem;
    box-sizing: border-box;
    background-color: rgba(255, 183, 182, 0.46);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(242, 79, 78, 1);
    border-radius: 1.25rem;
    font-size: 12px;
  }
}

.list1 {
  margin-top: 0.625rem;
  height: 2.75rem;
  width: 100%;
  background: #fff;
  padding: 0 0 0 3%;
  border-top: 1px solid #e6e1e1;
  font-size: 14px;
  line-height: 2.75rem;
  color: #333;
  text-align: left;
}

.list2 {
  height: 2.75rem;
  width: 100%;
  background: #fff;
  padding: 0 0 0 3%;
  border-top: 0.0625rem solid #e6e1e1;
  font-size: 14px;
  line-height: 2.75rem;
  color: #333;
  text-align: left;
}

.list1 i.fa.fa-angle-right {
  float: right;
  line-height: 2.75rem;
  display: inline-block;
  font-size: 0.9rem;
  margin-right: 0.375rem;
  color: #929292;
  width: 1.25rem;
  height: 1.25rem;
  text-align: center;
  background-size: 1.25rem;
}

.fa-angle-right {
  color: #999;
  font-size: 1.625rem;
  float: right;
  line-height: 3.125rem;
  margin-left: 0.375rem;
  margin-right: 0.3125rem;
}

.btmobile {
  top: 0;
  line-height: 3rem;
  right: 100;
  width: 5rem;
  font-size: 12px;
  color: #f15353;
}

#info .mint-button {
  margin: 0 2%;
}

.maleall {
  background: #fff;
  text-align: left;
}

.males {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #f3f3f3;
  margin-left: 0.625rem;
}

.maleall span {
  color: #888;
  font-size: 14px;
  vertical-align: middle;
  width: 28%;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
}

#address {
  flex: 1;
  line-height: 3.125rem;

  .mint-button--default {
    line-height: 3.125rem;
    text-align: left;
  }
}

#myimg {
  flex: 1;
  text-align: right;
}

.popup-con {
  width: 100%;
}

.el-upload img {
  width: 30%;
}

.avatar-uploader-icon {
  padding-right: 1.5625rem;
}

.mint-cell-wrapper {
  background: red;
}

.mint-button {
  margin: 0.3125rem 0;
}

#info .mint-cell-wrapper {
  padding: 0;
}

#info .van-cell-group__title {
  padding-top: 10px;
  text-align: left;
}

#info .van-cell {
  padding: 0 7px;
  height: 50px;
  line-height: 50px;

  ::-webkit-input-placeholder {
    color: #666;
  }

  /deep/.van-field__label {
    width: auto;
    margin-right: 0;
    white-space: nowrap;
  }

  .van-cell__right-icon {
    line-height: 50px;
  }
}

#info .customflex .van-cell__value {
  color: #525252;
  flex: 0.3;
}

#info .teaText {
  line-height: 20px;
  height: 7.1875rem;
  // height: 12.1875rem;
}

.teaText /deep/.van-field__control {
  padding-left: 10px;
  height: 5rem;
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}

#info .customMessage .van-cell--required::before {
  left: 1px;
}



.member_photo{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:0 14px;
  height: 50px;
  &_item{
    width: 34px;
    height: 34px;
    border-radius: 50px;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50px;
    }
  }
}
::v-deep .van-uploader__preview-image{
  width: 34px;
  height: 34px;
  border-radius: 50px;
}
::v-deep .van-uploader__upload{
  width: 34px;
  height: 34px;
  border-radius: 50px;
}
::v-deep .van-uploader{
    position: absolute;
    right: 20px;
    top: 10px
}
</style>
