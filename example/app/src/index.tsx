import React from "react";
import ReactDOM from "react-dom";

const Hello = () => {
    const [text, setText] = React.useState('Hello Atomen!');
    return (
        <span onClick={() => {
            setText('Hi')
        }}>{text}</span>
    )
}

const root = ReactDOM.createRoot(document.getElementById('atomen'));
root.render(React.createElement(Hello))