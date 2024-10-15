import React from "react"
import Slider from "react-slick"
import { Image } from "antd"

const SliderComponent = ({ arrImage }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  }
  return (
    <Slider {...settings}>
      {arrImage.map((image) => {
        return (
          <Image key={image} src={image} alt="slide" preview={false} width="100%" height="380px" />
        )
      })}
    </Slider>
  )
}

export default SliderComponent
