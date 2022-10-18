<template>
  <div id="power_member">
    <c-title :hide="false"
             text='会员信息'></c-title>
    <div class="search">
      <i class="iconfont icon-sousuo"></i>
      <input type="text"
             v-model="keyword"
             @keypress="enterSearch"
             placeholder="搜索会员id" />
    </div>
    <div class="content">
      <div class="item-list">
        <div class="item" v-for="(item,index) in datas" :key="index">
          <div class="left">
            <div class="avator">
              <img :src="item.avatar_image">
            </div>
            <div class="txt">
              {{item.nickname}}
            </div>
          </div>
          <div class="right">
            <i class="iconfont icon-advertise-next"
               @click="toDetail(item)"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import power_member_controller from './power_member_controller';
export default power_member_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_member {
  height: 100vh;
  background-color: #fff;

  .search {
    border-bottom: solid 1px #f5f7fa;
    padding: 1rem 1.375rem;
    text-align: left;

    input {
      flex: 1;
      padding-left: 1.3125rem;
      outline: none;
      border: none;
    }
  }

  .content {
    padding: 0 1.375rem;
    background-color: #fff;

    .item-list {
      .item {
        padding: 1rem 0;
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #f5f7fa;
        align-items: center;

        .left {
          display: flex;
          align-items: center;

          .avator {
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .txt {
            margin-left: 1rem;
          }
        }

        .right {
          i {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
