"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Center, OrbitControls } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { state } from "./store";
import data from "../../public/data";
import { HexColorPicker } from "react-colorful";
import fetchData from "./fetchData";
import actualizarDato from "./updateData";

import create from "./getAll";


export const App = ({ position = [0, 0, 2.5], fov = 25, shopId }) => {
  const snap = useSnapshot(state.st);
  const [dataOdonto, setDataOdonto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        setLoading(true);
        const response = await fetchData(shopId);

        setDataOdonto(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isMounted.current) {
      isMounted.current = true; // Set the flag after first render
      fetchDataAsync();
    }
  }, [shopId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // useEffect(() => {
  // <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document?.getElementById('root')} eventPrefix="client">
  return (
    <>
      <Canvas
        shadows
        camera={{ position, fov }}
        gl={{ preserveDrawingBuffer: true }}
        eventPrefix="client"
      >
        <ambientLight intensity={0.5} />
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/potsdamer_platz_1k.hdr" />
        <Center>
          <Mouth dataOdonto={dataOdonto} />
        </Center>
        <OrbitControls makeDefault />
      </Canvas>
      <Selector dataOdonto={dataOdonto} shopId={shopId} />
      <Switcher />
    </>
  );
};
function Mouth({ dataOdonto, ...props }) {
  const snap = useSnapshot(state.st);
  if (snap.currentModel == "json_serialized") {
    var modelthree = "/models/dentaldr.gltf";
  } else {
    modelthree = "/modeloinfantil/modeloinfantil.gltf";
  }
  const { nodes, materials } = useGLTF(modelthree);
  const ref = useRef();
  const [hovered, setHovered] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  useEffect(() => {
    if (dataOdonto) {
      // console.log(ref4   )
      // console.log(hovered, hoveredColor)
      const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="#${hoveredColor}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="#fff-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="5" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
      const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
      if (hovered) {
        document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          cursor
        )}'), auto`;
        return () =>
          (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
            auto
          )}'), auto`);
      }
    }
  }, [hovered]);

  const items = nodes.Scene.children.map((node) => {
    var material;
    var position;
    var rotation;
    var scale;
    if (node.type == "Mesh") {
      material = node.material.name;
      position = node.position;
      rotation = node.rotation;
      scale = node.scale;
      return (
        <mesh
          key={node.name}
          castShadow
          receiveShadow
          geometry={node.geometry}
          material={materials[material]}
          material-envMapIntensity={0.8}
          position={position}
          rotation={rotation}
          scale={scale}
        />
      );
    } else if (node.type == "Group") {
      if (dataOdonto) {
        return node.children.map((child) => {
          const model = snap.currentModel;
          let piece = node.name.match(/(?<=t)\d+(?=0)|(?<=t)\d+/g)?.shift();
          let pieza = piece
            ? data.piezas.find((item) => item.numero == piece)
            : undefined;

          material = child.material.name;
       
          let color = dataOdonto.data[0][model][material];
          let estado =
            dataOdonto.data[0][model][material] == 0 ? "ausente" : undefined;
          const estadoA =
            (snap.current != null && snap.current == "ausente") ||
            (estado && estado === "ausente");
          position = node.position;
          rotation = node.rotation;
          scale = node.scale;

          if (estadoA) {
            return;
          } else {
            // console.log('1', material)
            return (
              <mesh
                key={material}
                castShadow
                receiveShadow
                geometry={child.geometry}
                material={materials[material]}
                material-color={color}
                material-envMapIntensity={0.8}
                position={position}
                rotation={rotation}
                scale={scale}
              />
            );
          }
        });
      }
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e) => (
        e.stopPropagation(),
        setHovered(e.object.material.name),
        setHoveredColor(e.object.material.color.getHexString())
      )}
      onPointerOut={(e) =>
        e.intersections.length === 0 &&
        setHovered(null) &&
        setHoveredColor(null)
      }
      onPointerMissed={() => (state.st.current = null)}
      onClick={(e) => (
        e.stopPropagation(),
        (state.st.current = e.object.material.name),
        (state.st.currentEstado = `#${hoveredColor}`)
      )}
      {...props}
      dispose={null}
    >
      {items}
    </group>
  );
}

function Selector({ dataOdonto, shopId }) {
  const snap = useSnapshot(state.st);
  const model = snap.currentModel;
  const adult = snap.currentModel == "json_serialized" ? "" : "kid";
  const caras = useSnapshot(state.caras);
  const dientes = useSnapshot(state[`dientes${adult}`]);
  const estado = useSnapshot(state.estado);
  const caraCurrent = snap.current?.replace(/\d+/, "");
  const dienteCurrent = snap.current?.replace(/\D+/, "");
  const estadoCurrent = snap.currentEstado;

  const [caraSelect, setCaraSelect] = useState(caraCurrent);
  const [dienteSelect, setDienteSelect] = useState(dienteCurrent);
  const [estadoSelect, setEstadoSelect] = useState(estadoCurrent);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [nombreTratamiento, setNombreTratamiento] =useState("");
  const [descripcion, setDescripcion] =useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCaraSelect(caraCurrent);
  }, [caraCurrent]);
  useEffect(() => {
    setDienteSelect(dienteCurrent);
  }, [dienteCurrent]);
  useEffect(() => {
    setEstadoSelect(estadoCurrent);
  }, [estadoCurrent]);

  const setColor = async () => {
    setIsModalOpen(false);
    const dienteEntero = estadoSelect == "#feffd4" || estadoSelect == "0";
    if (caraSelect && dienteSelect && estadoSelect) {
      state.st.current = `${caraSelect}${dienteSelect}`;
      dataOdonto.data[0][model][`${caraSelect}${dienteSelect}`] = estadoSelect;
    }
    if (dienteEntero && dienteSelect && estadoSelect) {
      for (let cara of caras) {
        dataOdonto.data[0][model][`${cara.value}${dienteSelect}`] =
          estadoSelect;
      }
    }
  
    await actualizarDato(dataOdonto.data[0].nro_hc, dataOdonto.data[0][model]);
  };
  const openModal = () => {
    setNombreTratamiento(`${caraSelect} ${dienteSelect}`);
    setDescripcion(
      estado.find((opcion) => opcion.value === estadoSelect)?.label || ""
    );
    setIsModalOpen(true);
  };
  const handleConfirmar = async () => {
    if (caraSelect && dienteSelect && estadoSelect) {
      setLoading(true); // Activa el spinner
  
      const prescription = {
        nombre_tratamiento:
          nombreTratamiento || `${caraSelect} ${dienteSelect} ${estado.find((opcion) => opcion.value === estadoSelect)?.label}`,
        fecha: new Date().toISOString().replace("T", " ").split(".")[0],
        descripcion: descripcion || "Tratamiento mediante odontograma",
        nro_hc: dataOdonto.data[0].nro_hc,
        id_odontograma: Number(dataOdonto.data[0].id_odontograma),
      };
  
      try {
        // Llamar a la función para crear el tratamiento
        await create(prescription);
      } catch (error) {
        console.error("Error al crear tratamiento:", error);
      } finally {
        setLoading(false); // Desactiva el spinner cuando se termine
        closeModal(); // Cierra el modal después de confirmar
      }
    }
  };
  
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
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
    <div
      className="picker"
      style={{ display: snap.current ? "block" : "none" }}
    >


      <h2>Selector de Dentadura</h2>

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
      <button onClick={setColor}>Visualizar</button>
      {caraSelect && dienteSelect && estado.find((opcion) => opcion.value === estadoSelect)?.label && (
        <button onClick={openModal}>Crear Tratamiento</button>
      )}

      {caraSelect && dienteSelect && estadoSelect && (
        <p>
          Tu elección:{" "}
          {dientes.find((opcion) => opcion.value === dienteSelect)?.label} cara:
          {caras.find((opcion) => opcion.value === caraSelect)?.label} estado:{" "}
          {estado.find((opcion) => opcion.value === estadoSelect)?.label}
        </p>
      )}
      <Switcher />
      {isModalOpen && (
  <div className={`modal-overlay ${loading ? 'loading' : ''}`}>
    <div className="modal">
      <h2>Confirmación</h2>
      <p>Estás a punto de crear un tratamiento. ¿Deseas continuar?</p>
      <input
        type="text"
        value={`${caraSelect} ${dienteSelect}`} // Nombre tratamiento
        onChange={(e) => setNombreTratamiento(e.target.value)} // Actualiza el estado si quieres hacerlo editable
        placeholder="Nombre del tratamiento"
      />
      <textarea
        value={descripcion} // Descripción
        onChange={(e) => setDescripcion(e.target.value)} // Actualiza el estado
        placeholder="Descripción"
      />
      
      {/* Mostrar el spinner si está cargando */}
      {loading && <div className="spinner">Cargando...</div>}
      
      <div className="modal-buttons">
        <button onClick={handleConfirmar} disabled={loading}>Confirmar</button>
        <button onClick={closeModal} disabled={loading}>Cancelar</button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
function Switcher() {
  const [modelName, setModelName] = useState("Adulto");

  const snap = useSnapshot(state.st);

  const modelChange = () => {
    if (modelName == "Adulto") {
      setModelName("Infante");
      state.st.currentModel = "json_serialized_kid";
    } else {
      setModelName("Adulto");
      state.st.currentModel = "json_serialized";
    }
  };

  return (
    <div
      className="switch"
      style={{ display: snap.current ? "block" : "none" }}
    >
      <button onClick={modelChange}> {modelName} </button>
    </div>
  );
}
// useGLTF.preload('/shirt_baked_collapsed.glb')
//   ;['/react.png', '/three2.png', '/pmndrs.png'].forEach(useTexture.preload)
