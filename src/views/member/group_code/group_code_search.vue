<template>
  <div class="page">
   <div class="header">
      <div class="header_content">
          <div class="left" @click="goto">
            <i class="iconfont icon-member-left back"></i>
          </div>
          <div class="input">
              <i class="iconfont icon-all_search_2"></i>
               <form action="javascript:void 0;" >
                    <input type="search" v-model="searchText" @keyup.13="sendSearch" placeholder="请输入活码名称" >
               </form>
          </div>
       </div>
        <div style="height: 2.938rem; width: 100%;"></div>
   </div>

    <c-list-item :listData="listData" :shop_log="shop_log"></c-list-item>
    <van-empty v-if="listData.length==0" description="暂无记录" />



  </div>
</template>

<script>
import groupCodeSearchController from './group_code_search_controller';

export default groupCodeSearchController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .page { background: #fff; min-height: 100vh; }

  .header {
    height: 2.938rem;

    .header_content {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      //  padding-left:1.344rem;
      padding-right: 1.469rem;
      height: 2.938rem;
      background-image:
        linear-gradient(150deg, #33d39d 1%, #59d4ab 100%),
        linear-gradient(#ea803f, #ea803f);
      background-blend-mode: normal, normal;

      .left {
        width: 3rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-member-left {
          color: #fff;
          font-weight: bold;
        }
      }

      .input {
        flex: 1;
        height: 2.125rem;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 1.063rem;
        text-align: left;
        display: flex;
        align-content: center;

        i {
          padding-top: 0.531rem;
          padding-left: 1.125rem;
          color: #fff;
          display: flex;
          align-content: center;
        }

        form {
          flex: 1;
          display: flex;
          align-items: center;
          padding-right: 0.531rem;

          input {
            flex: 1;
            margin-left: 0.531rem;
            font-size: 0.875rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0.044rem;
            color: #fff;
            border: none;

            &::-webkit-input-placeholder {
              color: #fff;
            }
          }
        }
      }
    }
  }

  .wrapper {
    padding: 1rem 0.781rem;

    .item {
      width: 21.875rem;
      height: 5.031rem;
      display: flex;
      align-items: center;

      .image {
        width: 3.75rem;

        img {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 50%;
        }
      }

      .content {
        flex: 1;
        margin-left: 0.719rem;
        height: 3.75rem;
        display: flex;
        flex-direction: column;
        text-align: left;

        .top {
          display: flex;

          .name {
            font-size: 1rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0.05rem;
            color: #333;
            flex: 1;
          }

          .btn {
            margin-right: 1.313rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.125rem;
            height: 1.375rem;
            color: #fff;
            background-image: linear-gradient(#00b075, #00b075), linear-gradient(#ff6e65, #ff6e65);
            background-blend-mode: normal, normal;
            border-radius: 0.688rem;
          }
        }

        .desc {
          margin-top: 0.544rem;
          flex: 1;
          width: 16.438rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999;
        }
      }
    }
  }

</style>
