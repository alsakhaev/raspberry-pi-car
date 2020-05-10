import pigpio from 'pigpio';
import { Gpio } from 'pigpio';

pigpio.configureSocketPort(8082);

const PWM_FREQUENCY = 4000;

export class Motor {

    private _forwardPin: Gpio;
    private _backwardPin: Gpio;
    private _pwmPin: Gpio;

    constructor(forwardPin: number, backwardPin: number, pwmPin: number) {
        this._forwardPin = new Gpio(forwardPin, { mode: Gpio.OUTPUT });
        this._backwardPin = new Gpio(backwardPin, { mode: Gpio.OUTPUT });
        this._pwmPin = new Gpio(pwmPin, { mode: Gpio.OUTPUT });
        this.stop();
    }

    forward(speed: number = 100) {
        this._pwmPin.hardwarePwmWrite(PWM_FREQUENCY, this._toDutyCycle(speed));
        this._forwardPin.digitalWrite(1);
        this._backwardPin.digitalWrite(0);
    }

    backward(speed: number = 100) {
        this._pwmPin.hardwarePwmWrite(PWM_FREQUENCY, this._toDutyCycle(speed));
        this._forwardPin.digitalWrite(0);
        this._backwardPin.digitalWrite(1);
    }

    stop() {
        this._pwmPin.hardwarePwmWrite(PWM_FREQUENCY, 0);
        this._forwardPin.digitalWrite(0);
        this._backwardPin.digitalWrite(0);
    }

    private _toDutyCycle(percent: number) {
        // 0 => 750000
        if (percent < 0) percent = 0;
        if (percent > 100) percent = 100;
        return Math.round(percent * 10000);
    }
}