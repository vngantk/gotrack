import {UseCase, UseCaseType} from "./UseCase";
import {Stop} from "../../domain/entities/Stop";
import {Route} from "../../domain/entities/Route";
import {Trip} from "../../domain/entities/Trip";
import {StopTime} from "../../domain/entities/StopTime";

export class QueryStopsByLocation extends UseCase<{ location: [number, number]; radius?: number; },
    Array<Stop & {
        routes: Array<Route & {
            trips: Array<Trip & StopTime>
        }>
    }>> {

    constructor() {
        super(UseCaseType.QUERY);
    }
}
