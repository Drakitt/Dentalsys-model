"use client";
import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, AccumulativeShadows, RandomizedLight, Decal, Environment, Center, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { state, caras, dientes } from './store'
import data from '../../public/data'
import { HexColorPicker } from "react-colorful"
import { proxy } from 'valtio'




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
    <Picker />
    <Selector/>
  </>
  // }, [])
)

// function Backdrop() {
//   const shadows = useRef()
//   useFrame((state, delta) => easing.dampC(shadows.current.getMesh().material.color, state.color, 0.25, delta))
//   return (
//     <AccumulativeShadows ref={shadows} temporal frames={60} alphaTest={0.85} scale={10} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.14]}>
//       <RandomizedLight amount={4} radius={9} intensity={0.55} ambient={0.25} position={[5, 5, -10]} />
//       <RandomizedLight amount={4} radius={5} intensity={0.25} ambient={0.55} position={[-5, 5, -9]} />
//     </AccumulativeShadows>
//   )
// }

// function CameraRig({ children }) {
//   const group = useRef()
//   const snap = useSnapshot(state)
//   useFrame((state, delta) => {
//     easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 4 : 0, 0, 2], 0.25, delta)
//     easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta)
//   })
//   return <group ref={group}>{children}</group>
// }

function Mouth(props) {

  const snap = useSnapshot(state)
  // const texture = useTexture(`/${snap.decal}.png`)
  const { nodes, materials } = useGLTF('/models/dentaldr.gltf')
  const ref = useRef()
  const [hovered, set] = useState(null)

  // let componentToHex = (val) => {
  //   const a = val.toString(16);
  //   return a.length === 1 ? "0" + a : a;
  // };
  
  // let rgbToHex = (r,g,b) => {
  //   return "#" + componentToHex(Math.round(r*255)) + componentToHex(Math.round(g*255)) + componentToHex(Math.round(b*255));
  // }
  
  // // console.log(rgbToHex ('rgb(1,255,148)'));
  
  // console.log(materials)
  // const matname = {};
  //   Object.keys(materials).map((mat)=>{
  //     matname[mat]=`${rgbToHex(materials[mat].color.r,materials[mat].color.g,materials[mat].color.b)}`
  //     // console.log(matname[mat])
  //   })

  // const state2 = proxy({
  //   current: null,
  //   items:matname
  // })
  // console.log(matname)


  // const snap = useSnapshot(state2)
  // useFrame((state) => {
  //   const t = state.clock.getElapsedTime()
  //   ref.current.rotation.set(Math.cos(t / 4) / 8, Math.sin(t / 4) / 8, -0.2 - (1 + Math.sin(t / 1.5)) / 20)
  //   ref.current.position.y = (1 + Math.sin(t / 1.5)) / 10
  // })

  useEffect(() => {
    const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="5" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`
    const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`
    if (hovered) {
      document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(cursor)}'), auto`
      return () => (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(auto)}'), auto`)
    }
  }, [hovered])

  const items = nodes.Scene.children.map((node) => {

    if (node.type == "Mesh") {
      var material = node.material.name
      var position = node.position
      var rotation = node.rotation
      var scale = node.scale
      return (
        <mesh castShadow receiveShadow geometry={node.geometry} material={materials[material]} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
      )


    } else if (node.type == "Group") {
      return (node.children.map((child) => {
        var piece = node.name.match(/(?<=t)\d+(?=0)|(?<=t)\d+/g)?.shift()
        var pieza = piece ? data.piezas.find(item => item.numero == piece) : undefined;
        
        material = child.material.name

        var color = snap.items[material]
        position = node.position
        rotation = node.rotation
        scale = node.scale
        if (pieza && pieza.estado != "ausente" && material.includes(pieza.cara)) {
          color = pieza.color
          material = `${pieza.cara}${piece}`
          return (
            <mesh castShadow receiveShadow geometry={child.geometry} material={materials[material]} material-color={color} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
          )
        } else if (pieza && pieza.estado == "ausente") {
          return
        } else {
          return (
            <mesh castShadow receiveShadow geometry={child.geometry} material={materials[material]} material-color={color} material-envMapIntensity={0.8} position={position} rotation={rotation} scale={scale} />
          )
        }
      }))
    }
  }
  );

  // const { scene } = useGLTF('/models/dentaldr.gltf')
  // const prim = useRef()

  // useFrame((state, delta) => easing.dampC(materials.vestibular13.color, snap.color, 0.25, delta))
  // useFrame((state, delta) => easing.dampC(materials.mesial12.color, snap.color, 0.25, delta))
  return (

    <group
      ref={ref}
      onPointerOver={(e) => (e.stopPropagation(), set(e.object.material.name))}
      onPointerOut={(e) => e.intersections.length === 0 && set(null)}
      onPointerMissed={() => (state.current = null)}
      onClick={(e) => (e.stopPropagation(), (state.current = e.object.material.name))}
      {...props} dispose={null}>
      {items}
    </group>
  )
}


function Picker() {
  const snap = useSnapshot(state)
  // console.log(snap)
  console.log(snap.items)
  console.log(snap.current)
  console.log(snap.items[snap.current])
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}
function Selector() {
  const snap = useSnapshot(state)
  const caras = useSnapshot(caras)
  const dientes = useSnapshot(dientes)
  // console.log(snap)
  console.log(snap.items)
  console.log(snap.current)
  console.log(snap.items[snap.current])
  return (
    <div>
      <h2>Selector de Dentadura</h2>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">Selecciona una opción</option>
        {caras.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>

      {selectedOption && (
        <p>Tu elección: {caras.find((opcion) => opcion.value === selectedOption)?.label}</p>
      )}
    </div>
  )
}
// useGLTF.preload('/shirt_baked_collapsed.glb')
//   ;['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
