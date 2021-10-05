import React,{forwardRef,useImperativeHandle} from 'react'
import "./Carousel.css";
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.min.css'
import 'owl.carousel/dist/assets/owl.theme.default.min.css'
import { useRef } from 'react';
import { useState } from 'react';



let Carousel = forwardRef(({data,method, currenttag},ref)=>{
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
                    
                    {/* <div className="arrowleft" onClick={()=>{prev()}}>
                        <i className="fas fa-chevron-left"></i>
                    </div> */}
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
                    {/* <div className="arrowright" onClick={()=>{next()}}>
                        <i className="fas fa-chevron-right"></i>
                    </div> */}
                </div>
            </div>
        </>
    )
});

export default Carousel
