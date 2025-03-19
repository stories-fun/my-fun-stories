"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

export const ImageSlider = () => {
  return (
    <div className="h-full w-full bg-[#F6F7F8]">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-full w-full rounded-lg"
      >
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            priority
            alt="Slide 1"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            alt="Slide 2"
            className="overflow-hidden object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            fill
            alt="Slide 3"
            className="overflow-hidden object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
