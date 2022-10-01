<template>
  <view class="mny-turn-page__demo">
    <view class="text-xl uni-pa-6"> 台历 2022 </view>
    <view class="image-container">
      <!-- <image
        lazy-load="true"
        @error="onImageError"
        src="/static/calendar_bg.png"
        class="image-bg"
        style="width: 750rpx; height: 420rpx"
      /> -->
      <mny-turn-page
        :width="660"
        :height="640"
        :resource="state.list"
        :recyle="true"
        :duration="400"
        class="tp-images"
        @change="onChange"
      ></mny-turn-page>
    </view>
    <view class="author uni-info uni-px-6">
      <text>maonianyou@foxmail.com</text>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  list: [],
});

const makeCalendar = () => {
  const list = [];
  for (let i = 0; i < 13; i++) {
    const name = i.toString().padStart(2, "0");
    list.push({ src: `/static/images/calendar_2022/${name}.jpg` });
  }
  state.list = list;
};

const onImageError = (e) => {
  console.log(e);
};

const onChange = (item, i) => {
  console.log("onChange - turn to page:", i, item);
};

makeCalendar();
</script>

<style lang="scss" scoped>
.mny-turn-page__demo {
  .image-container {
    position: absolute;
    top: 400rpx;
    left: 50rpx;
    transform: skew(-5deg, 2deg);
  }

  .image-bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -9999;
    /* display: none; */
  }
  .tp-images {
    position: absolute;
    left: 20rpx;
    top: 40rpx;
  }
}
</style>
