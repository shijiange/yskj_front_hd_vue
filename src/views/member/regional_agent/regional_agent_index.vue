<template>
  <div class="page">
    <c-title text="区域代理">
      <div slot="edit" @click="ruleFlag = true">规则说明</div>
    </c-title>
    <div class="search" @click="gotoSearch">
      <input class="input" placeholder="请输入区域"/>
      <div class="btn">搜索</div>
    </div>

    <div class="wrapper">
      <template v-for="(item,key) in renderingList">
        <div class="container" :key="key">
          <div class="provinceList">
            <div class="provinceItem" :style="{backgroundColor:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.bg_color : '' ,
							color:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.words_color : ''}"
                 :class="[(provinceItem!=null &&item1.id==provinceItem.id) ? 'active' : '' ]"
                 v-for="(item1,key1) in item" :key="key1" @click="handProvinceClick(item1,key)">
              <i v-if="item1.has_agent" class="iconfont icon-renxiang"></i>
              <span class="name" :style="{paddingLeft:item1.has_agent ? '0rem' : '1rem'}">{{item1.areaname}}</span>
              <i class="iconfont icon-advertise-next"></i>
            </div>
          </div>
          <div class="children" v-if="key==flootIndex">
            <div class="selected">
              <div class="selectName" v-if="provinceItem!=null" @click="handSelectedProvince">
                {{provinceItem.areaname}}<i class="iconfont icon-advertise-next"></i>
              </div>
              <div class="selectName" v-if="cityItem!=null" @click="handSelectedCity">
                {{cityItem.areaname}}<i class="iconfont icon-advertise-next"></i>
              </div>
              <div class="selectName" v-if="areaItem!=null" @click="handSelectedArea">
                {{areaItem.areaname}}<i class="iconfont icon-advertise-next"></i>
              </div>
              <div class="selectName" v-if="streetItem!=null">
                {{streetItem.areaname}}
              </div>
            </div>
            <div class="childrenCntainer" v-if="currentSelectedLevel==2">
              <div class="childrenItem" :style="{backgroundColor:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.bg_color : '' ,
							color:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.words_color : ''}"
                   :class="[(cityItem!=null &&item1.id==cityItem.id) ? 'active' : '' ]" v-for="(item1) in childrenList"
                   :key="item1.id" @click="handChildren(item1)">
                <i v-if="item1.has_agent" class="iconfont icon-renxiang"></i>
                <span class="name" :style="{paddingLeft:item1.has_agent ? '0rem' : '1rem'}">{{item1.areaname}}</span>
                <i class="iconfont icon-advertise-next"></i>
              </div>
            </div>
            <div class="childrenCntainer" v-else-if="currentSelectedLevel==3">
              <div class="childrenItem" :style="{backgroundColor:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.bg_color : '' ,
							color:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.words_color : ''}"
                   :class="[(areaItem!=null &&item1.id==areaItem.id) ? 'active' : '' ]" v-for="(item1) in childrenList"
                   :key="item1.id" @click="handChildren(item1)">
                <i v-if="item1.has_agent" class="iconfont icon-renxiang"></i>
                <span class="name" :style="{paddingLeft:item1.has_agent ? '0rem' : '1rem'}">{{item1.areaname}}</span>
                <i class="iconfont icon-advertise-next"></i>
              </div>
            </div>
            <div class="childrenCntainer" v-else-if="currentSelectedLevel==4">
              <div class="childrenItem" :style="{backgroundColor:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.bg_color : '' ,
							color:(item1.has_many_tag && item1.has_many_tag[0] && item1.has_many_tag[0].belongs_to_tag) ? item1.has_many_tag[0].belongs_to_tag.words_color : ''}"
                   :class="[(streetItem!=null &&item1.id==streetItem.id) ? 'active' : '' ]"
                   v-for="(item1) in childrenList" :key="item1.id" @click="handChildren(item1)">
                <i v-if="item1.has_agent" class="iconfont icon-renxiang"></i>
                <span class="name" :style="{paddingLeft:item1.has_agent ? '0rem' : '1rem'}">{{item1.areaname}}</span>
                <i class="iconfont icon-advertise-next"></i>
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>


    <van-overlay :show="ruleFlag" :lock-scroll="false"
                 @click="ruleFlag = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="explainWrapper" v-show="ruleFlag" @click.stop>
            <div class="header">
              <div class="title">规则</div>
              <i class="iconfont icon-guanbi" @click="ruleFlag = false"></i>
            </div>
            <div class="content" v-html="ruleContext"></div>
          </div>
        </transition>
      </div>
    </van-overlay>


    <div style="height: 3.063rem; width: 100%;"></div>
    <div class="fixedBottom">
      <div @click="gotoResult" class="btn">查询</div>
    </div>


  </div>
</template>

<script>
import RegionalAgentIndexController from "./regional_agent_index_controller.js";

export default RegionalAgentIndexController;
</script>


<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: #fff;
    min-height: 100vh;
  }

  .search {
    margin: 1rem auto 0;
    width: 20.5rem;
    height: 2.125rem;
    background-color: #f5f5f5;
    border-radius: 1.063rem;
    display: flex;
    align-items: center;
    position: relative;

    .input {
      width: 20.5rem;
      padding-right: 4rem;
      font-size: 0.813rem;
      color: #838383;
      padding-left: 1rem;
      border: none;
    }

    .btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 3.875rem;
      height: 2.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      background-color: #0176ff;
      border-radius: 1.063rem;
    }
  }

  .wrapper {
    padding-top: 1.5rem;
  }

  .wrapper .container {
    display: flex;
    flex-direction: column;
  }

  .wrapper .container .provinceList {
    padding: 0 0.781rem;
    // display: flex;
    // justify-content: space-between;
    padding-bottom: 1.094rem;
    display: grid;
    grid-template-columns: repeat(4, 5.25rem);
    grid-column-gap: 0.281rem;

    .provinceItem {
      width: 5.25rem;
      height: 2rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 0.813rem;
      color: #3a3a3a;
      background-color: #f7f7f7;

      &.active {
        color: #0176ff;
        background-color: rgba(1, 118, 255, 0.08);
      }

      .icon-renxiang {
        font-size: 0.6rem;
        padding-left: 0.5rem;
        padding-right: 0.1rem;
      }

      .name {
        flex: 1;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .icon-advertise-next {
        padding-right: 0.15rem;
      }
    }
  }

  .wrapper .container .children {
    .selected {
      padding: 0 0.844rem 0.625rem;
      display: flex;
      flex-wrap: wrap;
      color: #333;
      font-size: 0.938rem;

      .selectName {
        margin-right: 1rem;
      }
    }

    .childrenCntainer {
      background-color: #f1f6fa;
      margin-bottom: 0.9rem;
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.781rem 1.031rem;

      .childrenItem {
        margin-top: 1.031rem;
        margin-right: 0.2rem;
        min-width: 5.25rem;
        height: 2rem;
        border-radius: 1rem;
        display: flex;
        font-size: 0.813rem;
        align-items: center;
        justify-content: center;
        color: #3a3a3a;
        background-color: #fff;

        &.active {
          color: #0176ff;
          background-color: rgba(1, 118, 255, 0.08);
        }

        .icon-renxiang {
          font-size: 0.6rem;
          padding-left: 0.5rem;
          padding-right: 0.1rem;
        }

        .name {
          flex: 1;
          text-align: center;
        }

        .icon-advertise-next {
          padding-right: 0.15rem;
        }
      }
    }
  }

  .fixedBottom {
    position: fixed;
    transform: translateX(-50%);
    z-index: 9999;
    bottom: 0;
    left: 50%;
    height: 3.063rem;
    width: 375px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 -0.25rem 0.706rem 0.044rem rgba(51, 51, 51, 0.08);

    .btn {
      width: 21.375rem;
      height: 2.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1rem;
      background-color: #0176ff;
      border-radius: 0.313rem;
    }
  }

  .explainWrapper {
    width: 21.25rem;
    max-height: 22.625rem;
    background-color: #fff;
    border-radius: 1.531rem;
    padding-bottom: 3rem;
    transition: 0.3s;
    padding-top: 0.5rem;

    .header {
      height: 2.596rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .title {
        font-size: 1rem;
        letter-spacing: 0.05rem;
        color: #000;
      }

      .icon-guanbi {
        position: absolute;
        top: 0.875rem;
        right: 1.25rem;
        color: #000;
      }
    }

    .content {
      max-height: 11rem;
      padding-top: 0.562rem;
      font-size: 0.875rem;
      letter-spacing: 0.066rem;
      color: #666;
      padding-left: 1.049rem;
      padding-right: 1.469rem;
      text-align: left;
      line-height: 1.5rem;
      overflow-y: scroll;
    }
  }

</style>
