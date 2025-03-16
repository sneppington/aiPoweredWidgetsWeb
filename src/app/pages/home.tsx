"use client";

import { match } from "assert";
import Image from "next/image";
import Link from 'next/link';
import { Node } from "postcss";
import { useEffect } from "react";
import DashboardBrowse from "./dashboardBrowse"

// Widgets
import WeatherWidget from "../widgets/weather";
import TemperatureWidget from "../widgets/temperature";
import TodoList from "../widgets/todo";

export default function Home() {

  function randi(options: number): number {
    return Math.floor(Math.random() * options)
  }

  function generateShadesFromRgb(rgb: string, numberOfShades: number): string[] {
    const shades: string[] = [];
    const [r, g, b] = parseRgbString(rgb);
  
    for (let i = 0; i < numberOfShades; i++) {
      const factor = 1 - (i / numberOfShades);
      shades.push(`rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`);
    }
  
    return shades;
  }
  
  function parseRgbString(rgb: string): number[] {
    const result = rgb.match(/\d+/g);
    return result ? result.map(Number) : [0, 0, 0];
  }

  function darkenColor(rgbColor: string): string {
    // Extract RGB values from the input string
    const rgb = rgbColor.match(/\d+/g);
    if (!rgb) throw new Error("Invalid RGB color format");

    let r = parseInt(rgb[0]);
    let g = parseInt(rgb[1]);
    let b = parseInt(rgb[2]);

    // Darken the color by reducing each component by 20%
    r = Math.max(0, Math.floor(r * 0.8));
    g = Math.max(0, Math.floor(g * 0.8));
    b = Math.max(0, Math.floor(b * 0.8));

    // Return the darker color as an RGB string
    return `rgb(${r}, ${g}, ${b})`;
  }

  let colors = [
    "rgb(70, 130, 180)", // Steel Blue
    "rgb(255, 196, 0)",  // Gold
    "rgb(147, 112, 219)", // Medium Purple
    "rgb(255, 105, 180)", // Hot Pink
    "rgb(255, 255, 255)", // White
    "rgb(106, 90, 205)", // Slate Blue
    "rgb(0, 206, 209)"   // Dark Turquoise
  ]

  let colorTheme = colors[randi(7)]
  let shades = generateShadesFromRgb(colorTheme, 15)
  let darkerShade = darkenColor(colorTheme)

  useEffect(() => {
    document.documentElement.style.setProperty('--colorTheme', colorTheme) // Setting the theme color

    // Setting the header's color

    const landingHeader: HTMLElement = document.querySelector("#page-header")!

    landingHeader.style.background = `linear-gradient(to top, ${darkerShade}, rgba(0,0,0,0) 100%)`

    // Adding other colors

    document.querySelector("#AI-span").style.color = colorTheme

    // Adding random shapes to bg

    const bgShapesWrapper: HTMLElement = document.querySelector("#background-shapes-wrapper")!

    function addRandomShape() {
      let shape = document.createElement("div");

      shape.style.backgroundColor = "white"
      shape.style.transition = "background-color cubic-bezier(0.075, 0.82, 0.165, 1) 1s"
      
      shape.style.position = "absolute"
      shape.style.left = `${Math.random() * 100}%`
      shape.style.top = `${Math.random() * 100}%`

      shape.style.height = `${Math.random() * 20 + 20}vw`
      shape.style.width = `${Math.random() * 20 + 20}vw`

      if(randi(2) === 0) { // Circle or square
        shape.style.borderRadius = "50%"
      } else {
        shape.style.rotate = `${Math.random() * 90}deg` // Rotation wont matter if it is a circle
      }

      bgShapesWrapper?.appendChild(shape)

      shape.style.backgroundColor = shades[randi(15)] // Shape needs to get white color first to then transition to theme color
    }

    for (let i = 0; i < 10; i++) {
      addRandomShape()
    }

    // Rgister Login

    let headerRegButton = document.querySelector("#page-header .register-button")
    let registerButton = document.querySelector("#register .register-button")

    headerRegButton.addEventListener("click", () => {
      document.querySelector("#landing-register-logIn-wrapper").style.transform = "translateX(-100vw)"

      document.querySelector("#page-header .register-button-wrapper").style.transform = "translateY(calc(-100% - 50px))"
      document.querySelector("#page-header .register-button-wrapper").style.width = "0px"
      registerButton.style.transform = "translateY(0)"

      headerLogButton.style.transform = ""
      loginButton.style.transform = "translateY(30vh)"
    })

    let headerLogButton = document.querySelector("#page-header .login-button")
    let loginButton = document.querySelector("#login .login-button")

    headerLogButton.addEventListener("click", () => {
      document.querySelector("#landing-register-logIn-wrapper").style.transform = "translateX(100vw)"

      headerLogButton.style.transform = "translateY(calc(-100% - 50px))"
      loginButton.style.transform = "translateY(0)"

      document.querySelector("#page-header .register-button-wrapper").style.transform = ""
      document.querySelector("#page-header .register-button-wrapper").style.width = ""
      registerButton.style.transform = "translateY(30vh)"
    })

    document.querySelector("#brand")?.addEventListener("click", () => {
      document.querySelector("#landing-register-logIn-wrapper").style.transform = ""

      document.querySelector("#page-header .register-button-wrapper").style.transform = ""
      document.querySelector("#page-header .register-button-wrapper").style.width = ""
      registerButton.style.transform = "translateY(30vh)"

      headerLogButton.style.transform = ""
      loginButton.style.transform = "translateY(30vh)"
    })

  }, [])

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
                <h1>Dashboard AI</h1>
              </div>
              <div id="nav-buttons">
                <button className="login-button">
                  Log in
                </button>
                <div className="register-button-wrapper">
                  <button className="register-button">
                    Register
                  </button>
                </div>
              </div>
          </div>
        </header>
        <div id="landing-register-logIn-wrapper">
          <div id="landing">
            <div id="content-wrapper">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                <main id="landing-main">
                  <div id="buzzwords-title">
                    Your own <span id="AI-span">AI</span> enchanced dashboard
                  </div>
                  <div className="wrapper">
                    <button id="create-new-dashboard-button">
                      Start a new dashboard
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="20%" viewBox="0 0 1280.000000 640.000000" preserveAspectRatio="xMidYMid meet">
                        <metadata>
                        Created by potrace 1.15, written by Peter Selinger 2001-2017
                        </metadata>
                        <g transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)" stroke="none">
                        <path d="M9280 5934 c-106 -21 -223 -80 -293 -150 -99 -97 -148 -196 -168 -336 -10 -72 -9 -97 5 -164 22 -108 75 -212 144 -282 33 -33 391 -297 851 -627 l794 -570 -5084 -5 c-4763 -5 -5087 -6 -5132 -22 -146 -52 -265 -152 -330 -275 -114 -217 -77 -472 93 -644 70 -71 126 -108 217 -142 l58 -22 5078 -5 5078 -5 -752 -615 c-414 -338 -776 -638 -804 -667 -29 -29 -68 -84 -89 -125 -112 -224 -73 -470 105 -649 104 -105 233 -159 382 -159 99 0 186 22 270 68 70 39 2847 2303 2942 2399 160 162 199 422 93 633 -46 94 -119 163 -324 311 -1086 782 -2701 1940 -2747 1970 -83 54 -166 80 -272 84 -49 2 -101 1 -115 -1z"/>
                        </g>
                      </svg>
                    </button>
                  </div>
                </main>
                <aside id="widget-showoff-wrapper">
                  <WeatherWidget/>
                  <TemperatureWidget/>
                  <TodoList mode={ "showoff" }/>
                </aside>
              </div>
            </div>
          </div>
          <div id="register">
            <form>
              <input id="reg-name" type="text" placeholder="username"></input>
              <input id="reg-pass" type="password" placeholder="password"></input>
              <input id="reg-pass-repeat" type="password" placeholder="repeat password"></input>
              <button className="register-button" style={{ height: "65px", width: "155px", transform: "translateY(30vh)" }}>Register</button>
            </form>
          </div>
          <div id="login">
            <form>
              <input id="log-name" type="text" placeholder="username"></input>
              <input id="log-pass" type="password" placeholder="password"></input>
              <button className="login-button" style={{ height: "65px", width: "155px", transform: "translateY(30vh)" }}>Log in</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
