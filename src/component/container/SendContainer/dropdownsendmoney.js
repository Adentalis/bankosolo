    import React from 'react';
    import Select from 'react-select';

    const intervals = [
      { label: "alle 15 Tage", value: 1 },
      { label: "zum 1. im Monat", value: 2},
      { label: "alle 3 Monate", value: 3 },
      { label: "alle 6 Monate", value: 4 },  
    ];
    
    const Dropdown = () => (
        <div style={{marginTop: "10px"}} >
        <Select style={{color: "black"}}options={ intervals } />
        </div>
    );
    
    export default Dropdown