import React from "react";
import Particles from "react-particles";
import { loadFirePreset } from "tsparticles-preset-fire";

const ParticleBackground = React.memo(function ParticleBackground() {
  const customInit = async (engine) => {
    await loadFirePreset(engine);
  };

  const options = {
    preset: "fire",
    fpsLimit: 40,
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
        },
      },
      color: {
        value: [
          "#fdcf58",
          "#757676",
          "#f27d0c",
          "#800909",
          "#f07f13",
          "#ff0000",
          "#0000ff",
          "#00ff00",
        ],
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 6,
        random: false,
      },
    },
    background: {
      image: "radial-gradient(#fff, #000)",
    },
  };

  return <Particles options={options} init={customInit} />;
});

export default ParticleBackground;
