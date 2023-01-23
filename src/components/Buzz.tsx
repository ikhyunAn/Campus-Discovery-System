import React from "react"

export default function Buzz() {
    return (
        <div className="buzz">
            {/* <div className="dot"></div> */}
            <img 
                src={require("../images/Buzz-Tickets.png")} 
                alt="Buzz Tickets"
                className="buzz--image"
            />
        </div>
    )
}