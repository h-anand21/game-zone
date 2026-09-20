// ============================================================
// GameHub FPS — Unity Backend HTTP API Client
// ============================================================

using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace GameHub.FPS.Network
{
    public class GameHubApiClient : MonoBehaviour
    {
        public static GameHubApiClient Instance { get; private set; }

        public string backendUrl = "http://localhost:5000";
        public string accessToken;

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

        public IEnumerator RegisterGuestSession(string guestId, Action<bool, string> callback)
        {
            string url = $"{backendUrl}/api/v1/auth/guest";
            string jsonBody = $"{{\"guestId\":\"{guestId}\"}}";

            using (UnityWebRequest request = new UnityWebRequest(url, "POST"))
            {
                byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonBody);
                request.uploadHandler = new UploadHandlerRaw(bodyRaw);
                request.downloadHandler = new DownloadHandlerBuffer();
                request.SetRequestHeader("Content-Type", "application/json");

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    Debug.Log($"GameHub API Guest Login Success: {request.downloadHandler.text}");
                    callback?.Invoke(true, request.downloadHandler.text);
                }
                else
                {
                    Debug.LogError($"GameHub API Guest Login Error: {request.error}");
                    callback?.Invoke(false, request.error);
                }
            }
        }
    }
}
