import { useEffect, useRef } from "react";

export default function TodoList({ mode }) {
  const todoWidget = useRef(null);

  useEffect(() => {
    const todoElements = todoWidget.current.querySelectorAll(".todo-element");
    todoElements.forEach((element) => {
      element.addEventListener("click", () => {
        element.style.height = "0px";
        element.style.marginBottom = "0px";
        setTimeout(() => {
          element.style.height = "";
          element.style.marginBottom = "";
        }, 3000);
      });
    });
  }, []);

  switch (mode) {
    case "showoff":
      return (
        <div ref={todoWidget} className="widget-wrapper">
          <div className="background-blur-widget" />
          <div className="content-todo">
            <h1 className="todo-title">
              To <span className="color-theme">Do</span>
            </h1>
            <ul className="todo-list">
              <li className="todo-element" style={{ marginTop: "5px" }}>
                Register
                <div className="todo-element-cross"></div>
              </li>
              <li className="todo-element">
                Create Dashboard
                <div className="todo-element-cross"></div>
              </li>
              <li className="todo-element">
                Enjoy
                <div className="todo-element-cross"></div>
              </li>
            </ul>
          </div>
        </div>
      );
    default:
      return null;
  }
}
