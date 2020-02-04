<template>
  <div style="position: relative;">
    <div id="map" style="position: relative;">
      <div class="buttons buttons_sp">
        <button class="btn" @click="reload()"><i class="material-icons">cached</i><span>位置更新</span></button>
        <button class="btn" @click="zoomInSearch()"><i class="material-icons">zoom_out</i><span>検索範囲大</span></button>
        <button class="btn" @click="zoomOutSearch()"><i class="material-icons">zoom_in</i><span>検索範囲小</span></button>
      </div>
      <GmapMap
        :center="center"
        :zoom="zoom"
        map-type-id="terrain"
        class="map"
      >
        <GmapMarker 
          :key="`first-${index}`"
          v-for="(m, index) in my_location"
          :position="m.position"
          :clickable="false"
          :dragable="false"
          :icon="my_icon"
        />
        <GmapMarker
          :key="`second-${index}`"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          :label="String(index+1)"
          @click="openInfoWindowTemplate(index)"
        />
        <gmap-info-window
          :options="infoOptions"
          :position="infoWindow.position"
          :opened="infoWindow.open"
          @closeclick="infoWindow.open=false">
          <div class="info" v-html="infoWindow.template"></div>
      </gmap-info-window>
      </GmapMap>
      <small class="sup">Supported by <a href="https://api.gnavi.co.jp/api/scope/" target="_blank">ぐるなびWebService</a></small>

    </div>
    <div class="contents">
      <div class="buttons buttons_pc">
        <button class="btn" @click="reload()"><i class="material-icons">cached</i><span>位置更新</span></button>
        <button class="btn" @click="zoomInSearch()"><i class="material-icons">zoom_out</i><span>検索範囲を広げる</span></button>
        <button class="btn" @click="zoomOutSearch()"><i class="material-icons">zoom_in</i><span>検索範囲を狭める</span></button>
      </div>
      <div class="cafes">
        <div v-for="(shop, index) in shops" :key="shop.id" class="shop_card">
          <h2>{{index+1}}. {{ shop.name }}</h2>
          <img :src="get_image(shop.image_url)">
          <div class="right_contents">
            <p class="open_title">営業時間</p>
            <p class="open">{{ shop.opentime }}</p>
            <p class="adress_title">場所</p>
            <p class="adress">{{ shop.address }}</p>
            <div class="buttons">
              <button @click="openInfoWindowTemplate(index)" class="btn to_map">場所を確認</button>
              <button class="btn to_site" @click="go_to_link(shop)">詳細を見る</button>
            </div>
          </div>
        </div>
        <div id="limit" class="more">
          <button @click="get_cafes()">
            <i class="material-icons">expand_more</i>
            <p>Read more</p>
          </button>
        </div>
      </div>

    </div>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoOptions: {
        maxWidth: 300,
        pixelOffset: {
          width: 0,
          height: -40
        }
      },
      infoWindow: {
        position: {lat: 0, lng: 0},
        open: false,
        template: ''
      },
      start: 1,
      my_icon: {
        url: require('@/assets/my_location.png'),
      },
      json: null,
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 16,
      range: 3,
      my_location: [],
      markers: [],
      shops: []
    }
  },
  methods: {
    openInfoWindowTemplate (index) {
      let shop = this.shops[index]
      let item = this.markers[index]
      let num = index+1
      this.infoWindow.template = "<h2>" + num + ". " + shop.name + "</h2>"
      this.infoWindow.position = item.position
      this.infoWindow.open = true
   },
    get_image(urls) {
      if(urls.shop_image1 != "") return urls.shop_image1
      else if(urls.shop_image2 != "") return urls.shop_image2
      else return require('@/assets/no_image.png')

    },
    go_to_link(shop) {
      window.open(shop.url, '_blank');
    },
    reload() {
      this.$router.go({path: this.$router.currentRoute.path, force: true})
    },
    zoomInSearch() {
      this.infoWindow.open = false
      if(this.range < 5) {
        this.range = this.range+1
        if(this.zoom > 0) this.zoom = this.zoom-1
      }
      this.start = 1
      this.markers = []
      this.shops = []
      this.get_cafes()
      document.getElementById("limit").style.display ="block";
    },
    zoomOutSearch() {
      this.infoWindow.open = false
      if(this.range > 1) {
        this.range = this.range-1
        this.zoom = this.zoom+1
      }
      this.start = 1
      this.markers = []
      this.shops = []
      this.get_cafes()
      document.getElementById("limit").style.display ="block";
    },
    get_cafes() {
      let url = "https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid="
        + process.env.VUE_APP_GURUNAVI_API_KEY
        + "&latitude=" + this.center.lat
        + "&longitude=" + this.center.lng
        + "&range=" + this.range
        + "&offset_page=" + this.start
        + "&freeword=" + "%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC,%E3%82%AB%E3%83%95%E3%82%A7,%E7%8F%88%E7%90%B2,%E5%96%AB%E8%8C%B6,%E5%96%AB%E8%8C%B6%E5%BA%97"
        + "&freeword_condition=2"

      // ぐるなびAPIを呼び出す
      this.$axios.get(url).then(

        //成功時の処理
        function(res){
          this.json = res.data.rest
          this.disp()
          this.start = this.start + 10
        }.bind(this),
        //失敗時の処理
        function(){
            // alert("Error")
            document.getElementById("limit").style.display ="none";
            return null
        }
      )
    },
    disp() {
      this.json.forEach(function( value ) {
        this.markers.push( {
          position: { lat: Number(value.latitude), lng: Number(value.longitude) },
          title: value.name
        })

        this.shops.push(value)
      }.bind(this))
    },
    get_here() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position){
            let coords = position.coords
            // 緯度経度だけ取得
            this.center.lat = Number(coords.latitude)
            this.center.lng = Number(coords.longitude)
            this.my_location = []
            this.my_location.push( { 
              position: {
                lat: this.center.lat,
                lng: this.center.lng
              },
              title: 'my_location'
            })

            this.get_cafes()

          }.bind(this),
          function(error) {
            switch (error.code) {
              case 1: //PERMISSION_DENIED
                alert('位置情報の利用が許可されていません')
                break
              case 2: //POSITION_UNAVAILABLE
                alert('現在位置が取得できませんでした')
                break
              case 3: //TIMEOUT
                alert('タイムアウトになりました')
                break
              default:
                alert('現在位置が取得できませんでした')
                break
            }
            // console.log(error)
          }
        );
      } else {
        // エラー処理を書く
      }
    }
  },
  created() {
    this.get_here()
  },
  mounted() {
    
  }
}
</script>

<style lang="scss">

.app {
  color: #494949;

  .info {
    h2 {
      font-size: 16px;
      margin: 0;
    }
  }

  .buttons {
    text-align: center;

    .btn {
      display: inline-block;
      text-align: center;
      color: white;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      transition: .4s;
      background-color: #5c4d4d;
      line-height: 38px;

      .material-icons {
        vertical-align: middle;
        display: inline-flex;
        padding-right: 3px;
      }
    }

    .btn:active {
      box-shadow: inset 0 0 2px rgba(128, 128, 128, 0.1);
      transform: translateY(2px);
    }
  }

    #map {
      padding: 10px;
      display: inline-block;
      box-sizing: border-box;
    }

    .contents {
      display: inline-block;
      box-sizing: border-box;
      padding: 10px;

      .cafes {
        @media screen and (min-width:768.1px) { 
          overflow: scroll;
          height: 80vh;
        }

        .more {
          text-align: center;
          margin: auto;
          
          button {
            height: 32px;
            vertical-align: middle;
            background-color: #5c4d4d;
            border-radius: 100px;
            position: relative;

            .material-icons {
              vertical-align: middle;
              padding: 4px;
              position: absolute;
              left: 8px;
              color: white;
            }
            p {
              color: white;
              display: inline-block;
              font-size: 16px;
              padding-right: 20px;
              padding-left: 36px;
              margin: 0;
              line-height: 32px;
            }
          }

          button:active {
            box-shadow: inset 0 0 2px rgba(128, 128, 128, 0.1);
            transform: translateY(2px);
          }
        }


        .shop_card {
          background-color: white;
          margin: 10px;

          h2 {
            padding: 10px;
            margin: 0;
            font-size: 20px;
          }

          img {
            vertical-align: top;
            box-sizing: border-box;
            padding-left: 10px;
            padding-right: 10px;
            padding-bottom: 10px;
            display: inline-block;
            object-fit: cover;

            @media screen and (min-width:768.1px){
              width: 30%;
              height: 180px;
            }

            @media screen and (min-width:426px) and ( max-width:768px) {
              width: 30%;
              height: 200px;
            }

            @media screen and (max-width:425px){
              width: 100%;
              height: 180px;
            }

          }
          .right_contents {
            box-sizing: border-box;
            padding-right: 10px;
            display: inline-block;

            @media screen and (max-width:425px){
              padding-left: 10px;
            }

            .buttons {
              margin: 10px 0;
              box-sizing: border-box;
            }

            .btn {
              width: 100px;
              vertical-align: bottom;
              display: inline-block;
              line-height: 28px;
              border: solid 2px #494949;
              background-color: white;
              color: #494949;
              padding: 4px 8px;
              border-radius: 4px;
              margin: 0 10px;
              font-size: 16px;
              bottom: 10px;
            }

            .to_map {
              right: 240px;
            }
            .to_site {
              right: 70px;
            }

            @media screen and (min-width:426px) {
              width: 70%;
              p { margin: 0; }
              .open_title, .adress_title {
                width: 64px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                display: inline-block;
                padding: 2px 6px;
                margin-bottom: 4px;
                border-radius: 4px;
                background-color: rgb(245, 179, 54);
                color: white;
              }
              .open, .adress {
                font-size: 14px;
                margin-bottom: 3px;
              }
            }

            @media screen and (max-width:425px){
              width: 100%;
              p { margin: 0; }
              .open_title, .adress_title {
                width: 64px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                display: inline-block;
                padding: 2px 6px;
                margin-bottom: 4px;
                border-radius: 4px;
                background-color: rgb(245, 179, 54);
                color: white;
              }
              .open, .adress {
                font-size: 14px;
                margin-bottom: 3px;
              }
            }
          }
        }
      }
    }

  @media screen and (max-width:768px) { 

    #map {
      width: 100%;

      .map {
        width: 100%;
        height: 50vh;
      }

      .buttons {
        .btn {
          width: 30%;
          max-width: 120px;
          height: 40px;
          margin: 10px 1% 20px 1%;
          
          max-width: 180px;
          border: 2px solid white;


          @media screen and (max-width:375px) {
            font-size: 12px;
          }
        }

        
      }
    }

    .contents {
      width: 100%;

      .buttons_pc {
        display: none;
      }
    }
  }

  @media screen and (min-width:768.1px) {
    

    #map {
      width: 50%;
      position: absolute;
      padding-right: 5px;


      .map {
        height: 88vh;
      }

      .buttons_sp {
        display: none;
      }
    }

    .contents {
      width: 50%;
      padding-left: 5px;
      position: absolute;
      right: 0;

      .buttons {
        .btn {
          margin: 10px 18px 10px 18px;
          height: 40px;
          width: 120px;
        }
      }
    }
  }
}

.sup {
  position: absolute;
  bottom: 9px;
  left: 84px;
  font-size: 10px;
  text-align: right;
  a, a:visited {
    color: #494949;
    text-decoration: none;
  }
}
@media screen and (max-width:768px) { 
.sup {
    left: 45px;
    font-size: 12px;
    transform: scale(0.6);
    line-height: 10px;
  }
}

</style>