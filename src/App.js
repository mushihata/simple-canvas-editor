import React, { Component } from "react";
import JSONSidbar from "./JSONSidebar";
import ScreenSizeForm from "./ScreenSizeForm";
import StageView from "./StageView";
import {
  exportPNG,
  exportBMP,
  titleCase,
  arrayManualSort,
} from "./helpers/helpers";
import defaultTemplate, {
  rectJSON,
  circleJSON,
  textJSON,
  imageJSON,
  lineJSON,
} from "./templates";
import "./App.css";

// const STR = "{\"attrs\":{\"width\":400,\"height\":400},\"className\":\"Stage\",\"children\":[{\"attrs\":{},\"className\":\"Layer\",\"children\":[{\"attrs\":{\"text\":\"Some text on canvas\",\"fontSize\":15,\"fill\":\"black\"},\"className\":\"Text\"},{\"attrs\":{\"width\":500,\"height\":500,\"fill\":\"white\",\"stroke\":\"back\",\"strokeWidth\":0.1},\"className\":\"Rect\"},{\"attrs\":{\"x\":20,\"y\":50,\"width\":100,\"height\":100,\"fill\":\"red\"},\"className\":\"Rect\"},{\"attrs\":{\"x\":200,\"y\":100,\"radius\":50,\"fill\":\"white\",\"stroke\":\"red\",\"strokeWidth\":5},\"className\":\"Circle\"},{\"attrs\":{\"x\":20,\"y\":200,\"points\":[0,0,100,0,100,100],\"closed\":true,\"stroke\":\"black\",\"fill\":\"red\"},\"className\":\"Line\"}]}]}"

class App extends Component {
  stage = null;

  constructor(props) {
    super(props);
    this.state = {
      stage: JSON.stringify(defaultTemplate()),
      focus: undefined,
      screenSize: "400,300",
      zoom: 100,
    };
  }

  handleScreenSizeChange = (e) => {
    this.setState(() => {
      const stageJSON = this.getStageJSON();
      stageJSON.attrs.width = parseInt(e.target.value.split(",")[0]);
      stageJSON.attrs.height = parseInt(e.target.value.split(",")[1]);
      stageJSON.children[0].children[0].attrs.width = parseInt(
        e.target.value.split(",")[0]
      );
      stageJSON.children[0].children[0].attrs.height = parseInt(
        e.target.value.split(",")[1]
      );
      return {
        stage: JSON.stringify(stageJSON),
        screenSize: e.target.value,
        zoom: 100,
      };
    });
  };

  handleTextareaChange = (e) => {
    const stageJSON = JSON.parse(e.target.value);
    this.setState({
      stage: e.target.value,
      form: {
        screenSize: parseInt(
          `${stageJSON.attrs.width},${stageJSON.attrs.height}`
        ),
      },
    });
  };

  pasteJSONIntoTextarea = () => {
    navigator.clipboard.readText().then((json) => {
      console.log(json);
      this.setState({ stage: json });
    });
  };

  getStageJSON = () => JSON.parse(this.state.stage);
  getShapesArr = () => this.getStageJSON().children[0].children;
  getShape = (index) => this.getShapesArr()[index].attrs;


  deleteShape = (e) => {
    console.log("cl");
    const index = parseInt(e.target.dataset.index);
    const json = this.getStageJSON();
    const shapes = this.getShapesArr();
    shapes.splice(index, 1);
    console.log(shapes);
    json.children[0].children = shapes;
    this.setState({ stage: JSON.stringify(json) });
  };

  order = (e) => {
    this.focus(e);
    const oldIndex = parseInt(e.target.dataset.index);
    const newIndex =
      e.target.dataset.send === "up" ? oldIndex + 1 : oldIndex - 1;
    const orderedArr = arrayManualSort(this.getShapesArr(), oldIndex, newIndex);
    const json = this.getStageJSON();
    json.children[0].children = orderedArr;
    this.setState({ stage: JSON.stringify(json) });
  };

  focus = (e) => {
    if (
      e.target.dataset.send ||
      this.state.focus === parseInt(e.target.dataset.index)
    ) {
      this.setState({ focus: undefined });
    } else {
      this.setState({ focus: parseInt(e.target.dataset.index) });
    }
  };

  handleZoom = (e) => {
    const change = e.target.dataset.change;
    if (change === "in" && this.state.zoom < 200) {
      this.setState({ zoom: this.state.zoom + 10 });
    } else if (change === "out" && this.state.zoom > 10) {
      this.setState({ zoom: this.state.zoom - 10 });
    }
  };

  handleShapeCreation = (e) => {
    const x = parseInt(this.state.screenSize.split(",")[0]) / 2;
    const y = parseInt(this.state.screenSize.split(",")[1]) / 2;
    const shapeClass = e.target.dataset.class;
    const json = this.getStageJSON();
    const shapes = this.getShapesArr();
    console.log(shapes)
    let shape = null;

    switch (shapeClass) {
      case "rect":
        {
          shape = rectJSON(x, y);
        }
        break;
      case "circle":
        {
          shape = circleJSON(x, y);
        }
        break;
      case "text":
        {
          shape = textJSON(x, y);
        }
        break;
      case "line": 
        {
          shape = lineJSON(x, y);
        }
        break;
      case "image": 
        {
          shape = imageJSON();
        }
        break;
    }

    shapes.push(shape);
    json.children[0].children = shapes;
    this.setState({ stage: JSON.stringify(json), focus: shapes.length - 1 });
  };

  handleShapeInput = (e) => {
    const index = parseInt(e.target.dataset.index);
    const json = this.getStageJSON();
    const shape = this.getShape(index);
    shape[e.target.name] =
      e.target.name === "fill" ||
      e.target.name === "stroke" ||
      e.target.name === "text" ||
      e.target.name === "points" ||
      e.target.name === "image" ||
      e.target.naem === "fontFamily" ||
      e.target.naem === "scaleY" ||
      e.target.naem === "scaleX"
        ? e.target.value
        : parseInt(e.target.value);
    json.children[0].children[e.target.dataset.index].attrs = shape;
    this.setState({ stage: JSON.stringify(json) });
  };

  render() {
    return (
      <div className="container-fluid h-100 bg-light d-flex flex-column justify-content-between py-4 border">
        <div className="d-flex w-100 h-100 bg-light">
          <div className="col-3 border mr-1 py-3 shadow">
            <div className="form-group d-flex justify-content-end">
              <button
                className="btn btn-sm btn-secondary mr-2"
                onClick={exportPNG}
                title="Extra feature"
              >
                Save screen (.png)
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={exportBMP}
                title="Save the image to broadcast it into screens..."
              >
                Save screen (.bmp)
              </button>
            </div>
            <ScreenSizeForm
              screenSize={this.state.screenSize}
              handleScreenSizeChange={this.handleScreenSizeChange}
            />
            <div>
              {["rect", "circle", "text","line", "image"].map((shape) => (
                <button
                  className="btn btn-sm btn-primary mr-2"
                  data-class={shape}
                  onClick={this.handleShapeCreation}
                >
                  {titleCase(shape)}
                </button>
              ))}
            </div>
            <div className="h-75 overflow-auto mt-2 ">
              <div className="d-flex flex-column flex-column-reverse">
                {JSON.parse(this.state.stage).children[0].children.map(
                  (shape, i) => (
                    <div className="d-flex flex-column card">
                      <div
                        className="card-header"
                        data-index={i}
                        onClick={this.focus}
                      >
                        <div
                          className="d-flex justify-content-between"
                          data-index={i}
                          onClick={this.focus}
                        >
                          <div data-index={i} onClick={this.focus}>
                            <div
                              className="btn mr-2"
                              data-index={i}
                              onClick={this.focus}
                            >
                              <span
                                className="h4"
                                data-index={i}
                                onClick={this.focus}
                              >
                                {i === 0
                                  ? "Background"
                                  : titleCase(shape.className)}
                              </span>
                              <span data-index={i} onClick={this.focus}>
                                {" "}
                                {shape.className === "Text" &&
                                  `(${shape.attrs.text})`}
                              </span>
                            </div>
                          </div>
                          {i > 0 && (
                            <div data-index={i} onClick={this.focus}>
                              <button
                                className="btn btn-sm btn-outline-info mr-2"
                                data-index={i}
                                data-send="up"
                                onClick={this.order}
                              >
                                /\
                              </button>
                              <button
                                className="btn btn-sm btn-outline-info mr-2"
                                data-index={i}
                                data-send="down"
                                onClick={this.order}
                              >
                                \/
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                data-index={i}
                                onClick={this.deleteShape}
                              >
                                X
                              </button>
                            </div>
                          )}
                        </div>
                        {/* <div>{shape.className === "Text" && `(${shape.attrs.text})` }</div>  */}
                      </div>
                      <div
                        key={i}
                        className={
                          this.state.focus !== i
                            ? "card-body collapse"
                            : "card-body"
                        }
                      >
                        {Object.keys(this.getShape(i)).map((key, j) => (
                          <div
                            key={j}
                            className="form-group d-flex justify-content-between"
                          >
                            <label className="mr-2">{titleCase(key)}</label>
                            <div>
                              {key === "fill" ||
                              key === "stroke" ||
                              key === "text" ||
                              key === "points" ||
                              key === "image" ||
                              key === "fontFamily" ? (
                                <input
                                  name={key}
                                  className="form-control form-control-sm"
                                  type="text"
                                  value={this.getShape(i)[key]}
                                  onChange={this.handleShapeInput}
                                  data-index={i}
                                />
                              ) : (
                                <input
                                  name={key}
                                  className="form-control form-control-sm"
                                  type="number"
                                  value={this.getShape(i)[key]}
                                  onChange={this.handleShapeInput}
                                  data-index={i}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <StageView
            stage={this.state.stage}
            zoom={this.state.zoom}
            handleZoom={this.handleZoom}
          />
          <JSONSidbar
            stage={this.state.stage}
            pasteJSONIntoTextarea={this.pasteJSONIntoTextarea}
          />
        </div>
      </div>
    );
  }
}

export default App;
