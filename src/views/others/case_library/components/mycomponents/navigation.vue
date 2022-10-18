<template>
  <div id="navigation">
    <div class="nav">
      <div class="nav-a">
        <div class="logo">
          <img :src="logo_src || emptyImage" alt="" v-if="logo_src" />
        </div>
        <div class="ul">
          <div class="li" v-for="(item, index) in nav_top" :key="index" :class="{ 'li-selected': false }">
            <a :href="item.url || '#'">
              <div class="text">{{ item.name }}</div>
              <div class="border-bottom"></div>
            </a>
          </div>
        </div>
        <div class="button">
          <div class="release" @click="gotoRelease">发布案例</div>
          <div
            class="login"
            @click="gotoLogin"
            v-if="!$store.state.caseLibrary || $store.state.caseLibrary.is_login != 1"
          >
            登录
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script>
import navigation_controller from './navigation_controller';

export default navigation_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);

#navigation {
  background: #fff;
  text-align: center;

  .nav {
    height: 60px;
    background: #fff;
    box-shadow: 1px 2px 10px #ccc;
    position: fixed;
    width: 100%;
    padding: 9px 0;
    z-index: 1998;

    .nav-a {
      width: 1200px;
      margin: 0 auto;
      display: flex;

      .logo {
        width: 200px;
        height: 42px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .ul {
        width: 790px;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 18px;

        .li {
          margin: 0 30px;
          min-width: 60px;
          line-height: 37px;
          white-space: nowrap;
          cursor: pointer;

          .border-bottom {
            height: 3px;
            width: 50%;
            background: transparent;
            margin: 0 auto;
          }
        }

        .li:hover {
          .text {
            color: rgb(255, 92, 0);
          }

          .border-bottom {
            background: rgb(255, 92, 0);
          }
        }

        .li-selected {
          .text {
            color: rgb(255, 92, 0);
          }

          .border-bottom {
            background: rgb(255, 92, 0);
          }
        }
      }

      .button {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 16px;
        justify-content: flex-end;

        .release {
          padding: 10px 15px;
          color: #fff;
          background: rgb(255, 92, 0);
          border-radius: 4px;
          cursor: pointer;
          margin-right: 15px;
        }

        .login {
          padding: 10px 30px;
          color: rgb(255, 92, 0);
          border: 1px solid rgb(255, 92, 0);
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }

  .bottom {
    height: 60px;
  }
}
</style>
