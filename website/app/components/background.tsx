import { memo } from "react";
import Image from "next/image";

function Background(){

    return (
        <div className="background">
          <span className="topShadow"></span>
          <video src="/homeBg.mp4" muted autoPlay loop />
          {/* <Image
                src="/homeBg.gif"
                alt="Logo"
                width={500}
                height={500}
                priority
            /> */}
          <span className="bottomShadow"></span>
        </div>
    )

}

export default memo(Background);