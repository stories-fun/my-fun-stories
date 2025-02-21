"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

// sm:h-[360px] sm:w-[640px]
export const ImageSlider = () => {
  return (
    <div className="h-full w-full bg-[#F6F7F8]">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-full w-full rounded-lg"
      >
        {/* Replace these with your images */}
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            alt="Slide 1"
            className="object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            alt="Slide 2"
            className="object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            alt="Slide 3"
            className="object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
