import React from "react";
import { Composition } from "remotion";
import { HeklaDashboard } from "./HeklaDashboard";
import {
  HeklaDashboardMemory,
  HeklaDashboardAgents,
  HeklaDashboardPrivate,
} from "./FocusedViews";
import { MemoryScreen } from "./MemoryScreen";
import { AgentsScreen } from "./AgentsScreen";
import { PrivateScreen } from "./PrivateScreen";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeklaDashboard"
        component={HeklaDashboard}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="HeklaDashboardMemory"
        component={HeklaDashboardMemory}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="HeklaDashboardAgents"
        component={HeklaDashboardAgents}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="HeklaDashboardPrivate"
        component={HeklaDashboardPrivate}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="MemoryScreen"
        component={MemoryScreen}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="AgentsScreen"
        component={AgentsScreen}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
      <Composition
        id="PrivateScreen"
        component={PrivateScreen}
        durationInFrames={300}
        fps={30}
        width={1440}
        height={900}
      />
    </>
  );
};
