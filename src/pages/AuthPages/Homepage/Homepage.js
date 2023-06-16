import { Carousel } from "antd";
import { Helmet } from "react-helmet-async";
import "./homepage.css";
import banner2 from "../../../component/img/banner.png";
import banner1 from "../../../component/img/banner2.jpg";
import movie from "../../../component/img/movie.jpg";
import ProductList from "../../../component/Product/ProductList";
import CardContainer from "../../../component/CardContainer";
import { Grid } from "@material-ui/core";
import en from "../../../component/languages/en.json";
import vi from "../../../component/languages/vi.json";
import { useContext } from "react";
import { Store } from "../../../Store";
export default function Homepage() {
  const { state } = useContext(Store);
  const banners = [banner1, banner2];
  const captions = ["Welcome to GameBay", "Join our subscription"];
  const language = state.language || "en";
  return (
    <div className="pb-50">
      <Helmet>
        <title> GameBay | Buy & Sell Games, Gift Cards & More </title>
      </Helmet>
      <Carousel autoplay>
        {banners.map((banner, index) => (
          <div className="carousel" key={index}>
            <img
              src={banner}
              alt={`Banner ${index + 1}`}
              className="carousel-image"
            />
            <div className="carousel-caption">
              <h3>{captions[index]}</h3>
            </div>
          </div>
        ))}
      </Carousel>

      <h2 className="content">
        {language === "en" ? en.popular_categories : vi.popular_categories}
      </h2>
      <Grid container className="mg-auto-80">
        <CardContainer
          title={language === "en" ? en.game_items : vi.game_items}
          img="https://gameflip.com/img/banners/category_ingame.png"
        />
        <CardContainer
          title={language === "en" ? en.gift_cards : vi.gift_cards}
          img="https://gameflip.com/img/banners/category_giftcards2.png"
        />
        <CardContainer
          title={language === "en" ? en.games : vi.games}
          img="https://gameflip.com/img/banners/category_games.png"
        />
        <CardContainer
          title={language === "en" ? en.movies : vi.movies}
          img={movie}
        />
      </Grid>
      <h2 className="content">
        {language === "en" ? en.game_items : vi.game_items}
      </h2>
      <Grid container className="mg-auto-80">
        <CardContainer
          title={language === "en" ? en.game_items : vi.game_items}
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/category_ingame.png"
        />
      </Grid>
      <h2 className="content">
        {language === "en" ? en.gaming_gift_cards : vi.gaming_gift_cards}
      </h2>
      <Grid container className="mg-auto-80">
        <CardContainer
          title="App Store"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_itunes.jpg"
        />
        <CardContainer
          title="Google Play"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_gplay.jpg"
        />
        <CardContainer
          title="Play Station"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_playstation.jpg"
        />
        <CardContainer
          title="X Box"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_xbox.jpg"
        />
        <CardContainer
          title="Steam"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_steam.jpg"
        />
        <CardContainer
          title="Nintendo"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_nintendo.jpg"
        />
        <CardContainer
          title="Roblox"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_roblox.png"
        />
        <CardContainer
          title="Riot Points"
          width="200px"
          height="200px"
          img="https://gameflip.com/img/banners/gc_riot.png"
        />
      </Grid>
      {/* <ProductList
        title="Sticker banner asdasfhhh1 203000"
        price="10.00"
        img={banner1}
      /> */}
    </div>
  );
}
