import React from 'react';
import video from "../static/imagesVideos/homeVideo.mp4"
import '../static/css/BGVideo.css'

const BGVideo = () => {
    return (
        <video controls autoPlay loop muted>
        <source src={video} type="video/mp4"/>
        <p>Your browser does not support the video tag.</p>
    </video>
    )
};

export default BGVideo;