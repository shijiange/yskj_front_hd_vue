<template>
  <div class="page" id="signLunch">
    <div v-show="!showAddSign">
      <c-title text="发起签署"></c-title>
      <div class="container" style="margin-top: 0.625rem;">
        <div class="container-title">合同模版信息</div>
        <div style="padding-top: 1rem; text-align: left;">模板名称：{{contract.contract_doc_name}}</div>
      </div>

      <div class="container" style="margin-top: 0.625rem;">
        <div class="container-title">附件列表</div>
        <div style="padding-top: 1rem; text-align: left;">文档：<span v-for="(file, i) in contract_attach" :key="i" @click="toLink(file)">{{file.file_name}}；</span></div>
      </div>

      <div class="container templateInfo" style="margin-top: 0.625rem;">
        <div class="container-title">合同基本信息</div>
        <div class="templateInfo-item">
          <div class="desc">
            <i class="iconfont icon-fontclass-xinghao"></i>
            <span>合同名称</span>
          </div>
          <div class="input">
            <input type="text" v-model="ruleForm.name" placeholder="请输入合同名称"/>
          </div>
        </div>
        <div class="templateInfo-item">
          <div class="desc">
            <i class="iconfont icon-fontclass-xinghao"></i>
            <span>截至日期</span>
          </div>
          <div class="input" @click="deadline_show = true">
            <span>{{ruleForm.sign_end_date ? ruleForm.sign_end_date : "选择日期"}}</span>
            <i class="iconfont icon-member_right"></i>
          </div>
        </div>
        <div class="templateInfo-item">
          <div class="desc">
            <span>合同到期日</span>
          </div>
          <div class="input" @click="duedate_show = true">
            <span>{{ruleForm.contract_end_date ? ruleForm.contract_end_date : "选择日期"}}</span>
            <i class="iconfont icon-member_right"></i>
          </div>
        </div>
      </div>

      <div class="container signInfo" style="margin-top: 0.625rem;">
        <div class="container-title">签署信息</div>
        <div class="empty" v-if="signTableData.length <= 0">暂无签署角色</div>
        <template v-if="signTableData.length > 0">
          <div class="signInfo-box" v-for="(item,i) in signTableData" :key="i">
            <div class="signIfno-texts">
              <div class="signIfno-text">签署角色：{{item.role_id === 1 ? '甲方': (item.role_id === 2 ? '乙方':'丙方')}}</div>
              <div class="signIfno-text">姓名：{{item.name}}</div>
              <div class="signIfno-text">手机号：{{item.tel}}</div>
              <div class="signIfno-text">签署主体：{{item.sign_type === 1 ? '企业' : '个人'}}</div>
              <div class="signIfno-text" v-if="item.sign_type === 1 && item.company_name">公司：{{item.company_name}}</div>
            </div>
            <div class="signIfno-btns">
              <div class="button signIfno-btn" @click="toAddSign(i+1)">编辑</div>
              <div class="button signIfno-btn delete" @click="deleteIt(i, 'sign')">删除</div>
            </div>
          </div>
        </template>
        <div class="button addSign" v-if="signTableData.length < sign_form_count" @click="toAddSign()">添加签署方</div>
      </div>

      <div class="container signInfo" style="margin-top: 0.625rem;">
        <div class="container-title">抄送人</div>
        <div class="empty" v-if="tableData.length <= 0">暂无抄送人</div>
        <div class="people-box" v-if="tableData.length > 0">
          <div class="people-box-item" v-for="(item,i) in tableData" :key="i">
            <div class="people-box-item-left">
              <div class="input">
                <div class="desc">姓名:</div>
                <input type="text" v-model="item.name" placeholder="请输入姓名"/>
              </div>
              <div class="input">
                <div class="desc">手机号:</div>
                <input type="text" v-model="item.tel" placeholder="请输入手机"/>
              </div>
            </div>

            <div class="signIfno-btns">
              <div class="button signIfno-btn delete" @click="deleteIt(i)">删除</div>
            </div>
          </div>
        </div>
        <div class="button addSign" @click="toCCAdd">添加抄送人</div>
        <div class="history">最近抄送人：
          <span v-for="(item,index) in ncc_list" :key="index" @click="toCCAdd(index)" class="name"> {{item.name}}
          <span v-if="index!=ncc_list.length-1">、</span>
        </span>
        </div>
      </div>

      <div style="padding: 1rem 0;">
        <div class="button next-step" @click="submitFormSecond('1')">下一步</div>
      </div>

      <van-popup v-model="deadline_show" position="bottom" :overlay="true">
        <van-datetime-picker v-model="deadline_model" type="date" target="deadline" @confirm="datetimeConfirm($event,'deadline')" @cancel="deadline_show = false"/>
      </van-popup>

      <van-popup v-model="duedate_show" position="bottom" :overlay="true">
        <van-datetime-picker v-model="duedate_model" type="date" target="deadline" @confirm="datetimeConfirm($event,'duedate')" @cancel="duedate_show = false"/>
      </van-popup>
    </div>

    <div v-if="showAddSign">
      <c-title text="发起签署" :popClose="true" @onGoBack="onCloseSign"></c-title>
      <addSign @sureAddSign="sureAddSign" :signTableData="signTableData" :sign_form_count="sign_form_count" ref="addSignRef"></addSign>
    </div>

  </div>
</template>

<script>
import launchSignController from "./launch_sign_controller";

export default launchSignController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "./common.scss";

  .signInfo {
    .empty {
      height: 5.844rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.938rem;
      color: #cbcbcb;
    }

    .signInfo-box {
      display: flex;
      width: 100%;
      height: 10rem;
      padding-top: 1.067rem;
      padding-bottom: 1.7rem;

      .signIfno-texts {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;

        .signIfno-text {
          font-size: 0.813rem;
          color: #272727;
        }
      }

      .signIfno-btns {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .signIfno-btn {
          width: 3.438rem;
          height: 1.688rem;
          font-size: 0.75rem;
          color: #fa761d;
          border-radius: 0.188rem;
          border: solid 0.063rem #fa761d;

          &.delete {
            color: #e52256;
            border-color: #e52256;
          }
        }
      }
    }

    .addSign {
      width: 6.25rem;
      height: 1.875rem;
      margin: 0 auto;
      font-size: 0.813rem;
      color: #fff;
      background-color: #198bfb;
      border-radius: 0.188rem;
    }

    .history {
      padding-top: 1.594rem;
      font-size: 0.813rem;
      text-align: left;
      color: #171717;

      .name {
        color: #f76666;
      }
    }
  }

  .people-box {
    text-align: left;
    padding-bottom: 1.06rem;

    .people-box-item {
      height: 4.5rem;
      display: flex;
      border-bottom: solid 0.04rem #f6f6f6;

      &:last-child {
        border-bottom: none;
      }

      .people-box-item-left {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        flex: 1;
      }

      .signIfno-btns {
        flex: 0 0 3.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;

        .signIfno-btn {
          width: 3.5rem;
          height: 1.688rem;
          font-size: 0.75rem;
          color: #e52256;
          border-radius: 0.188rem;
          border: solid 0.063rem #e52256;
        }
      }

      .input {
        display: flex;
        font-size: 0.938rem;

        .desc {
          color: #171717;
        }

        input {
          margin-left: 0.3rem;
          border: none;
        }
      }
    }
  }

  .next-step {
    margin: 1rem auto;
    width: 20rem;
    height: 2.656rem;
    font-size: 0.938rem;
    color: #fff;
    background-color: #198bfb;
    border-radius: 0.469rem;
  }
</style>
