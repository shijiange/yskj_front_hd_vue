<template>
  <div class="page" id="signLunch">
    <div class="container templateInfo" style="margin-top: 0.625rem;">
      <div class="container-title">签署方信息</div>
      <div class="templateInfo-item">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span>选择角色</span>
        </div>
        <div class="radio-group">
          <div class="radio-item" v-for="role in role_options" v-if="role.id" :key="role.id" @click="chooseRole(role.id)">
            <i class="iconfont icon-all_select_active" :class="{'active': signData.role_id === role.id}"></i>
            <span>{{role.value}}</span>
          </div>
        </div>
      </div>
      <div class="templateInfo-item">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span>手机号</span>
        </div>
        <div class="input">
          <input type="text" v-model="signData.tel" placeholder="单行输入" />
        </div>
      </div>
      <div class="templateInfo-item">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span>姓名</span>
        </div>
        <div class="input">
          <input type="text" v-model="signData.name" placeholder="单行输入" />
        </div>
      </div>
      <div class="templateInfo-item">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span>签署主体</span>
        </div>
        <div class="radio-group">
          <div class="radio-item" @click="changeSignType(0)">
            <i class="iconfont icon-all_select_active" :class="{'active': signData.sign_type !== 1}"></i>
            <span>个人</span>
          </div>
          <div class="radio-item" @click="changeSignType(1)">
            <i class="iconfont icon-all_select_active" :class="{'active': signData.sign_type === 1}"></i>
            <span>企业</span>
          </div>
        </div>
      </div>
      <div class="templateInfo-item" v-if="signData.sign_type === 1">
        <div class="desc">
          <i class="iconfont icon-fontclass-xinghao"></i>
          <span>企业信息</span>
        </div>
        <div class="input">
          <input type="text" v-model="signData.company_name" placeholder="单行输入" />
        </div>
      </div>
    </div>

    <div class="container quickInput">
      <div class="container-title">快速输入签署方</div>
      <div class="textarea-box">
        <textarea name="" v-model="quick_add_sign" :placeholder="msg" id="" cols="30" rows="10"></textarea>
      </div>
      <div class="desc">请务必按照格式顺序输入，第一行必须是“甲方、乙方、丙方”之一</div>
      <div class="addSign button" @click="handleText">智能填充</div>
    </div>

    <div class="container historySign">
      <div class="container-title">历史签署方</div>
      <div class="desc">点击选择可将历史签署方的信息快速填充到签署方信息中！</div>
      <div class="searchBox">
        <div class="search">
          <i class="iconfont icon-all_search_2"></i>
          <form action="javascript:void 0;" style="flex: 1; display: flex;">
            <input type="text" @keyup.enter="searchData('refresh')" v-model="keyWord" placeholder="输入姓名或者公司名称" />
          </form>
        </div>
        <div class="button search-btn" @click="searchData('refresh')">搜索</div>
      </div>

      <div class="search-items">
        <d-list
          :finished="!isLoadMore"
          :loading="loading"
          @load="searchData"
        >
          <div class="search-item" v-for="(item,i) in search_list" :key="i">
            <div class="search-texts">
              <div class="search-text">姓名：{{item.name}}</div>
              <div class="search-text">手机号：{{item.tel}}</div>
              <div class="search-text">公司：{{item.company_name || '暂无'}}</div>
            </div>
            <div class="search-btns">
              <div class="button search-btn" @click="chooseSign(item)">选择</div>
            </div>
          </div>
        </d-list>
      </div>
    </div>

    <div style="height: 5rem;"></div>
    <div class="confirm-btn set-pc-styleLeft">
      <div class="button" @click="sureAddSign">确定</div>
    </div>
  </div>
</template>

<script>
import addSignatureController from "./add_signature_controller";

export default addSignatureController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./common.scss";

.templateInfo {
  .radio-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding-top: 0.475rem;

    .radio-item {
      .iconfont {
        color: #dedede;
        font-size: 0.8rem;

        &.active {
          color: #198bfb;
        }
      }

      span {
        margin-left: 0.306rem;
        font-size: 0.938rem;
        color: #3b3b3b;
      }
    }
  }
}

.quickInput {
  margin-top: 0.625rem;

  .textarea-box {
    padding-top: 1rem;

    textarea {
      width: 19.375rem;
      height: 8.75rem;
      padding: 0.513rem 1.063rem;
      line-height: 1.525rem;
      letter-spacing: 0.044rem;
      font-size: 0.875rem;
      border-radius: 0.313rem;
      border: solid 0.031rem #7a7a7a;
    }
  }

  .desc {
    font-size: 0.75rem;
    color: #171717;
    text-align: left;
    padding: 0 0.8rem;
  }

  .addSign {
    width: 6.25rem;
    height: 1.875rem;
    margin: 1rem auto 0;
    font-size: 0.813rem;
    color: #fff;
    background-color: #198bfb;
    border-radius: 0.188rem;
  }
}

.historySign {
  margin-top: 0.625rem;

  .desc {
    font-size: 0.688rem;
    color: #171717;
    text-align: left;
    padding-top: 0.4rem;
  }

  .searchBox {
    display: flex;
    padding-top: 0.875rem;

    .search {
      flex: 1;
      height: 1.88rem;
      border-radius: 0.313rem;
      background-color: #eff0f1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 0.69rem;

      i {
        color: #999;
      }

      input {
        flex: 1;
        padding-right: 0.5rem;
        border: none;
        font-size: 0.813rem;
        color: #666;
        margin-left: 0.41rem;
      }
    }

    .search-btn {
      margin-left: 0.813rem;
      width: 3.125rem;
      height: 1.875rem;
      font-size: 0.813rem;
      letter-spacing: 0.041rem;
      color: #fff;
      background-color: #198bfb;
      border-radius: 0.313rem;
    }
  }

  .search-items {
    padding-top: 0.3rem;

    .search-item {
      display: flex;
      height: 5.594rem;
      padding-top: 0.938rem;
      padding-bottom: 0.75rem;
      border-bottom: 0.031rem solid #f6f6f6;

      .search-texts {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .search-text {
          font-size: 0.813rem;
          letter-spacing: 0.041rem;
          color: #272727;
          text-align: left;
        }
      }

      .search-btns {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .search-btn {
          width: 3.438rem;
          height: 1.688rem;
          font-size: 0.75rem;
          letter-spacing: 0.038rem;
          color: #fa761d;
          border-radius: 0.188rem;
          border: solid 0.063rem #fa761d;
        }
      }
    }
  }
}

.confirm-btn {
  position: fixed;
  bottom: 0;
  width: 100%;
  font-size: 0.938rem;
  background-color: #fff;
  padding: 0.5rem;

  .button {
    border-radius: 0.469rem;
    margin: 0 auto;
    width: 20rem;
    height: 2.656rem;
    color: #fff;
    background-color: #198bfb;
  }
}
</style>
