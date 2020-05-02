import { Gpio } from 'onoff';

export class Motor {

    private _forwardPin: Gpio;
    private _backwardPin: Gpio;

    constructor(forwardPin: number, backwardPin: number) { 
        this._forwardPin = new Gpio(forwardPin, 'out');
        this._backwardPin = new Gpio(backwardPin, 'out');
    }

    forward() {
        this._forwardPin.writeSync(1);
        this._backwardPin.writeSync(0);
    }

    backward() {
        this._forwardPin.writeSync(0);
        this._backwardPin.writeSync(1);
    }

    stop() {
        this._forwardPin.writeSync(0);
        this._backwardPin.writeSync(0);
    }
}