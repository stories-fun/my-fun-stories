"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

export const ImageSliderForStories = () => {
  return (
    <div className="relative w-full bg-[#F6F7F8]">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg"
      >
        {/* Replace these with your images */}
        <SwiperSlide>
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/images/profile.png"
              fill
              priority
              alt="Slide 1"
              className="rounded-lg object-contain"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/images/profile.png"
              fill
              priority
              alt="Slide 2"
              className="rounded-lg object-contain"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/images/profile.png"
              fill
              priority
              alt="Slide 3"
              className="rounded-lg object-contain"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
