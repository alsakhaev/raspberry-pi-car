import * as React from 'react';
import io from 'socket.io-client';

class App extends React.Component<IAppProps, IAppState> {
	constructor(props: IAppProps) {
		super(props);
		this.state = {
			name: null
		};

		const socket = io.connect('/');
		document.addEventListener('keydown', function (event) {
			if (event.code === 'KeyW') {
				socket.emit('car/driver/forward');
			} else if (event.code === 'KeyA') {
				socket.emit('car/driver/left');
			} else if (event.code === 'KeyS') {
				socket.emit('car/driver/backward');
			} else if (event.code === 'KeyD') {
				socket.emit('car/driver/right');
			}
		});

		document.addEventListener('keyup', function (event) {
			if (event.code === 'KeyW') {
				socket.emit('car/driver/stop');
			} else if (event.code === 'KeyA') {
				socket.emit('car/driver/stop');
			} else if (event.code === 'KeyS') {
				socket.emit('car/driver/stop');
			} else if (event.code === 'KeyD') {
				socket.emit('car/driver/stop');
			}
		});
	}

	async componentDidMount() {
		try {
			let r = await fetch('/api/hello');
			let name = await r.json();
			this.setState({ name });
		} catch (error) {
			console.log(error);
		}
	}

	render() {
		return (
			<main className="container my-5">
				<h1 className="text-primary text-center">Hello {this.state.name}!</h1>
			</main>
		);
	}
}

export interface IAppProps { }

export interface IAppState {
	name: string;
}

export default App;
