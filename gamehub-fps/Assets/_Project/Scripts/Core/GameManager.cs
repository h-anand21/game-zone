// ============================================================
// GameHub FPS — Singleton Game Manager
// ============================================================

using UnityEngine;

namespace GameHub.FPS.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public enum GameState { LOBBY, MATCH_STARTING, IN_MATCH, MATCH_ENDED }
        public GameState currentState = GameState.LOBBY;

        public string currentMap = "FPS_Factory";
        public string currentMode = "free-for-all";
        public int currentKills = 0;
        public int currentDeaths = 0;
        public int currentScore = 0;

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

        public void StartMatch(string mapName, string modeName)
        {
            currentMap = mapName;
            currentMode = modeName;
            currentKills = 0;
            currentDeaths = 0;
            currentScore = 0;
            currentState = GameState.IN_MATCH;
        }

        public void AddKill(bool isHeadshot)
        {
            currentKills++;
            currentScore += isHeadshot ? 150 : 100;
        }

        public void AddDeath()
        {
            currentDeaths++;
        }

        public void EndMatch()
        {
            currentState = GameState.MATCH_ENDED;
        }
    }
}
