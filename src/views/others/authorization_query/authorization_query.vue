<template>
  <div id="query">

    <c-title :hide="false" text="芸众商城授权查询"></c-title>

    <div class="ban">
      <img src="../../../assets/images/sq_banner.png" alt="">
    </div>

    <div class="query_form">

      <div class="title">
        <div class="block"></div>
        <span>授权查询</span>
      </div>

      <div class="main">
        
        <div class="domain_name">
          <span>您的域名:</span>
          <van-field
              class="name"
              v-model.trim="domain_name"
              center
              clearable
              placeholder="请输入域名，不带http://或者https://"
            />
        </div>
        <div class="domain_name">
          <span>站点Key:</span>
          <van-field
              class="name"
              v-model.trim="app_key"
              center
              clearable
              placeholder="请输入站点的key信息"
            />
        </div>
        <div class="btn">
          <button class="query_btn" @click="queryBtn">立即查询</button>
        </div>
      </div>
    </div>

    <div class="result" v-show="result">

      <div class="title">
        <div class="block"></div>
        <span>查询结果</span>
      </div>

      <span>站点域名：{{domain_name}}</span>

      <div class="content">
        <div class="cont_title">已授权应用</div>
        <p style="margin: 1rem 0;">1.{{app_name}}</p>
        <div class="cont_title">已授权插件</div>

        <div class="plugins" v-for="(item,index) in plugin_class" :key="index"> 
          {{index+1}}、{{item.category_name}}
          <b>(已授权{{item.count}}个)</b>
          :
          <span v-for="(v,i) in item.plugin" :key="i">{{v.title}}
          <span v-if="i < item.plugin.length -1">、</span>
          <span v-else>;</span>
          </span>
        </div>
      </div>
    </div>

    <div class="tip">
      <div class="title">
        <div class="block"></div>
        <span>如何查看站点</span>
      </div>

      <span>登录商城后台-进入任意平台管理页面，点击右上角-商城授权即可查看！</span>
      <p class="ps">ps：必须使用总管理员账号才能查看！</p> 
      <img style="width: 22rem; height: 10rem;" src="../../../assets/images/guide.png" alt="">

      <div class="title">
        <div class="block"></div>
        <span>关于授权？</span>
      </div>

      <div class="message_a">
        <p>芸众商城系统按域名授权，授权后您将获得芸众商城系统合法的
        使用权，避免后期版权纠纷。</p>
        <b>芸众商城系统授权包含应用授权、插件授权两部分，使用未授权
        的芸众商城系统应用或者插件都不具备合法性！</b>
        <span>芸众科技保留对
        其使用系统停止升级、关闭、甚至对其媒体曝光和追究法律责任
        的起诉权利。</span>
      </div>

      <div class="title">
        <div class="block"></div>
        <span>部分法规</span>
      </div>

      <div class="message_b">
        <p>我国《中华人民共和国刑法》第二百一十七条规定： 以营利为
        目的，有下列侵犯著作权情形之一，违法所得数额较大或者有
        其他严重情节的，处三年以下有期徒刑或者拘役，并处或者单
        处罚金；违法所得数额巨大或者有其他特别严重情节的，处三
        年以上七年以下有期徒刑，并处罚金：</p>
        <p>（一）未经著作权人许可，复制发行其文字作品、音乐、
        电影、电视、录像作品、计算机软件及其他作品的；</p>
        <p>（二）出版他人享有专有出版权的图书的；</p>
        <p>（三）未经录音录像制作者许可，复制发行其制作的录
        音录像的；</p>
        <p>（四）制作、出售假冒他人署名的美术作品的。</p>
      </div>

      <div class="title">
        <div class="block"></div>
        <span>联系芸众</span>
      </div>

      <div class="lx_code">
      <img src="../../../assets/images/lxewm.png" alt="">
      </div>
    </div>

    
  </div>
</template>

<script>
import authorization_query_controller from './authorization_query_controller';
export default authorization_query_controller ;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#query {
  .ban {
    height: 10rem;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .query_form {
    margin: 1rem 1rem;

    .main {
      margin: 2rem 0 2rem 0;

      .domain_name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2rem;
        margin-bottom: 1rem;

        span {
          flex: 1;
          font-weight: 700;
        }

        .name {
          width: 17rem;
          height: 2rem;
          line-height: 2rem;
          border: solid 1px #2973fd;
          border-radius: 1rem;
          padding-left: 0.5rem;
        }
      }

      .btn {
        text-align: center;

        button {
          width: 17rem;
          height: 2rem;
          font-size: 1rem;
          border-radius: 1.875rem;
        }

        .query_btn {
          background: #2973fd;
          color: #fff;
          border: none;
        }
      }
    }
  }

  .title {
    height: 2.5rem;
    line-height: 2.5rem;
    display: flex;
    align-items: center;

    .block {
      width: 0.25rem;
      height: 1rem;
      background: #50a6f9;
      border-radius: 0.0625rem;
      margin-right: 0.375rem;
    }

    span {
      font-weight: 700;
      font-size: 1rem;
    }
  }

  .tip {
    margin: 0 1rem 2rem 1rem;
    text-align: left;

    .ps {
      color: #f21f1f;
      margin: 1rem 0;
    }

    .message_b {
      p {
        font-weight: 700;
      }
    }

    .lx_code {
      text-align: center;

      img {
        width: 6rem;
        height: 6rem;
      }
    }
  }

  .result {
    margin: 0 1rem 0 1rem;
    text-align: left;

    .content {
      margin: 1rem;

      .plugins {
        margin: 1rem 0;

        b {
          color: #2973fd;
        }
      }

      .cont_title {
        color: #2973fd;
        font-weight: 700;
      }
    }
  }
}
</style>