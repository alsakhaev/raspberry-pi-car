import * as React from 'react';
import io from 'socket.io-client';
//import WSAvcPlayer from 'h264-live-player';
import { WebSocketSignalingChannel } from './webrtc/websocket_signaling';
import './scss/app';

const hostname = document.location.hostname;
const carWsApi = `ws://${hostname}:8080`;
const cameraWsApi = `ws://${hostname}:8889/rws/ws`

class App extends React.Component<IAppProps, IAppState> {

	private canvas = React.createRef<HTMLCanvasElement>();
	private video = React.createRef<HTMLVideoElement>();
	private wsSignalingChannel: WebSocketSignalingChannel;
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

		// car driving websocket initialization
		this.socket = io.connect(carWsApi);
	}

	updateCarCommand() {
		const buf = this.keyBuffer;
		const cmd = parseInt([buf['KeyW'], buf['KeyA'], buf['KeyS'], buf['KeyD']].map(x => x ? '1' : '0').join(''), 2);

		if (this.lastCmd === cmd) return;

		const cmdMap: { [cmd: number]: string } = {
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

		// const uri = `ws://${document.location.hostname}:8081`;
		// const wsavc = new WSAvcPlayer(this.canvas.current, "webgl", 1, 35);
		// wsavc.connect(uri);

		// this.wsavc = wsavc;

		this.wsSignalingChannel = new WebSocketSignalingChannel(this.video.current, cameraWsApi);	
	}

	render() {
		return (
			<main className="container my-5">
				{/* <h1 className="text-primary text-center">Hello {this.state.name}!</h1> */}
				<div>
					<video className="video" ref={this.video} autoPlay playsInline muted ></video>
				</div>

				<div>
					<button type="button" onClick={() => this.wsSignalingChannel.doSignalingConnect()}>Connect</button>
					<button type="button" onClick={() => this.wsSignalingChannel.doSignalingDisconnnect()}>Disconnect</button>
				</div>
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
