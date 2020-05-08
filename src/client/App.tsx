import * as React from 'react';
import io from 'socket.io-client';
import WSAvcPlayer from 'h264-live-player';

class App extends React.Component<IAppProps, IAppState> {

	private canvas = React.createRef<HTMLCanvasElement>();
	private wsavc: any;

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

		const uri = `ws://${document.location.hostname}:8081`;
		const wsavc = new WSAvcPlayer(this.canvas.current, "webgl", 1, 35);
		wsavc.connect(uri);

		this.wsavc = wsavc;

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
				<button type="button" onClick={() => this.wsavc.playStream()}>Start Video</button>
				<button type="button" onClick={() => this.wsavc.stopStream()}>Stop Video</button>
				<button type="button" onClick={() => this.wsavc.disconnect()}>Disconnect</button>
				<canvas ref={this.canvas}/>
			</main>
		);
	}
}

export interface IAppProps { }

export interface IAppState {
	name: string;
}

export default App;
