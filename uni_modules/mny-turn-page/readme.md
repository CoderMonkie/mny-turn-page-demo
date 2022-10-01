# mny-turn-page

3D效果的图片翻页组件，上下滑动实现前后立体翻页

## API

### Properties

|Field|Type|Required|Default|Remark|
|--|--|--|--|--|
|width|Number/String|yes|-|需要设宽度，Number时默认使用rpx单位|
|height|Number/String|yes|-|需要设高度，Number时默认使用rpx单位|
|resource|Array[Object]|yes|-|资源,格式为对象数组，含图片地址属性可指定属性名@see srcKey，需要设置展示用的图片|
|srcKey|String|-|"src"|图片地址的属性名|
|recyle|Boolean|-|false|是否可循环翻页|
|duration|String|-|-|单次动画的时长，单位毫秒|

### Events

|Event|Paramers|Remark|
|--|--|--|
|change|(item:Object, index:Number)|接收两个参数，当前项和下标|

## Usage

```vue
<mny-turn-page
    :width="440"
    :height="220"
    :resource="state.list"
    :recyle="true"
    :duration="400"
    src-key="img"
    class="tp-images"
></mny-turn-page>
```

Demo

![demo](./static/image/221001095323.gif "demo")

```vue
<template>
  <view class="mny-turn-page__demo">
    <view class="text-xl uni-pa-6">
      <label for="">示例图片来源：</label>
      <uni-link href="https://pixabay.com/">https://pixabay.com/</uni-link>
    </view>
    <view class="image-container">
      <image
        lazy-load="true"
        @error="onImageError(item)"
        src="/static/calendar.png"
        class="image-bg"
        style="width: 700rpx; height: 400rpx; background-color: #eeeeee"
      />
      <mny-turn-page
        :width="440"
        :height="220"
        :resource="state.list"
        :recyle="true"
        :duration="400"
        src-key="img"
        class="tp-images"
      ></mny-turn-page>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";

const state = reactive({
  list: [
    {
      img: "https://cdn.pixabay.com/photo/2022/05/21/09/30/cat-7211080_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2014/04/13/20/49/cat-323262_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736877_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2022/01/24/21/22/snail-6964793_960_720.jpg",
    },
    {
      img: "https://cdn.pixabay.com/photo/2019/06/16/11/02/turtle-4277518_960_720.jpg",
    },
  ],
});
</script>

<style lang="scss" scoped>
.mny-turn-page__demo {
  .image-container {
    position: absolute;
    top: 400rpx;
    left: 20rpx;
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
    left: 120rpx;
    top: 40rpx;
  }
}
</style>
```
