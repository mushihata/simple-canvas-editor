import Konva from "konva";

export default function defaultTemplate() {
  return {
    attrs: {
      width: 400,
      height: 300,
    },
    className: "Stage",
    children: [
      {
        attrs: {},
        className: "Layer",
        children: [
          {
            attrs: {
              x: 0,
              y: 0,
              width: 400,
              height: 300,
              fill: "white",
            },
            className: "Rect",
          },
          {
            attrs: {
              x: 400,
              y: 300,
              radius: 100,
              fill: "",
              stroke: "red",
              strokeWidth: 4,
            },
            className: "Circle",
          },
          {
            attrs: {
              x: 400,
              y: 300,
              radius: 50,
              fill: "",
              stroke: "red",
              strokeWidth: 10,
            },
            className: "Circle",
          },
          {
            attrs: {
              x: 85,
              y: 130,
              text: "€9.99",
              fontSize: 100,
              fontFamily: "Calibri",
              fill: "black",
            },
            className: "Text",
          },
          {
            attrs: {
              x: 0,
              y: 10,
              width: 400,
              height: 62,
              fill: "red",
              stroke: "black",
              strokeWidth: 3,
            },
            className: "Rect",
          },
          {
            attrs: {
              x: 150,
              y: 20,
              text: "%3%",
              fontSize: 46,
              fontFamily: "Calibri",
              fill: "black",
            },
            className: "Text",
          },
          {
            attrs: {
              x: 100,
              y: 150,
              points: "-20, -20, 240, 60",
              stroke: "black",
              strokeWidth: 3,
            },
            className: "Line",
          },
        ],
      },
    ],
  };
}

export function rectJSON(x=0, y=0, width=100, height=100, fill="", stroke="black", strokeWidth="3") {
    return {
      attrs: {
        x: x-width/2,
        y: y-height/2,
        width,
        height,
        fill,
        stroke,
        strokeWidth,
      },
      className: "Rect",
    };
  }


export function circleJSON(x=0, y=0, radius=50, fill="", stroke="black", strokeWidth="3") {
  return {
    attrs: {
      x,
      y,
      radius,
      fill,
      stroke,
      strokeWidth,
    },
    className: "Circle",
  };
}

export function textJSON(x= 0, y= 0, text= "%Text%", fontSize= 32, fontFamily= "Calibri", fill= "black") {
  return {
    attrs: {
      x: x-50,
      y: y-16,
      text,
      fontSize,
      fontFamily,
      fill,
    },
    className: "Text",
  }
}


export function imageJSON(x=0, y=0, image="lion.png", scaleX=.5, scaleY=.5) {
  return {
    attrs: {
      image,
      x,
      y,
      scaleX,
      scaleY
    },
    className: "Image",

  }
  
}

export function lineJSON(x=0, y= 0, points="0, 0, 200, 0", stroke="black", strokeWidth=3) {
  return {
    attrs: {
      x: x- 100,
      y,
      points,
      stroke,
      strokeWidth,
    },
    className: "Line",
  }
  
}