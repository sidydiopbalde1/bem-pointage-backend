import { ConfigService } from '@nestjs/config';
export declare class GeolocationService {
    private readonly config;
    private readonly officeLat;
    private readonly officeLng;
    private readonly radiusMeters;
    constructor(config: ConfigService);
    assertWithinOffice(latitude: number, longitude: number): void;
    private haversineDistance;
}
