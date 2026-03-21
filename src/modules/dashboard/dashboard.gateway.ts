import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: 'dashboard',
})
export class DashboardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth.token as string;
      const payload = this.jwtService.verify(token);

      if (!['ADMIN', 'MANAGER'].includes(payload.role)) {
        client.disconnect();
        return;
      }

      await client.join('dashboard-room');
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    client.leave('dashboard-room');
  }

  emitAttendanceUpdate(attendance: unknown): void {
    this.server.to('dashboard-room').emit('attendance:update', attendance);
  }

  emitDailyStats(stats: unknown): void {
    this.server.to('dashboard-room').emit('stats:update', stats);
  }
}
