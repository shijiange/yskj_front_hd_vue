<template>
    <section>
        <!--<el-row>-->
        <van-row>
            <!--<el-button type="primary" plain @click="previousPage()">奖项排行</el-button>-->
            <van-button color="#f15353" type="primary" plain @click="previousPage()">奖项排行</van-button>
        </van-row>
        <!--</el-row>-->
    </section>
</template>

<script>
import ranking from "./award_ranking";
export default ranking;
</script>

<style>

</style>
