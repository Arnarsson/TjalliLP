import React from "react";
import { Composition } from "remotion";
import { HeklaDashboard } from "./HeklaDashboard";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HeklaDashboard"
      component={HeklaDashboard}
      durationInFrames={300}
      fps={30}
      width={1440}
      height={900}
    />
  );
};
