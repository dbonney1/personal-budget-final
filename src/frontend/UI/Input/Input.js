import React from 'react';

const input = (props) => {
    return (
        <input className={props.inputClass} placeholder={props.placeholder} type={props.type} name={props.name} onChange={props.change} value={props.value} />
    );
}

export default input;