<template>
	<div id="register">
		<c-title :hide="false" :text="protocol_title || '协议'"></c-title>
		<div id="a_content" v-html='protocol'></div>
	</div>
</template>

<script>
import register_agreement_controller from './register_agreement_controller';
export default register_agreement_controller;
</script>

<style>
  #a_content img {
    max-width: 100%;
    height: auto;
    display: inline-block;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  #agreement {
    height: 1.875rem;
    line-height: 1.875rem;

    .span {
      text-align: center;
      font-size: 20px;
    }
  }

  #lin {
    margin-bottom: 1.25rem;
  }

  margin-top: 0.625rem;
  width: 100%;

  #code {
    background: #ccc;
    padding: 0.1875rem 0.3125rem;
    border-radius: 0.1875rem;
  }

  h1 {
    color: #42b983;
  }

  .mint-button--large {
    margin-top: 0.625rem;
  }

  #bts {
    margin: auto 0.3125rem;

    .mint-button--default {
      background-color: #13ce66;
      color: #fff;
    }
  }

  .forget {
    color: #999;
    float: right;
  }
}
</style>