import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from "drizzle";
import drizzleOptions from './drizzleOptions'
import App from './App';
import './index.css';

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);
ReactDOM.render(<App drizzle={drizzle}/>, document.getElementById('root'));