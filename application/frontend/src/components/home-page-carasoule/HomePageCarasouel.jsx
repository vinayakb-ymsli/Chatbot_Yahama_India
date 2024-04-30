import React from "react";
import Carousel from "react-bootstrap/Carousel";
import carasouelImage1 from "./../../assets/2023_RMAX2_XT-R_MNYS1_AUS_STA_012_1920x600.jpg";
import carasouelImage2 from "./../../assets/FX_LIMITED_SVHO.jpg";
import carasouelImage3 from "./../../assets/G29-E_DR2_AC_Bluestone_ACT_006_1920x600.jpg";
import carasouelImage4 from "./../../assets/2022_YZF-R1M_BWM2_AUS_ACT_006_v2_1920x600.jpg";

const HomePageCarasouel = () => {
  const carouselImages = [
    carasouelImage4,
    carasouelImage1,
    carasouelImage2,
    carasouelImage3,
  ];

  return (
    <Carousel controls={false}>
      {carouselImages?.map((carasouelImage, index) => (
        <Carousel.Item
          interval={2000}
          // itemId={index + 1}
          key={index}
          style={{ height: "calc(100vh - 5rem)" }}
          // className="carousel-image"
        >
          <img
            src={carasouelImage}
            className="d-block w-100 h-100"
            alt={`carasoul${index}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HomePageCarasouel;
