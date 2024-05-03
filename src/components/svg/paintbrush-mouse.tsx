import { useEffect, useRef } from "react";
import Position from "@/useful/interfaces/position";

interface PaintbrushInterface {
    color: string,
    initialPosition: Position
}

const PaintbrushMouse = ({ color, initialPosition }: PaintbrushInterface) => {

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {

        const divider = 2;

        // init position before event
        if (svgRef.current != null) {
            svgRef.current.style.left = `${initialPosition.x - (svgRef.current.clientWidth / divider)}px`;
            svgRef.current.style.top = `${initialPosition.y - (svgRef.current.clientHeight / divider)}px`;
        }

        const handleMouseMove = (event: MouseEvent) => {
            if (svgRef.current) {
                svgRef.current.style.left = `${event.clientX - (svgRef.current.clientWidth / divider)}px`;
                svgRef.current.style.top = `${event.clientY - (svgRef.current.clientHeight / divider)}px`;
            }
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <svg
          ref={ svgRef }
          style={{ 
            rotate: "-30deg", 
            position: "absolute", 
            pointerEvents: "none",
            zIndex: 101
          }}
          version="1.1"
          id="Paintbrush_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 64 64"
          className="h-20"
          xmlSpace="preserve"
        >
            <style>{`.st0{fill:#E0E0D1;} .st1{fill:#4F5D73;} .st2{opacity:0.2;fill:#231F20;} .st3{fill:#E0995E;} .st4{fill:#FFFFFF;} .st5{fill:${color};}`}</style>
            <path className="st1" d="M47,36c0,1.1-0.9,2-2,2H19c-1.1,0-2-0.9-2-2V14c0-1.1,0.9-2,2-2h26c1.1,0,2,0.9,2,2V36z" />
            <path className="st2" d="M17,36c0,0,0,0.9,0,2v2c0,1.1,0.9,2,2,2h7c0,0,3,0,3,3c0,4.2-0.8,6.3-1,6.8c0,0,0,0.1-0.1,0.1c0,0,0,0,0,0h0 c-0.2,0.5-0.3,1-0.3,1.6c0,2.4,2,4.4,4.4,4.4c2.4,0,4.4-2,4.4-4.4c0-0.6-0.1-1.1-0.3-1.6h0c0,0,0,0,0,0c0,0,0-0.1-0.1-0.1 c-0.2-0.6-1-2.6-1-6.8c0,0,0-3,3-3h7c1.1,0,2-0.9,2-2v-2c0-1.1,0-2,0-2H17z" />
            <path className="st3" d="M17,34c0,0,0,0.9,0,2v2c0,1.1,0.9,2,2,2h7c0,0,3,0,3,3c0,4.2-0.8,6.3-1,6.8c0,0,0,0.1-0.1,0.1c0,0,0,0,0,0h0 c-0.2,0.5-0.3,1-0.3,1.6c0,2.4,2,4.4,4.4,4.4c2.4,0,4.4-2,4.4-4.4c0-0.6-0.1-1.1-0.3-1.6h0c0,0,0,0,0,0c0,0,0-0.1-0.1-0.1 c-0.2-0.6-1-2.6-1-6.8c0,0,0-3,3-3h7c1.1,0,2-0.9,2-2v-2c0-1.1,0-2,0-2H17z" />
            <rect x="17" y="31" className="st2" width="30" height="6" />
            <rect x="17" y="29" className="st4" width="30" height="6" />
            <path
              className="st2"
              d="M45,14H19c-1.1,0-2,0.9-2,2v4v4c0,1.1,0,2,0,2h13.5c0.8,0,1.5,0.7,1.5,1.5s0.7,1.5,1.5,1.5 c0.8,0,1.5-0.7,1.5-1.5s0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5v3c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5v-3 c0-0.8,0.7-1.5,1.5-1.5c0.8,0,1.5,0.7,1.5,1.5v1c0,0.8,0.7,1.5,1.5,1.5c0.8,0,1.5-0.7,1.5-1.5V24v-1.5V20v-4C47,14.9,46.1,14,45,14z"
            />
            <path className="st5" d="M47,26.5c0,0.8-0.7,1.5-1.5,1.5l0,0c-0.8,0-1.5-0.7-1.5-1.5v-6c0-0.8,0.7-1.5,1.5-1.5l0,0 c0.8,0,1.5,0.7,1.5,1.5V26.5z" />
            <path className="st5" d="M41,28.5c0,0.8-0.7,1.5-1.5,1.5l0,0c-0.8,0-1.5-0.7-1.5-1.5v-6c0-0.8,0.7-1.5,1.5-1.5l0,0 c0.8,0,1.5,0.7,1.5,1.5V28.5z" />
            <path className="st5" d="M44,21c0,0.8-0.7,1.5-1.5,1.5V23c-0.8,0-1.5-1.2-1.5-2v4.5c0-0.8,0.7-1.5,1.5-1.5l0,0 c0.8,0,1.5,0.7,1.5,1.5V21z" />
            <path className="st5" d="M35,25.5c0,0.8-0.7,1.5-1.5,1.5l0,0c-0.8,0-1.5-0.7-1.5-1.5v-6c0-0.8,0.7-1.5,1.5-1.5l0,0 c0.8,0,1.5,0.7,1.5,1.5V25.5z" />
            <path className="st5" d="M38,21c0,0.8-0.7,1.5-1.5,1.5V23c-0.8,0-1.5-1.2-1.5-2v4.5c0-0.8,0.7-1.5,1.5-1.5l0,0 c0.8,0,1.5,0.7,1.5,1.5V21z" />
            <path className="st5" d="M32,21c0,0.8-0.7,1.5-1.5,1.5V23c-0.8,0,0-1.2,0-2v2c0-0.8-0.8,1,0,1l0,0c0.8,0,1.5,0.7,1.5,1.5V21z" />
            <g>
              <path className="st5" d="M47,14c0-1.1-0.9-2-2-2H19c-1.1,0-2,0.9-2,2v4h30V14z" />
              <path className="st5" d="M17,14v8c0,1.1,0,2,0,2h28c1.1,0,2-0.9,2-2v-4L17,14z" />
            </g>
        </svg>
    );
}

export default PaintbrushMouse;