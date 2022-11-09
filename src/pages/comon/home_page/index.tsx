import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import './index.css'
import img from './../../../assets/images/food.jpg'
import img2 from './../../../assets/images/dood2.jpg'
import Title from '../../../shared/components/primary_title';
import ButtonPrimary from '../../../shared/components/buttom_primary';
import { Link } from 'react-router-dom';
import { RoutesConstants } from '../../../helpers/routes_constants';


const Home = () => {
  return (
    <>
      <div className='slide'>
        <Swiper
          className='w-100 h-100'
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <img src={img} alt="" className='h-100 w-100' />
          </SwiperSlide>
          <SwiperSlide><img src={img} alt="" className='h-100 w-100' /></SwiperSlide>
          <SwiperSlide><img src={img2} alt="" className=' h-100 w-100' /></SwiperSlide>
          <SwiperSlide><img src={img} alt="" className=' h-100 w-100' /></SwiperSlide>
        </Swiper>
      </div>
      <div className="body container py-4">
        <div className="info">
          <Title text='Visão geral' />
          <div className="row justify-content-center">
            <div className="col-lg-10 text-secondary pt-3 pb-2">
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusantium ut tenetur molestiae ex,
                consequuntur facilis sequi amet et pariatur impedit voluptatum deleniti eaque repudiandae, consectetur nam magni,
                asperiores minus! Perferendis!
              </p>
            </div>
              <div className="text-center">
                <Link to={RoutesConstants.homeSearch} className='btn btn-outline-danger rounded-0'>Começar a busca</Link>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home