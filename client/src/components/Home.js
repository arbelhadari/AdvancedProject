import React from 'react';
import '../static/css/home.css'
import video from "../static/imagesVideos/homeVideo.mp4"


const Home = () => {

    return (
        <>
            <video controls autoPlay loop muted>
                <source src={video} type="video/mp4"/>
                <p>Your browser does not support the video tag.</p>
            </video>
        </>
    )
};

export default Home;
