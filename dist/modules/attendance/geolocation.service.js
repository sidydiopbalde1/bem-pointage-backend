"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GeolocationService = class GeolocationService {
    config;
    officeLat;
    officeLng;
    radiusMeters;
    constructor(config) {
        this.config = config;
        this.officeLat = parseFloat(this.config.get('OFFICE_LATITUDE') ?? '0');
        this.officeLng = parseFloat(this.config.get('OFFICE_LONGITUDE') ?? '0');
        this.radiusMeters = parseInt(this.config.get('OFFICE_RADIUS_METERS') ?? '100', 10);
    }
    assertWithinOffice(latitude, longitude) {
        const distance = this.haversineDistance(this.officeLat, this.officeLng, latitude, longitude);
        if (distance > this.radiusMeters) {
            throw new common_1.ForbiddenException(`Pointage refusé : vous êtes à ${Math.round(distance)}m du bureau (rayon autorisé : ${this.radiusMeters}m).`);
        }
    }
    haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map