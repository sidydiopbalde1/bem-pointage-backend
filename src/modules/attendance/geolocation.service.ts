import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeolocationService {
  private readonly officeLat: number;
  private readonly officeLng: number;
  private readonly radiusMeters: number;

  constructor(private readonly config: ConfigService) {
    this.officeLat = parseFloat(this.config.get('OFFICE_LATITUDE') ?? '0');
    this.officeLng = parseFloat(this.config.get('OFFICE_LONGITUDE') ?? '0');
    this.radiusMeters = parseInt(this.config.get('OFFICE_RADIUS_METERS') ?? '100', 10);
  }

  /**
   * Vérifie que les coordonnées sont dans le rayon autorisé.
   * Lève une ForbiddenException si l'employé est trop loin.
   */
  assertWithinOffice(latitude: number, longitude: number): void {
    const distance = this.haversineDistance(
      this.officeLat,
      this.officeLng,
      latitude,
      longitude,
    );

    if (distance > this.radiusMeters) {
      throw new ForbiddenException(
        `Pointage refusé : vous êtes à ${Math.round(distance)}m du bureau (rayon autorisé : ${this.radiusMeters}m).`,
      );
    }
  }

  /**
   * Formule de Haversine — distance en mètres entre deux coordonnées GPS.
   */
  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Rayon de la Terre en mètres
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}
