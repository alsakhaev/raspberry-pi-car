import { Gpio } from 'pigpio';

export class DistanceSensor {

  private _trigger: Gpio;
  private _echo: Gpio;

  constructor(triggerPin: number, echoPin: number) {
    this._trigger = new Gpio(triggerPin, { mode: Gpio.OUTPUT });
    this._echo = new Gpio(echoPin, { mode: Gpio.INPUT, alert: true });
  }

  async measure(): Promise<number> {
    return new Promise((res, rej) => {
      // The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
      const MICROSECDONDS_PER_CM = 1e6 / 34321;

      this._trigger.digitalWrite(0); // Make sure trigger is low
      this._trigger.trigger(10, 1);

      let startTick: number;

      this._echo.on('alert', (level, tick) => {
        if (level == 1) {
          startTick = tick;
        } else {
          const endTick = tick;
          const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
          res(diff / 2 / MICROSECDONDS_PER_CM);
        }
      });

      // ToDo: reject timeout
    });
  }
}