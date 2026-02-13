import { memo } from "react";

function Background(){

    return (
        <div className="background">
          <span className="topShadow"></span>
          <video src="/homeBg.mp4" muted autoPlay loop />
          <span className="bottomShadow"></span>
        </div>
    )

}

export default memo(Background);