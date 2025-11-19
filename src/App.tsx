import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

// Presets for materials that are real
const MATERIAL_PRESETS = {
  mirror: { name: 'Mirror', roughness: 0.0, metalness: 1.0, color: '#ffffff' },
  chrome: { name: 'Polished Chrome', roughness: 0.1, metalness: 1.0, color: '#cccccc' },
  iron: { name: 'Iron', roughness: 0.4, metalness: 1.0, color: '#888888' },
  gold: { name: 'Gold', roughness: 0.2, metalness: 1.0, color: '#ffd700' },
  copper: { name: 'Copper', roughness: 0.3, metalness: 1.0, color: '#b87333' },
  plastic: { name: 'Brilliant Plastic', roughness: 0.5, metalness: 0.0, color: '#ff0000' },
  wood: { name: 'Varnished Wood', roughness: 0.7, metalness: 0.0, color: '#8b4513' },
  rubber: { name: 'Rubber', roughness: 0.9, metalness: 0.0, color: '#333333' },
  plaster: { name: 'Plaster', roughness: 1.0, metalness: 0.0, color: '#f5f5f5' },
  rust: { name: 'Rusty Metal', roughness: 0.8, metalness: 0.5, color: '#b7410e' },
} as const;

// Configuration of the optimal lighting to see the effects
const LIGHTING_CONFIG = {
  main: {
    position: [5, 5, 5] as [number, number, number],
    intensity: 2,
  },
  fill: {
    position: [-3, 2, -3] as [number, number, number],
    intensity: 0.5,
  },
  ambient: {
    intensity: 0.3,
  }
};

interface TestSphereProps {
  position: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  label?: string;
}

// Test sphere with label
const TestSphere = ({ position, color, roughness, metalness }: TestSphereProps) => {
  return (
    <group position={position}>
      <Sphere args={[1, 64, 64]}>
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
        />
      </Sphere>
    </group>
  );
};

// Floor to see the shadows
const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
  </mesh>
);

function MaterialTester() {
  // States for the controls
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.0);
  const [color, setColor] = useState('#ff5555');
  
  // States for comparison
  const [compareRoughness] = useState(0.0);
  const [compareMetalness] = useState(1.0);

  // Function to load a preset
  const loadPreset = (presetKey: keyof typeof MATERIAL_PRESETS) => {
    const preset = MATERIAL_PRESETS[presetKey];
    setRoughness(preset.roughness);
    setMetalness(preset.metalness);
    setColor(preset.color);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Control panel */}
      <div style={{
        width: '320px',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        overflowY: 'auto',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h2 style={{ marginTop: 0 }}>Material Tester</h2>
        
        {/* Main controls */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Central Sphere (Editable)</h3>
          
          {/* Roughness Slider */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Roughness: <strong>{roughness.toFixed(2)}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {roughness < 0.2 && '← Very smooth / shiny'}
              {roughness >= 0.2 && roughness < 0.5 && '← Moderately smooth'}
              {roughness >= 0.5 && roughness < 0.8 && '← Moderately rough'}
              {roughness >= 0.8 && '← Very rough / dull'}
            </div>
          </div>

          {/* Metalness Slider */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Metalness: <strong>{metalness.toFixed(2)}</strong>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
              {metalness < 0.1 && '← Dielectric (non-metal)'}
              {metalness >= 0.1 && metalness < 0.9 && '← Hybrid (rare physically)'}
              {metalness >= 0.9 && '← Pure metal'}
            </div>
          </div>

          {/* Color Picker */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '100%', height: '40px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: '30px' }}>
          <h3>Material Presets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(MATERIAL_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => loadPreset(key as keyof typeof MATERIAL_PRESETS)}
                style={{
                  padding: '10px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#333'}
              >
                <div style={{ fontWeight: 'bold' }}>{preset.name}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  R: {preset.roughness.toFixed(1)} | M: {preset.metalness.toFixed(1)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison spheres */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Comparison</h3>
          <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
            Left: Roughness {compareRoughness.toFixed(1)}, Metalness {compareMetalness.toFixed(1)}
            <br />
            Right: Roughness {(1 - compareRoughness).toFixed(1)}, Metalness {(1 - compareMetalness).toFixed(1)}
          </div>
        </div>

        {/* Legend */}
        <div style={{ 
          marginTop: '30px', 
          padding: '15px', 
          backgroundColor: '#2a2a2a', 
          borderRadius: '4px',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          <strong>Observation guide :</strong>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li><strong>Sharp reflections</strong> = Low roughness</li>
            <li><strong>Matte appearance</strong> = High roughness</li>
            <li><strong>White reflections</strong> = Metalness = 0</li>
            <li><strong>Colored reflections</strong> = Metalness = 1</li>
            <li>Look at <strong>different angles</strong> (drag to rotate)</li>
          </ul>
        </div>
      </div>

      {/* Vue 3D */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 50 }}
          shadows
        >
          {/* Lighting */}
          <directionalLight
            position={LIGHTING_CONFIG.main.position}
            intensity={LIGHTING_CONFIG.main.intensity}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight
            position={LIGHTING_CONFIG.fill.position}
            intensity={LIGHTING_CONFIG.fill.intensity}
          />
          <ambientLight intensity={LIGHTING_CONFIG.ambient.intensity} />

          {/* Test spheres */}
          {/* Left : Smooth + Metal */}
          <TestSphere
            position={[-3, 0, 0]}
            color="#cccccc"
            roughness={compareRoughness}
            metalness={compareMetalness}
            label="Smooth + Metal"
          />

          {/* Center : Editable */}
          <TestSphere
            position={[0, 0, 0]}
            color={color}
            roughness={roughness}
            metalness={metalness}
            label="Editable"
          />

          {/* Right : Rough + Dielectric */}
          <TestSphere
            position={[3, 0, 0]}
            color="#ff5555"
            roughness={1 - compareRoughness}
            metalness={1 - compareMetalness}
            label="Rough + Dielectric"
          />

          {/* Floor */}
          <Floor />

          {/* Camera controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={15}
          />
        </Canvas>

        {/* Labels HTML overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '100px',
          pointerEvents: 'none',
          color: '#ffffff',
          fontSize: '14px',
          textShadow: '0 0 4px rgba(0,0,0,0.8)'
        }}>
          <div>Smooth + Metal</div>
          <div style={{ fontWeight: 'bold' }}>MY MATERIAL</div>
          <div>Rough + Dielectric</div>
        </div>
      </div>
    </div>
  );
}

export default MaterialTester;