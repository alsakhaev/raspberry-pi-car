export class Gpio {
    constructor(gpio: number, direction: string) {
        console.log(`Fake GPIO: ${gpio} ${direction}.`);
    }

    writeSync(val: number) {
        console.log('writeSync', val);
    }
}