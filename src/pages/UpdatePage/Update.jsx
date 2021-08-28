import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import "./Update.css";

function Update() {
    let [hide,sethide] = useState(true);

    useEffect(()=>{
        setTimeout(()=>{
            sethide(true);
        },50000);
    },[]);
    return (
        <div className={`updatepage ${hide ?"hide":""}`}>
            <marquee behavior="scroll" direction="left" scrollamount="16">Feature Update! Now, you can mark your solved problems & have it in your profile section.</marquee>
        </div>
    )
}

export default Update
