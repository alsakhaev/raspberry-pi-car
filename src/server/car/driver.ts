import { Motor } from "./motor";

export class Driver {
    
    private _leftMotor: Motor;
    private _rightMotor: Motor;

    constructor() {
        this._leftMotor = new Motor(27, 22, 12);
        this._rightMotor = new Motor(4, 17, 13);
    }

    forward() {
        this._leftMotor.forward();
        this._rightMotor.forward();
    }

    forwardLeft() {
        this._leftMotor.stop();
        this._rightMotor.forward();
    }

    forwardRight() {
        this._leftMotor.forward();
        this._rightMotor.stop();
    }

    backward() {
        this._leftMotor.backward();
        this._rightMotor.backward();
    }

    backwardLeft() {
        this._leftMotor.stop();
        this._rightMotor.backward();
    }

    backwardRight() {
        this._leftMotor.backward();
        this._rightMotor.stop();
    }

    left() {
        this._leftMotor.backward();
        this._rightMotor.forward();
    }

    right() {
        this._leftMotor.forward();
        this._rightMotor.backward();
    }

    stop() {
        this._leftMotor.stop();
        this._rightMotor.stop();
    }
}