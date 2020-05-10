import * as React from 'react';
import io from 'socket.io-client';
//import WSAvcPlayer from 'h264-live-player';
import { WebSocketSignalingChannel } from './webrtc/websocket_signaling';
import './App.css';

const hostname = '192.168.100.221'; //document.location.hostname;
const carWsApi = `ws://${hostname}:8081`;
const cameraWsApi = `ws://${hostname}:8889/rws/ws`

class App extends React.Component<IAppProps, any> {

	private canvas = React.createRef<HTMLCanvasElement>();
	private video = React.createRef<HTMLVideoElement>();
	private wsSignalingChannel?: WebSocketSignalingChannel;
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
			name: null,
			speed: 100,
			cameraOpened: false
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
		this.sendCarCommand(cmdMap[cmd]);
	}

	sendCarCommand(cmd: string) {
		this.socket.emit(`car/driver/${cmd}`, this.state.speed);
	}

	async componentDidMount() {
		this.wsSignalingChannel = new WebSocketSignalingChannel(this.video.current, cameraWsApi);
		this.wsSignalingChannel.onopen = () => this.setState({ cameraOpened: true });
		this.wsSignalingChannel.onclose = () => this.setState({ cameraOpened: false });
	}

	render() {
		return (
			<main>
				<div>
					<video className="video" ref={this.video} autoPlay playsInline muted ></video>
				</div>

				<div>
					<span>{(this.state.cameraOpened ? "Connected" : "Disconnected")}</span>
					<button type="button" onClick={() => this.wsSignalingChannel?.doSignalingConnect()}>Connect</button>
					<button type="button" onClick={() => this.wsSignalingChannel?.doSignalingDisconnnect()}>Disconnect</button>
				</div>
				<div>
					Speed
					<input type="range" value={this.state.speed} min="0" max="100" onChange={(e) => (this.setState({ speed: e.target.value }))} />
				</div>
				<div>
					<button className="controlButton" type="button" onTouchStart={() => this.sendCarCommand('forward')} onTouchEnd={() => this.sendCarCommand('stop')}>Forward</button></div>
				<div>
					<button className="controlButton2" type="button" onTouchStart={() => this.sendCarCommand('left')} onTouchEnd={() => this.sendCarCommand('stop')}>Left</button>
					<button className="controlButton2" type="button" onTouchStart={() => this.sendCarCommand('right')} onTouchEnd={() => this.sendCarCommand('stop')}>Right</button>
				</div>
				<div>
					<button className="controlButton" type="button" onTouchStart={() => this.sendCarCommand('backward')} onTouchEnd={() => this.sendCarCommand('stop')}>Backward</button>
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
