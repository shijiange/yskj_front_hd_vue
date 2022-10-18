<template>
  <div id="circleMember">
    <c-title :hide="false" text="成员管理"></c-title>
    <div class="searchBox">
      <div class="search" @input="searchMenber()">
        <i class="iconfont icon-sousuo"></i>
        <input type="text" placeholder="搜索会员昵称" v-model="name" style="width: 100%;" />
      </div>
    </div>
    <div class="member-list">
      <d-list
        @load="loadMembers"
        :finished="memberPagination.finished"
        :loading="memberPagination.loading"
      >
        <div class="list">
          <div class="item" v-for="(item, index) in menberList" :key="index">
            <div class="left">
              <img class="avatar" :src="item.header_img" />
              <!-- <div class="avatar"></div> -->
              <div class="name">
                <div>{{ item.name }}</div>
                <div>{{ item.created_at }}</div>
              </div>
            </div>
            <div class="right">
              <i class="iconfont icon-appointment_delete" @click="expurgate(item.member_id,index)"></i>
            </div>
          </div>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import circleMember_controller from "./circleMember_controller";

export default circleMember_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleMember {
  .searchBox {
    width: 23.44rem;
    height: 3.06rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding: 0.58rem 0.94rem 0 0.94rem;
    border-bottom: 0.1rem solid #eff0f1;

    .search {
      background-color: #eff0f1;
      border-radius: 0.94rem;
      height: 1.88rem;
      width: 100%;
      display: flex;
      align-items: center;

      i {
        color: #aaa;
        margin-left: 0.5rem;
      }

      input {
        margin-left: 0.5rem;
        border: none;
      }
    }
  }

  .member-list {
    .list {
      border-bottom: solid 1px #f2f2f2;

      .item {
        height: 4.25rem;
        background-color: #fff;
        box-sizing: border-box;
        padding: 0.9375rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.1rem solid #eff0f1;

        .left {
          display: flex;

          .avatar {
            width: 2.1875rem;
            height: 2.1875rem;
            background-color: #cfcfcf;
            margin-right: 0.5938rem;
            border-radius: 50%;
          }

          .name {
            display: flex;
            text-align: left;
            flex-direction: column;
            justify-content: space-between;
          }
        }

        .right {
          i {
            font-size: 1rem;
            color: #3175fe;
          }
        }
      }
    }
  }
}
</style>
