"use client";

import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct for React 18

import { useState, useEffect } from "react";
import WeatherWidget from "../widgets/weather";
import TemperatureWidget from "../widgets/temperature";
import TodoList from "../widgets/todo";

// Dashboard component makes various UI elements react to the theme color.
export default function Dashboard() {
  // Store the selected theme as an RGB string.
  const [colorTheme, setColorTheme] = useState("rgb(255, 196, 0)");
  const [backgroundBlur, setBackgroundBlur] = useState(100);

  // Helper: Generate a random integer between 0 and options - 1.
  function randi(options) {
    return Math.floor(Math.random() * options);
  }

  // Helper: Create an array of shades from a given rgb string.
  function generateShadesFromRgb(rgb, numberOfShades) {
    const shades = [];
    const [r, g, b] = parseRgbString(rgb);

    for (let i = 0; i < numberOfShades; i++) {
      const factor = 1 - i / numberOfShades;
      shades.push(`rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`);
    }
    return shades;
  }

  // Helper: Parses an "rgb(...)" string into its numeric components.
  function parseRgbString(rgb) {
    const result = rgb.match(/\d+/g);
    return result ? result.map(Number) : [0, 0, 0];
  }

  // Helper: Darken an rgb color by reducing each component by 20%.
  function darkenColor(rgbColor) {
    const rgb = rgbColor.match(/\d+/g);
    if (!rgb) throw new Error("Invalid RGB color format");

    let [r, g, b] = rgb.map(Number);

    r = Math.max(0, Math.floor(r * 0.8));
    g = Math.max(0, Math.floor(g * 0.8));
    b = Math.max(0, Math.floor(b * 0.8));

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Helper: Convert an rgb string to a hex string (for the color input).
  function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    const [r, g, b] = result.map((val) => parseInt(val).toString(16).padStart(2, "0"));
    return `#${r}${g}${b}`;
  }

  // Helper: Convert a hex string to an rgb string.
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  // ------------------------------------------------------------------------------------------------
  // One-time DOM setup: Create some background shapes and register UI event listeners.
  useEffect(() => {
    // (1) Background Shapes – add 10 shapes at random positions.
    const bgShapesWrapper = document.querySelector("#background-shapes-wrapper");
    bgShapesWrapper.innerHTML = "";
    const initialShades = generateShadesFromRgb(colorTheme, 15);

    for (let i = 0; i < 10; i++) {
      const shape = document.createElement("div");
      shape.style.backgroundColor = "white";
      shape.style.transition = "background-color cubic-bezier(0.075, 0.82, 0.165, 1) 1s";
      shape.style.position = "absolute";
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.height = `${Math.random() * 20 + 20}vw`;
      shape.style.width = `${Math.random() * 20 + 20}vw`;

      if (randi(2) === 0) {
        shape.style.borderRadius = "50%";
      } else {
        shape.style.rotate = `${Math.random() * 90}deg`;
      }

      bgShapesWrapper.appendChild(shape);
      shape.style.backgroundColor = initialShades[randi(initialShades.length)];
    }

    // (2) Profile UI: Show/hide profile options on the profile picture click.
    const pfp = document.querySelector("#profile-picture");
    const pfpOptions = document.querySelector("#profile-options");

    const userUIClickOutDetector = (event) => {
      if (pfp?.contains(event.target)) return;
      pfpOptions.style.opacity = "0";
      pfpOptions.style.pointerEvents = "none";
      document.removeEventListener("click", userUIClickOutDetector);
    };

    pfp?.addEventListener("click", () => {
      pfpOptions.style.opacity = "1";
      pfpOptions.style.pointerEvents = "all";
      document.addEventListener("click", userUIClickOutDetector);
    });

    // (3) Edit UI Logic: Toggle an editing mode that shifts some UI elements.
    let editing = false;
    let hasBG = false;
    const editButton = document.querySelector("#edit-button");
    const editUIWrapper = document.querySelector("#edit-ui");
    const widgetWrapper = document.querySelector("#dashboard-widgets");

    const uploadBackgroundButton = document.querySelector("#background-image-uploader");
    const uploadBackgroundText = document.querySelector("#background-image-uploader-label");

    editButton?.addEventListener("click", () => {
      editing = !editing;
      if (editing) {
        editUIWrapper.style.transform = "translateX(-10px)";
        widgetWrapper.style.width = "calc(100vw - 300px)";
      } else {
        editUIWrapper.style.transform = "";
        widgetWrapper.style.width = "";
      }
    });

    uploadBackgroundButton?.addEventListener("change", (e) => {
      const target = e.target;
      const file = target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.querySelector(".background-filter").style.backgroundImage = `url(${event.target.result})`;
          hasBG = true;
          uploadBackgroundText.textContent = "Remove Background";
        };
        reader.readAsDataURL(file);
      }
      target.value = "";
    });

    uploadBackgroundButton?.addEventListener("click", (e) => {
      if (hasBG) {
        e.preventDefault();
        document.querySelector(".background-filter").style.backgroundImage = "";
        uploadBackgroundText.textContent = "Background Image";
        hasBG = false;
      }
    });

    // Adding widgets
    let hoverWidget
    let loadedWidget
    let loadedWidgetNode
    let loadedWidgetPlacementRef
    let loadedWidgetPlaced = false
    let mouseMoveConnection

    const widgetRootNode = document.querySelector("#dashboard-widgets")
    const widgetRoot = ReactDOM.createRoot(widgetRootNode)
    const widgetValueSwitch = {
      "WeatherWidget": WeatherWidget,
      "TemperatureWidget": TemperatureWidget,
      "TodoList": TodoList
    }
    
    let widgetsOnRender = []
    let widgetOnRenderNode = []
    widgetRoot.render(
      <React.Fragment>
        {widgetsOnRender}
      </React.Fragment>
    )

    document.querySelectorAll(".widget-selector-widget").forEach((widget) => {
      let m1ButtonDown = (e) => {
        const selectedWidgetRef = widgetValueSwitch[widget.getAttribute("data-value")]
        loadedWidget = React.createElement(selectedWidgetRef)
        //loadedWidgetNode.style.setProperty("opacity", "0.8")
        widgetsOnRender.push(loadedWidget)
        widgetRoot.render(
          <React.Fragment>
            {widgetsOnRender}
          </React.Fragment>
        )
        requestAnimationFrame(() => {
          loadedWidgetNode = widgetRootNode.querySelectorAll(".widget-wrapper")[widgetsOnRender.length - 1]
          loadedWidgetNode.style.setProperty("opacity", "0.3")
          loadedWidgetNode.style.setProperty("order", toString(widgetsOnRender.length - 1))
        })

        hoverWidget = widget.cloneNode(true)
        document.body.appendChild(hoverWidget)
    
        hoverWidget.style.setProperty("position", "absolute")
        hoverWidget.style.setProperty("pointer-events", "none")
        hoverWidget.style.setProperty("z-index", "1000")
    
        mouseMoveConnection = (event) => {
          hoverWidget.style.setProperty("left", `${ event.pageX - 20 }px`)
          hoverWidget.style.setProperty("top", `${ event.pageY - 10 }px`)
        }
        document.addEventListener("mousemove", mouseMoveConnection)
      }
    
      let m1ButtonUp = () => {
        if (hoverWidget) {
          // Insert widget on nodelist and fix the css order tag
          if (!loadedWidgetPlacementRef) {
            widgetOnRenderNode.push(loadedWidgetNode)
          } else {
            let index = loadedWidgetNode.index(loadedWidgetPlacementRef)
            loadedWidgetNode = array.splice(index, 0, loadedWidgetNode)
          }

          for (let i = 0; i < loadedWidgetNode.length; i++) {
            loadedWidgetNode[i].style.setProperty("order", 2*i)
          }

          document.removeEventListener("mousemove", mouseMoveConnection)
          loadedWidgetNode.style.setProperty("opacity", "1")
          hoverWidget.remove()
          hoverWidget = null
          loadedWidgetNode = null
          loadedWidgetPlacementRef = null
        }
      }
    
      widget.addEventListener("mousedown", m1ButtonDown)
      document.addEventListener("mouseup", m1ButtonUp)
    })    

  }, []);

  useEffect(() => {

  }, [])

  // ------------------------------------------------------------------------------------------------
  // Whenever the theme color changes, update all affected UI parts.
  useEffect(() => {
    const shades = generateShadesFromRgb(colorTheme, 15);
    const darkerShade = darkenColor(colorTheme);
    document.documentElement.style.setProperty("--colorTheme", colorTheme);

    const landingHeader = document.querySelector("#page-header");
    landingHeader.style.background = `linear-gradient(to top, ${darkerShade}, rgba(0,0,0,0) 100%)`;

    const bgShapesWrapper = document.querySelector("#background-shapes-wrapper");
    const shapes = bgShapesWrapper.querySelectorAll("div");
    shapes.forEach((shape) => {
      shape.style.backgroundColor = shades[randi(shades.length)];
    });
  }, [colorTheme]);

  // ------------------------------------------------------------------------------------------------
  // When the user selects a new color from the input, convert it to RGB and update the state.
  const handleColorChange = (event) => {
    const hexColor = event.target.value;
    const rgbColor = hexToRgb(hexColor);
    setColorTheme(rgbColor);
  };

  // ------------------------------------------------------------------------------------------------
  // Render the dashboard UI.
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet"></link>
      <div id="background">
        <div id="background-shapes-wrapper"/>
        <div className="background-filter"/>
      </div>
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <header id="page-header">
            <div className="background-blur-soft"/>
            <div id="landing-header-content">
              <div id="brand">
                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 95 118.75" x="0px" y="0px"><path d="M44.629,18.51a1.3,1.3,0,0,1-.948,1.569,7.322,7.322,0,0,1-1.767.215,7.427,7.427,0,0,1-.831-.048,15.235,15.235,0,0,1-3.942,5.535,13.761,13.761,0,0,1,4.808,12.36,1.3,1.3,0,0,1-2.57-.348,11.249,11.249,0,0,0-4.367-10.4A17.17,17.17,0,0,1,26.845,30l-.079,0a1.3,1.3,0,0,1-.077-2.591,13.721,13.721,0,0,0,11.889-7.905,6.946,6.946,0,0,1-2.059-1.561,1.3,1.3,0,1,1,1.929-1.733,4.723,4.723,0,0,0,4.611,1.35A1.3,1.3,0,0,1,44.629,18.51ZM34.48,12.442a6.621,6.621,0,0,0,2.565.507,13.719,13.719,0,0,0,3.9-.753c.69-.205,1.4-.417,2.107-.552a1.3,1.3,0,0,0-.49-2.547A24.277,24.277,0,0,0,40.2,9.71c-1.73.513-3.224.957-4.735.334a1.3,1.3,0,0,0-.988,2.4Zm8.171,46.54A1.3,1.3,0,0,0,41.2,60.106c-.26,2.068-1.737,3.975-3.429,5.949a4.745,4.745,0,0,1-2.348-4.631,1.3,1.3,0,1,0-2.547-.485,7.238,7.238,0,0,0,3.192,7.093A16.027,16.027,0,0,0,32.4,74.324a20.4,20.4,0,0,0-3.644-2.9,10.647,10.647,0,0,0,.692-2.092,1.3,1.3,0,1,0-2.533-.552,8.39,8.39,0,0,1-3.056,4.8,1.3,1.3,0,1,0,1.6,2.044,11.219,11.219,0,0,0,1.964-1.974A17.394,17.394,0,0,1,32.5,78.479c.013.022.028.041.042.062a15.934,15.934,0,0,1,2.536,6.08,1.3,1.3,0,0,0,2.549-.477,18.522,18.522,0,0,0-2.791-6.839c-.551-3.272,1.765-5.943,4.214-8.766,2.128-2.452,4.328-4.988,4.721-8.109A1.3,1.3,0,0,0,42.651,58.982ZM40.672,47.839A1.3,1.3,0,0,0,38.517,46.4a16.478,16.478,0,0,1-4.293,4.353,9.847,9.847,0,0,1-5.758-4.522,8.764,8.764,0,0,1-1.19-4.517,7.048,7.048,0,0,0,2.929-3.122,1.3,1.3,0,0,0-2.345-1.108,4.771,4.771,0,0,1-5.613,2.4,1.3,1.3,0,0,0-.745,2.484,7.374,7.374,0,0,0,2.122.312,7.464,7.464,0,0,0,1.08-.081,11.45,11.45,0,0,0,1.51,4.919,12.426,12.426,0,0,0,5.115,4.863,18.7,18.7,0,0,1-10.724,1.28,1.3,1.3,0,1,0-.438,2.555,21.807,21.807,0,0,0,3.7.317A20.107,20.107,0,0,0,40.672,47.839Zm48.888,10a9.831,9.831,0,0,1-5.219,9.945,10.232,10.232,0,0,1-1.994,8.9,11.209,11.209,0,0,1-8.826,4.21h-.047A11.473,11.473,0,0,1,69.8,89.376a12.78,12.78,0,0,1-10.81,3.3A8.375,8.375,0,0,1,54.454,94a8.582,8.582,0,0,1-3.806-.9A8.1,8.1,0,0,1,47.5,90.4a8.1,8.1,0,0,1-3.148,2.7,8.45,8.45,0,0,1-8.339-.433,12.779,12.779,0,0,1-10.81-3.3A11.473,11.473,0,0,1,21.526,80.9h-.047a11.209,11.209,0,0,1-8.826-4.21,10.232,10.232,0,0,1-1.994-8.9A9.831,9.831,0,0,1,5.44,57.843a9.98,9.98,0,0,1,2.8-5.9,14.421,14.421,0,0,1,3.29-20.78,12.972,12.972,0,0,1,7.807-9.634,9.557,9.557,0,0,1,.755-6.882,10.465,10.465,0,0,1,5.214-4.8A16.028,16.028,0,0,1,35.328,1.68,15.36,15.36,0,0,1,47.5,2.968,15.356,15.356,0,0,1,59.672,1.68a16.028,16.028,0,0,1,10.02,8.171,10.465,10.465,0,0,1,5.214,4.8,9.551,9.551,0,0,1,.755,6.882,12.972,12.972,0,0,1,7.807,9.634,14.421,14.421,0,0,1,3.29,20.78A9.98,9.98,0,0,1,89.56,57.843Zm-42.06-52a1.293,1.293,0,0,1-.782-.263c-2.6-1.968-6.791-2.519-10.674-1.4a13.4,13.4,0,0,0-8.6,7.23,1.3,1.3,0,0,1-.727.678,7.39,7.39,0,0,0-4.89,8.7,13.005,13.005,0,0,1,3.517-.193,1.3,1.3,0,1,1-.211,2.585,10.384,10.384,0,0,0-11.126,8.938,1.3,1.3,0,0,1-.6.927,11.825,11.825,0,0,0-3.114,17.308,11.157,11.157,0,0,1,3.938-1.4,1.3,1.3,0,1,1,.409,2.561,7.62,7.62,0,0,0-6.621,6.641,7.286,7.286,0,0,0,4.711,7.758,1.3,1.3,0,0,1,.715,1.651,7.549,7.549,0,0,0,1.238,7.508,8.711,8.711,0,0,0,8.079,3.149,1.3,1.3,0,0,1,1.459,1.475,8.863,8.863,0,0,0,2.769,7.8,10.206,10.206,0,0,0,9.063,2.536,1.3,1.3,0,0,1,1.033.23,5.861,5.861,0,0,0,6.121.52,5.163,5.163,0,0,0,3-4.579,1.3,1.3,0,0,1,1.3-1.279Zm4.452,5.805c.7.136,1.417.349,2.107.552a13.679,13.679,0,0,0,3.9.754,6.621,6.621,0,0,0,2.565-.507,1.3,1.3,0,1,0-.988-2.4c-1.511.621-3,.178-4.736-.335A24.106,24.106,0,0,0,52.442,9.1a1.3,1.3,0,0,0-.49,2.546Zm-.634,8.437a7.382,7.382,0,0,0,1.767.213,7.7,7.7,0,0,0,.832-.047,15.206,15.206,0,0,0,3.942,5.534,13.764,13.764,0,0,0-4.808,12.361,1.3,1.3,0,0,0,1.284,1.122,1.32,1.32,0,0,0,.176-.011,1.3,1.3,0,0,0,1.11-1.46,11.248,11.248,0,0,1,4.367-10.4A17.17,17.17,0,0,0,68.154,30c.028,0,.053,0,.08,0a1.3,1.3,0,0,0,.077-2.591,13.721,13.721,0,0,1-11.889-7.905,6.95,6.95,0,0,0,2.06-1.562,1.3,1.3,0,0,0-1.931-1.733,4.716,4.716,0,0,1-4.61,1.35,1.3,1.3,0,0,0-.623,2.519Zm19.819,53.5a8.4,8.4,0,0,1-3.055-4.8,1.3,1.3,0,1,0-2.534.552,10.657,10.657,0,0,0,.694,2.09,20.251,20.251,0,0,0-3.644,2.9,16.024,16.024,0,0,0-3.669-6.292,7.238,7.238,0,0,0,3.193-7.093,1.3,1.3,0,1,0-2.547.485,4.745,4.745,0,0,1-2.348,4.631c-1.693-1.974-3.168-3.881-3.43-5.948a1.3,1.3,0,1,0-2.572.323c.393,3.122,2.592,5.656,4.721,8.108,2.449,2.825,4.765,5.5,4.214,8.766a18.514,18.514,0,0,0-2.791,6.841,1.3,1.3,0,1,0,2.548.476,15.956,15.956,0,0,1,2.537-6.081.728.728,0,0,0,.042-.06,17.41,17.41,0,0,1,5.081-4.83,11.213,11.213,0,0,0,1.963,1.974,1.3,1.3,0,1,0,1.6-2.043Zm4.755-18.869a1.3,1.3,0,0,0-1.5-1.059,18.7,18.7,0,0,1-10.725-1.279,12.43,12.43,0,0,0,5.115-4.862,11.468,11.468,0,0,0,1.51-4.919,7.611,7.611,0,0,0,1.081.08,7.44,7.44,0,0,0,2.121-.311,1.3,1.3,0,0,0-.744-2.485,4.775,4.775,0,0,1-5.615-2.4A1.3,1.3,0,1,0,64.8,38.588a7.056,7.056,0,0,0,2.928,3.122,8.751,8.751,0,0,1-1.19,4.516,9.852,9.852,0,0,1-5.758,4.523A16.5,16.5,0,0,1,56.482,46.4a1.3,1.3,0,0,0-2.154,1.444,20.1,20.1,0,0,0,16.807,8.687,21.714,21.714,0,0,0,3.7-.317A1.294,1.294,0,0,0,75.892,54.712Z"/></svg>
              </div>
          </div>
          <div id="header-profile">
            <div id="profile-picture">
              <div id="profile-picture-image-wrapper">
                <img id="profile-picture-image" src="./20240812_213530.jpg"></img>
              </div>
              <div id="profile-picture-bg"></div>
            </div>
            <div id="profile-options">
              <button>Change accounts</button>
              <button>Log out</button>
            </div>
          </div>
        </header>
      </div>
      <main id="dashboard">
        <div id="bottom-left-buttons">
            <button id="share-button">share</button>
            <button id="edit-button">edit</button>
        </div>
        <div id="dashboard-widgets">
        </div>
        <div id="edit-ui">
          <div id="edit-ui-background"/>
          <div id="color-theme-selector">
              <h1>Theme Selector</h1>
              <input type="color" name="colorPicker" value={ rgbToHex(colorTheme) }
              onChange={(e) => {
                const hex = e.target.value // Get hex color from input
                const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16)) || [];
                const newColorTheme = `rgb(${rgb.join(",")})` // Convert to RGB format
                setColorTheme(newColorTheme)
              }}
              />
          </div>
          <div id="background-selector">
            <div id="blur-selector">
              <h1>Blur</h1>
              <input type="range" id="blur-slider" name="slider" min="0" max="300" step="1" value={backgroundBlur} onChange={(e) => {
                setBackgroundBlur(e.target.value)
                document.querySelector(".background-filter").style.setProperty("backdrop-filter", `blur(${e.target.value}px)`)
                document.querySelector(".background-filter").style.setProperty("filter", `blur(${e.target.value}px)`)
              }}/>
            </div>
            <div id="background-image-selector">
              <label id="background-image-uploader-label" htmlFor="background-image-uploader">Background Image</label>
              <input type="file" id="background-image-uploader" name="imageInput" accept="image/*" style={{ display: "none" }}/>

              <select id="background-image-sizing-selector" name="dropdown" onChange={(e) => {
                document.querySelector(".background-filter").style.setProperty("background-size", e.target.value)
                console.log(e.target.value)
              }}>
                  <option value="cover">Cover</option>
                  <option value="auto">Mosaic</option>
              </select>
            </div>
          </div>
          <div id="widget-selector">
            <div className="widget-selector-widget" data-value="WeatherWidget">Weather</div>
            <div className="widget-selector-widget" data-value="TemperatureWidget">Temperature</div>
            <div className="widget-selector-widget" data-value="TodoList">To Do List</div>
          </div>
        </div>
      </main>
      <div id="react-element-buffer" style={{ position: "absolute", display: "none" }}></div>
    </>
    );
} 
