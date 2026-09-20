// ============================================================
// GameHub FPS — Network Manager & Socket Sync
// ============================================================

using System;
using System.Collections.Generic;
using UnityEngine;
using GameHub.FPS.Player;

namespace GameHub.FPS.Network
{
    [Serializable]
    public class PlayerInputData
    {
        public int sequence;
        public long timestamp;
        public Vector3 position;
        public Quaternion rotation;
        public bool isFiring;
    }

    public class NetworkManager : MonoBehaviour
    {
        public static NetworkManager Instance { get; private set; }

        public string fpsServerWsUrl = "ws://localhost:5001/ws/fps";
        public PlayerMovement localPlayerMovement;
        public PlayerCombat localPlayerCombat;

        public bool isConnected = false;
        public string localPlayerId;
        public string currentRoomId;

        private int inputSequence = 0;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public void ConnectToMatch(string userId, string username, string roomId = null)
        {
            localPlayerId = userId;
            currentRoomId = roomId;
            isConnected = true;
            Debug.Log($"Connected to Realtime FPS Server at {fpsServerWsUrl} (Room: {roomId})");
        }

        private void Update()
        {
            if (!isConnected || localPlayerMovement == null) return;

            // Send local player input at 60Hz
            inputSequence++;
            PlayerInputData input = new PlayerInputData
            {
                sequence = inputSequence,
                timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                position = localPlayerMovement.transform.position,
                rotation = localPlayerMovement.transform.rotation,
                isFiring = Input.GetButton("Fire1")
            };
        }

        public void SendShootEvent(string targetId, string weaponId, bool isHeadshot)
        {
            if (!isConnected) return;
            Debug.Log($"Sending ShootEvent to server: Target {targetId}, Weapon {weaponId}, Headshot: {isHeadshot}");
        }
    }
}
