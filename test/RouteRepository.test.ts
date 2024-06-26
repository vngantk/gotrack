import {Route} from "../core/domain/entities/Route";
import {EntryNotFoundError} from "../core/application/exceptions/EntryNotFoundError";
import {RepositoriesImplementations} from "./Repositories.setup";
import {DuplicateEntryError} from "../core/application/exceptions/DuplicateEntryError";

describe.each(RepositoriesImplementations)('RouteRepository', (repo) => {

    const sampleRoute: Route = {
        route_id: '1',
        agency_id: 'A1',
        route_short_name: 'ShortName1',
        route_long_name: 'Long Name 1',
        route_type: 3,
    };

    const anotherRoute: Route = {
        route_id: '2',
        agency_id: 'A2',
        route_short_name: 'ShortName2',
        route_long_name: 'Another Long Name',
        route_type: 3,
    };

    beforeEach(async () => {
        await repo.deleteAllRoutes();
    });

    it('should return all routes', async () => {
        await repo.addRoute(sampleRoute);
        await repo.addRoute(anotherRoute);
        const routes = await repo.getAllRoutes();
        expect(routes).toEqual([sampleRoute, anotherRoute]);
    });

    it('should return an empty array when there are no routes', async () => {
        const routes = await repo.getAllRoutes();
        expect(routes).toEqual([]);
    });

    it('should return the route with the given ID', async () => {
        await repo.addRoute(sampleRoute);
        const route = await repo.getRoute('1');
        expect(route).toEqual(sampleRoute);
    });

    it('should return undefined if no route with the given ID exists', async () => {
        const route = await repo.getRoute('999');
        expect(route).toBeUndefined();
    });

    it('should return the route with the given short name', async () => {
        await repo.addRoute(sampleRoute);
        const route = await repo.getRouteByShortName('ShortName1');
        expect(route).toEqual(sampleRoute);
    });

    it('should return undefined if no route with the given short name exists', async () => {
        const route = await repo.getRouteByShortName('Unknown');
        expect(route).toBeUndefined();
    });

    it('should return all routes whose long name contains the given name pattern', async () => {
        await repo.addRoute(sampleRoute);
        await repo.addRoute(anotherRoute);
        const routes = await repo.searchRoutesByLongName('Long Name');
        expect(routes.length).toBe(2);
        expect(routes).toContainEqual(sampleRoute);
        expect(routes).toContainEqual(anotherRoute);
    });

    it('should return one route whose long name contains the given name pattern', async () => {
        await repo.addRoute(sampleRoute);
        await repo.addRoute(anotherRoute);
        const routes = await repo.searchRoutesByLongName('Another');
        expect(routes.length).toBe(1);
        expect(routes).toContainEqual(anotherRoute);
    });

    it('should return an empty array if no routes match the long name pattern', async () => {
        await repo.addRoute(sampleRoute);
        const routes = await repo.searchRoutesByLongName('Nonexistent');
        expect(routes).toEqual([]);
    });

    it('should add a new route', async () => {
        await repo.addRoute(sampleRoute);
        const routes = await repo.getAllRoutes();
        expect(routes).toEqual([sampleRoute]);
    });

    it('should throw DuplicateEntryError if a route with the same ID already exists', async () => {
        await repo.addRoute(sampleRoute);
        await expect(repo.addRoute(sampleRoute)).rejects.toThrow(DuplicateEntryError);
    });

    it('should update an existing route', async () => {
        await repo.addRoute(sampleRoute);
        const updatedRoute = { ...sampleRoute, route_long_name: 'Updated Long Name' };
        await repo.updateRoute(updatedRoute);
        const route = await repo.getRoute('1');
        expect(route?.route_long_name).toBe('Updated Long Name');
        expect(route).toEqual(updatedRoute);
    });

    it('should only update specified fields', async () => {
        await repo.addRoute(sampleRoute);
        const updatedRoute = { route_id: '1', route_long_name: 'Updated Long Name' };
        await repo.updateRoute(updatedRoute);
        const route = await repo.getRoute('1');
        expect(route?.route_long_name).toBe('Updated Long Name');
        expect(route?.route_short_name).toBe(sampleRoute.route_short_name);
    });

    it('should throw EntryNotFoundError if no route with the same ID exists for update', async () => {
        await expect(repo.updateRoute(sampleRoute)).rejects.toThrow(EntryNotFoundError);
    });

    it('should delete the route with the given ID', async () => {
        await repo.addRoute(sampleRoute);
        await repo.deleteRoute('1');
        const routes = await repo.getAllRoutes();
        expect(routes).toEqual([]);
    });

    it('should throw EntryNotFoundError if no route with the given ID exists for deletion', async () => {
        await expect(repo.deleteRoute('999')).rejects.toThrow(EntryNotFoundError);
    });

    it('should not affect other routes when deleting a route', async () => {
        await repo.addRoute(sampleRoute);
        await repo.addRoute(anotherRoute);
        await repo.deleteRoute('1');
        const routes = await repo.getAllRoutes();
        expect(routes).toEqual([anotherRoute]);
    });

})