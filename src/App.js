import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 100,
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
      box: [],
      route: 'signin',
      isSignedIn: false,
      user: {
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
        }
      })
  }

  /*componentDidMount(){
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log);
  }*/

  calculateFaceLocation = (data) =>{
    const regions = data.outputs[0].data.regions;
    let boxes = [];
    for(let i = 0; i < regions.length; i++){
      const clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
      console.log(data);
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      boxes.push({
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        })
    }
    
    return boxes;
  }

  createBox = (box) => {
    return <FaceRecognition box={box} imageUrl={this.state.imageUrl}/>;
  }

  displayFaceBox = (box) =>{
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = (event) => {
    this.setState({imageUrl: this.state.input});

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(res => res.json())    
    .then(res => {
      if(res){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(res))
      
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState);
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render(){
    const {imageUrl, box, route, isSignedIn} = this.state;
    return (
      <div className="App">
        <Particles className = "particles" params={particleOptions}/>                
        <Navigation isSignedIn= {isSignedIn} onRouteChange= {this.onRouteChange}/> 
        {this.state.route === 'home' 
          ? <div>
              <Logo/>      
              <Rank 
                userName = {this.state.user.name} 
                userEntries = {this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onButtonSubmit = {this.onButtonSubmit}/>
              
              <FaceRecognition box={box} imageUrl={imageUrl}/>
              
            </div>
            : (
                route === 'signin' || route === 'signout'
                ? <Signin 
                    onRouteChange= {this.onRouteChange}
                    loadUser= {this.loadUser}/> 
                : <Register 
                      onRouteChange= {this.onRouteChange} 
                      loadUser= {this.loadUser}/> 
              )
        }       
      </div>
    );
  }
}

export default App;
