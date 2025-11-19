# Material Tester

A simple tool to visually test 3D material properties (roughness, metalness, color) with Three.js and React.

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm dev
```

Opens the app in your browser. You can adjust the central material properties with the sliders, or load a predefined preset. The left and right spheres are there for reference comparison.

## Features

- Real-time adjustment of roughness, metalness and color
- Material presets (mirror, chrome, gold, copper, plastic, wood, etc.)
- Interactive 3D view with camera controls
- Comparison spheres to visualize differences

## Stack

- React
- Three.js (via @react-three/fiber)
- TypeScript
- Vite
