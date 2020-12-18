import React from 'react';

const button = (props) => {
    return (
        <button className={props.buttonClass} type="button" onClick={props.click}>{props.children}</button>
    );
}

export default button;