import React,{forwardRef,useImperativeHandle} from 'react'
import "./Carousel.css";
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.min.css'
import 'owl.carousel/dist/assets/owl.theme.default.min.css'
import { useRef } from 'react';
import { useState } from 'react';



let Carousel = forwardRef(({data,method},ref)=>{
    let [active, setactive] = useState(-1);


   
    useImperativeHandle(ref,()=>({
        active,setactive
    }))


    const carousel = useRef();

    // const next = ()=>{
    //     if(carousel.current){
    //         carousel.current.next();
    //     }
    // }

    // const prev = ()=>{
    //     if(carousel.current){
    //         carousel.current.prev();
    //     }
    // }

    return (
        <>
            <div className="maincarousel">
                <div className="carousel-inner">
                    <OwlCarousel
                    ref={carousel}
                    className="owl-theme"
                    items="3"
                    loop
                    >
                        {data && data.map((element,index)=>(
                            <div key={index+1}
                            className={active===index+1?'cactive categorycarousel':'categorycarousel'}
                            onClick={()=>{
                                setactive(index+1);
                                method(element.name);
                            }}
                            >
                                <p>{element.name}</p>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
            </div>
        </>
    )
});

export default Carousel
