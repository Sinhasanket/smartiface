import React from 'react';
import './ImageForm.css';

const ImageForm = ({ onInputChange,onSubmit }) =>{
  return(
      <div>
          <p className="f3">
            {'This Magic Brain Will Detect Faces in your Picture'}
          </p>
          <div className="center">
          <div className="pa4 br3 shadow-5 form center">
          <input 
            className="f4 pa2 w-70 center" type="text" 
            onChange={ onInputChange }/>
              <button 
              className="w-30 grow f4 link ph3 pv2 dib black bg-dark-blue" 
              onClick={ onSubmit }>Detect!</button>
          </div>    
          </div>
      </div>
  )
}

export default ImageForm;