import React from "react";
import { Composition } from "remotion";
import { RRTrailer } from "./Trailer";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="RRTrailer"
      component={RRTrailer}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
