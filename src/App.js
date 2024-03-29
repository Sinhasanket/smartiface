import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageForm from './Components/ImageForm/ImageForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  } 

  loadUser = (data) =>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  claculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
     this.setState({ box:box })
  }

  onInputChange = (event) =>{
     this.setState({ input: event.target.value })
  }

  onSubmit = () =>{
    this.setState({ imageUrl: this.state.input })
    fetch('https://smartfacebot.herokuapp.com/imageurl',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(res => res.json())
    .then(response => {
      if(response){
        fetch('https://smartfacebot.herokuapp.com/image',{
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.claculateFaceLocation(response))
    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState)
    } else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
           <Particles className="particles"
              params= {particlesOptions }
            />
       <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
       { route === 'home'?
        <div>
        <Logo /> 
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
       <ImageForm onInputChange={ this.onInputChange }
        onSubmit={this.onSubmit}/>
       <FaceRecognition box={box} imageUrl={ imageUrl }/> 
       </div>
       :(
         route === 'signin' ?
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
       )
    }
      </div>
    );
  }
}

export default App;
