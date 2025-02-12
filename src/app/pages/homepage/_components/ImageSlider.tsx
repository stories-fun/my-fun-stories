"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

export const ImageSlider = () => {
  return (
    <div className="w-full bg-[#F6F7F8] sm:h-[360px] sm:w-[640px]">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg"
      >
        {/* Replace these with your images */}
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            width={640}
            height={360}
            alt="Slide 1"
            className="h-auto w-full object-cover sm:h-[360px] sm:w-[640px]"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            width={640}
            height={360}
            alt="Slide 2"
            className="h-auto w-full object-cover sm:h-[360px] sm:w-[640px]"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/images/profile.png"
            width={640}
            height={360}
            alt="Slide 3"
            className="h-auto w-full object-cover sm:h-[360px] sm:w-[640px]"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
