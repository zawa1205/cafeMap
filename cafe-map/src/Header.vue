<template>
<div class="image_mask">
  <div class="header_wrapper">
    <h1>近場カフェマップ</h1>
  </div>
</div>
</template>

<style lang="scss">
.image_mask {
  background-color: black;
}

.header_wrapper {
  height: 70px;
  color: rgb(47, 31, 10);
  background-image: url("./assets/header.jpg");
  background-color:rgba(255,255,255,0.5);
  background-blend-mode:lighten;

  
  h1 {
    font-family: Quicksand, 游ゴシック体, "Yu Gothic", YuGothic, "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
    font-weight: bold;
    font-size: 32px;
    text-align: center;
    margin: 0;
    line-height: 70px;
  }

  small {
    position: absolute;
    top: 42px;
    right: 10px;
    font-size: 10px;
    text-align: right;

    a, a:visited {
      color: #494949;
      text-decoration: none;
    }
  }

  @media screen and (max-width:768px) { 
    height: 50px;
    h1 {
      line-height: 50px;
      font-size: 20px;
    }
  }
}
</style>