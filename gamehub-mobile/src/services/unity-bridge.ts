// ============================================================
// GameHub Mobile — Unity FPS Launcher & Bridge Service
// ============================================================

export interface UnityLaunchParams {
  userId: string;
  username: string;
  authToken?: string;
  roomId?: string;
  map?: string;
  mode?: string;
  fpsServerUrl?: string;
}

export class UnityBridgeService {
  /**
   * Launch Unity FPS binary with session parameters.
   */
  static launchFpsMatch(params: UnityLaunchParams): Promise<{ success: boolean; message: string }> {
    const defaultServer = process.env.EXPO_PUBLIC_FPS_SERVER_URL || 'ws://localhost:5001/ws/fps';
    
    console.log('[UnityBridge] Launching Unity FPS Arena:', {
      ...params,
      fpsServerUrl: params.fpsServerUrl || defaultServer,
    });

    // Simulated native bridge handover (In production uses expo-unity / native intent)
    return Promise.resolve({
      success: true,
      message: `Launching FPS Match on ${params.map || 'FPS_Factory'} (${params.mode || 'Free For All'})`,
    });
  }
}
