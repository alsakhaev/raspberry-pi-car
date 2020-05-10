import { Motor } from "./motor";

export class Driver {
    
    private _leftMotor: Motor;
    private _rightMotor: Motor;

    constructor() {
        this._leftMotor = new Motor(27, 22, 13);
        this._rightMotor = new Motor(4, 17, 12);
    }

    forward(speed: number = 100) {
        this._leftMotor.forward(speed);
        this._rightMotor.forward(speed);
    }

    forwardLeft(speed: number = 100) {
        this._leftMotor.stop();
        this._rightMotor.forward(speed);
    }

    forwardRight(speed: number = 100) {
        this._leftMotor.forward(speed);
        this._rightMotor.stop();
    }

    backward(speed: number = 100) {
        this._leftMotor.backward(speed);
        this._rightMotor.backward(speed);
    }

    backwardLeft(speed: number = 100) {
        this._leftMotor.stop();
        this._rightMotor.backward(speed);
    }

    backwardRight(speed: number = 100) {
        this._leftMotor.backward(speed);
        this._rightMotor.stop();
    }

    left(speed: number = 100) {
        this._leftMotor.backward(speed);
        this._rightMotor.forward(speed);
    }

    right(speed: number = 100) {
        this._leftMotor.forward(speed);
        this._rightMotor.backward(speed);
    }

    stop() {
        this._leftMotor.stop();
        this._rightMotor.stop();
    }
}