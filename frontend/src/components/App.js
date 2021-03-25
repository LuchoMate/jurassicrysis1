import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            height : window.innerHeight,
            width : window.innerWidth
        }

    }

    componentDidMount() {
        console.log(this.state.height);
        console.log(this.state.width);
        console.log('Hola');
    }

    render() {
        return <h1>React App 2</h1>
    }
}

//ReactDOM.render(<App />, document.getElementById('root'))