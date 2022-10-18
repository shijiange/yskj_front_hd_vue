<template>

	<div id="mobileBinding" :class="'rechargeRecord'+$store.state.service.lang">

		<c-title :hide="false" :text='language.title'></c-title>

		<div class="main">
			<ul @click="goTelephone(item.thatphone)" v-for='(item,i) in phone' :key='i'>
				<li>{{item.thatphone}}</li>
				<li>{{item.info}}</li>
			</ul>

		</div>
		<div id="submits">
			
			<button type="button" @click="goSubmit"><i class="iconfont icon-life-game-plus"></i> <!--<i class="el-icon-plus"></i>-->{{language.btns}}</button>
		</div>
	</div>
</template>

<script>
import cTitle from 'components/title';

export default {
  components: {
    cTitle
  },
  data() {
    return {
      language: {},
      phone: [{thatphone:13751596693,info:'中国移动'},{thatphone:13951596693,info:'中国联通'}]
    };
  },
  methods: {
    goSubmit() {
      this.$prompt('请输入手机号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^1(3|5|7|8|9)[0-9]{9}$/,
        inputErrorMessage: '手机格式不正确'
      }).then(({value}) => {
        this.phone.push({thatphone:value,info:''});
      }).catch(() => {
        //					this.$message({
        //						type: 'info',
        //						message: '取消输入'
        //					});
      });
    },
    goTelephone(n) {
      this.$router.push(this.fun.getUrl('telephone', {phone: n}));
    }
  },
  //实时监测this.$store.state.service.chinese的变化，获取最新的语言包
  computed: {
    getLangState() {
      return this.$store.state.service.languageService;
    }
  },
  watch: {
    getLangState(val) {
      if(val) {
        this.language = JSON.parse(sessionStorage.languageService).telephone;
      } else {
        this.language = this.$store.state.service.languageService.telephone;
      }
    }
  },

  mounted() {
    if(sessionStorage.languageService) {
      this.language = JSON.parse(sessionStorage.languageService).telephone;
    } else {
      this.language = this.$store.state.service.languageService.telephone;
    }
  },

  activated() {
    this.$store.commit('onload');
  },

};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #mobileBinding {
    .main {
      background: #fff;
      margin-top: 0.625rem;

      ul {
        display: flex;
        border-bottom: 0.0625rem solid #ebebeb;

        li {
          flex: 5;
          line-height: 2.75rem;
          text-align: left;
          padding: 0 0.875rem;
          font-size: 16px;
        }

        li:last-child {
          text-align: right;
        }
      }
    }

    #submits {
      display: flex;
      position: fixed;
      justify-content: center;
      bottom: 0;
      width: 100%;
      background: #f15353;

      button {
        font-size: 16px;
        color: #fff;
        line-height: 2.8125rem;
        outline: 0;
        border: 0;
        width: 100%;
      }

      i {
        color: #fff;
        margin-right: 0.625rem;
      }
    }
  }
</style>-->