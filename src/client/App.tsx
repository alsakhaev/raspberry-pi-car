import * as React from 'react';
import io from 'socket.io-client';
import WSAvcPlayer from 'h264-live-player';

class App extends React.Component<IAppProps, IAppState> {

	private canvas = React.createRef<HTMLCanvasElement>();
	private wsavc: any;
	private socket: SocketIOClient.Socket;

	private keyBuffer: { [keyCode: string]: boolean } = {
		'KeyW': false,
		'KeyA': false,
		'KeyS': false,
		'KeyD': false
	};

	private lastCmd: number = 0;

	constructor(props: IAppProps) {
		super(props);
		this.state = {
			name: null
		};
		
		document.addEventListener('keydown', ({ code }) => {
			this.keyBuffer[code] = true;
			this.updateCarCommand();
		});

		document.addEventListener('keyup', ({ code }) => {
			this.keyBuffer[code] = false;
			this.updateCarCommand();
		});

		// camera stream initialization
		const uri = `ws://${document.location.hostname}:8081`;
		this.wsavc = new WSAvcPlayer(this.canvas, "webgl", 1, 35);
		this.wsavc.connect(uri);

		// car driving websocket initialization
		this.socket = io.connect('/');
	}

	updateCarCommand() {
		const buf = this.keyBuffer;
		const cmd = parseInt([buf['KeyW'], buf['KeyA'], buf['KeyS'], buf['KeyD']].map(x => x ? '1' : '0').join(''), 2);
		
		if (this.lastCmd === cmd) return;

		const cmdMap = {
			0: 'stop',
			1: 'right',
			2: 'backward',
			3: 'backward-right',
			4: 'left',
			5: 'stop',
			6: 'backward-left',
			7: 'backward',
			8: 'forward',
			9: 'forward-right',
			10: 'stop',
			11: 'right',
			12: 'forward-left',
			13: 'forward',
			14: 'left',
			15: 'stop'
		};
		
		this.lastCmd = cmd;
		this.socket.emit(`car/driver/${cmdMap[cmd]}`);
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
				<button type="button" onClick={() => this.wsavc.playStream()}>Start Video</button>
				<button type="button" onClick={() => this.wsavc.stopStream()}>Stop Video</button>
				<button type="button" onClick={() => this.wsavc.disconnect()}>Disconnect</button>
				<canvas ref={this.canvas} />
			</main>
		);
	}
}

export interface IAppProps { }

export interface IAppState {
	name: string;
}

export default App;
