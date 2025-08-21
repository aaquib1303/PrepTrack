import React from "react";

const Navbar= ()=>{
    return (
        <>
            <div className="back bg-purple-400 flex justify-between p-5">
                <div className="title">
                    PrepTrack
                </div>
                <div className="navs flex gap-6">
                    <div className="home">Home</div>
                    <div className="product">Product</div>
                    <div className="services">Services</div>
                    <div className="about">About</div>
                </div>
                <div className="buttons flex gap-3">
                    <button className="login bg-blue-600 px-3 py-1 rounded border-white border-solid border-2">Login</button>
                    <button className="reg bg-blue-600 px-3 py-1 rounded  border-white border-solid border-2">Register</button>
                </div>
            </div>
        </>
    )
}

export default Navbar;