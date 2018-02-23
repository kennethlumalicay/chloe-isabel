import React, { Component } from 'react';
import './ant.css';

const Ant = props => (
  <div className='ant' style={{borderColor: props.ant.color}}>
    <h3>{props.ant.name}</h3>
    <p>{props.ant.weight}mg / {props.ant.length}mm</p>
    <p>
      {
        props.ant.testing
          ? `Testing in progress`
          : props.ant.win
            ? `${(props.ant.win * 100).toFixed(1)}% win likelihood`
            : `Not yet tested`
      }
    </p>
  </div>
);

export default Ant;