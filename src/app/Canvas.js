"use client";
import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Center, OrbitControls } from '@react-three/drei'
import { useSnapshot } from 'valtio'
import { state } from './store'
import data from '../../public/data'
import { HexColorPicker } from "react-colorful"




export const App = ({ position = [0, 0, 2.5], fov = 25 }) => (
  // useEffect(() => {
  // <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document?.getElementById('root')} eventPrefix="client">
  <>
    <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventPrefix="client">
      <ambientLight intensity={0.5} />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
      {/* <CameraRig> */}
      {/* <Backdrop /> */}
      <Center>
        <Mouth />
      </Center>
      {/* </CameraRig> */}
      <OrbitControls makeDefault />
    </Canvas>
    {/* <Picker /> */}
    <Selector />
  </>
  // }, [])
)
function Mouth(props) {

  const snap = useSnapshot(state.st)
  const { nodes, materials } = useGLTF('/models/dentaldr.gltf')
  const ref = useRef()
  const [hovered, setHovered] = useState(null)


  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="5" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    }
  }, [hovered])

  const items = nodes.Scene.children.map((node) => {
    var material;
    var position;
    var rotation;
    var scale
    if (node.type == "Mesh") {
      material = node.material.name
      position = node.position
      rotation = node.rotation
      scale = node.scale
      return (
        <mesh key={node.name} castShadow receiveShadow geometry={node.geometry} material={materials[material]} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
      )


    } else if (node.type == "Group") {
      return (node.children.map((child) => {
        let piece = node.name.match(/(?<=t)\d+(?=0)|(?<=t)\d+/g)?.shift()
        let pieza = piece ? data.piezas.find(item => item.numero == piece) : undefined;

        material = child.material.name

        let color = snap.items[material]
        let estado = snap.items[material] == 0 ? 'ausente' : undefined
        const estadoA = (snap.current != null && snap.current == "ausente") || (pieza && pieza.estado == "ausente") || (estado && estado === "ausente")
        position = node.position
        rotation = node.rotation
        scale = node.scale

        if (material.includes('14')) {
          console.log('kkljk', estado, material, snap.current)
        }
        if (pieza && pieza.estado != "ausente" && material.includes(pieza.cara) && !estadoA) {
          color = color || pieza.color
          material = `${pieza.cara}${piece}`
          return (
            <mesh key={material} castShadow receiveShadow geometry={child.geometry} material={materials[material]} material-color={color} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
          )
        } else if (estadoA && Object.keys(materials).find(item => item.includes(material))) {
          return
        } else {
          // console.log('1', material)
          return (
            <mesh key={material} castShadow receiveShadow geometry={child.geometry} material={materials[material]} material-color={color} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
          )
        }
      }))
    }
  }
  );
  return (

    <group
      ref={ref}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && setHovered(null)}
      onPointerMissed={() => (state.st.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.st.current = e.object.material.name))}
      {...props} dispose={null}>
      {items}
    </group>
  )
}


function Picker() {
  const snap = useSnapshot(state.st)
  console.log(snap.items)
  console.log(snap.current)
  console.log(snap.items[snap.current])
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.st.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}
function Selector() {
  const snap = useSnapshot(state.st)
  const caras = useSnapshot(state.caras)
  const dientes = useSnapshot(state.dientes)
  const estado = useSnapshot(state.estado)
  // const color = useSnapshot(state.color)

  const [caraSelect, setCaraSelect] = useState('');
  const [dienteSelect, setDienteSelect] = useState('');
  const [estadoSelect, setEstadoSelect] = useState('');

  const setColor = () => {
    const dienteEntero = estadoSelect == '#feffd4' || estadoSelect == '0';
    if (caraSelect && dienteSelect && estadoSelect) {
      state.st.current = `${caraSelect}${dienteSelect}`;
      state.st.items[`${caraSelect}${dienteSelect}`] = estadoSelect;
    }
    if (dienteEntero && dienteSelect && estadoSelect) {
      for (let cara of caras) {
        state.st.items[`${cara.value}${dienteSelect}`] = estadoSelect
      }
    }
  }

  const caraChange = (event) => {
    setCaraSelect(event.target.value);
    // setColor()

  };
  const dienteChange = (event) => {
    setDienteSelect(event.target.value);
    // setColor()
  };
  const estadoChange = (event) => {
    const value = event.target.value;
    setEstadoSelect(value);
    // setColorSelect(estado.find(item=> item.value === value).label);
    // console.log(colorSelect)
    // setColor()
  };
  return (
    <div className='picker' style={{ display: snap.current ? "block" : "none" }}>
      <h2 >Selector de Dentadura</h2>
      <select value={caraSelect} onChange={caraChange}>
        <option value="">Selecciona una opción</option>
        {caras.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      <select value={dienteSelect} onChange={dienteChange}>
        <option value="">Selecciona una opción</option>
        {dientes.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      <select value={estadoSelect} onChange={estadoChange}>
        <option value="">Selecciona una opción</option>
        {estado.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
      <br></br>
      <button onClick={setColor}>oK</button>

      {caraSelect && dienteSelect && estadoSelect && (
        <p>Tu elección: {dientes.find((opcion) => opcion.value === dienteSelect)?.label} cara:{caras.find((opcion) => opcion.value === caraSelect)?.label} estado: {estado.find((opcion) => opcion.value === estadoSelect)?.label}</p>
      )}
    </div>
  )
}
// useGLTF.preload('/shirt_baked_collapsed.glb')
//   ;['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
