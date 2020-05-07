//import { Gpio } from 'onoff';
import { Gpio } from './gpioFake';

export class Motor {

    private _forwardPin: Gpio;
    private _backwardPin: Gpio;
    private _pwmPin: Gpio;

    constructor(forwardPin: number, backwardPin: number, pwmPin: number) { 
        this._forwardPin = new Gpio(forwardPin, 'out');
        this._backwardPin = new Gpio(backwardPin, 'out');
        this._pwmPin = new Gpio(pwmPin, 'out');
        this.stop();
    }

    forward(speed: number = 100) {
        this._pwmPin.writeSync(1);
        this._forwardPin.writeSync(1);
        this._backwardPin.writeSync(0);
    }

    backward(speed: number = 100) {
        this._pwmPin.writeSync(1);
        this._forwardPin.writeSync(0);
        this._backwardPin.writeSync(1);
    }

    stop() {
        this._pwmPin.writeSync(0);
        this._forwardPin.writeSync(0);
        this._backwardPin.writeSync(0);
    }
}