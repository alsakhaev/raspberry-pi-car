import { Driver } from "./driver";
import { DistanceSensor } from "./distanceSensor";

export class Car {
    driver = new Driver();
    distance = new DistanceSensor(18, 24);
}