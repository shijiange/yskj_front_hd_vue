<template>
  <div id="modifyContacts" :class="'modifyContacts'+$store.state.service.lang">
    <c-title :hide="false" :text="language.title"></c-title>

    <ul class="content">
      <li><label>{{language.name}}</label> <input type="text" :placeholder="language.placeNameTip" v-model="name"/></li>
      <li><label>{{language.tele}}</label> <input type="number" :placeholder="language.placeTeleTip" v-model="tele"/>
      </li>
    </ul>
    <div class="red">！注：电话号码不能带"-"</div>
    <button class="btn" @click="confirm">{{language.btn}}</button>


  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {
    return {
      language: {},
      tele: "",
      name: ""
    };
  },
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    }
  },
  watch: {
    getLangState(val) {
      if (val) {
        this.language = JSON.parse(sessionStorage.languageService).modifyContacts;
      } else {
        this.language = this.$store.state.service.languageService.modifyContacts;
      }
    }
  },
  methods: {
    confirm() {
      if (this.tele != "" && this.name) {

        let jsons = { tele: this.tele, name: this.name };
        localStorage.setItem("linkman", JSON.stringify(jsons));
        //				this.$router.push(this.fun.getUrl('addOrder'));
        this.$router.go(-1);
      } else {
        this.$dialog.alert({ message: "请填写正确的信息" });
      }

    }
  },
  mounted() {
    if (sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).modifyContacts;
    } else {
      this.language = this.$store.state.service.languageService.modifyContacts;
    }
  },

  activated() {
    if (localStorage.getItem("linkman")) {
      let linkman = JSON.parse(localStorage.getItem("linkman"));
      this.tele = linkman.tele;
      this.name = linkman.name;
    }
    this.$store.commit("onload");
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .modifyContactsch {
    .content {
      margin-top: 0.625rem;
      background-color: #fff;
      padding-left: 0.875rem;
      font-size: 16px;

      li:last-child {
        border: none;
      }

      li {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding-right: 0.875rem;
        background: #fff;
        text-align: left;
        border-bottom: solid 0.0625rem #ebebeb;

        label {
          width: 6.25rem;
          float: left;
          text-align: left;
        }

        i {
          font-size: 25px;
          float: right;
        }

        input {
          border: 0;
          outline: 0;
          float: left;
          height: 2.8125rem;
        }
      }
    }

    .btn {
      width: 90%;
      height: 2.875rem;
      line-height: 2.875rem;
      display: block;
      margin: 1.25rem auto;
      border: none;
      -webkit-border-radius: 0.375rem;
      -moz-border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: #f15353;
      color: #fff;
      font-size: 16px;
      margin-top: 1.25rem;
    }

    .red {
      line-height: 1.875rem;
      background-color: #fafafa;
      color: #8c8c8c;
      text-align: left;
      padding: 0 0.875rem;
    }
  }

  .modifyContactswei {
    .content {
      li {
        height: 2.8125rem;
        line-height: 2.8125rem;
        padding: 0 0.9375rem;
        margin-top: 0.625rem;
        background: #fff;
        text-align: right;

        label {
          width: 26%;
          float: right;
          text-align: right;
        }

        i {
          font-size: 25px;
          float: left;
        }

        input {
          border: 0;
          outline: 0;
          float: right;
          width: 74%;
          height: 2.5rem;
        }
      }
    }

    .btn {
      width: 80%;
      height: 2.5rem;
      line-height: 2.5rem;
      border: 0.0625rem solid #dfdfdf;
      display: block;
      margin: 0.625rem auto;
      -webkit-border-radius: 0.375rem;
      -moz-border-radius: 0.375rem;
      border-radius: 0.375rem;
      background: #ff951b;
      color: #fff;
      font-size: 16px;
      margin-top: 1.875rem;
    }
  }

</style>