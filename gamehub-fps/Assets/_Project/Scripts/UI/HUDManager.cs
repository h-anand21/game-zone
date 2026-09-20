// ============================================================
// GameHub FPS — HUD & UI Overlay Manager
// ============================================================

using UnityEngine;
using GameHub.FPS.Player;

namespace GameHub.FPS.UI
{
    public class HUDManager : MonoBehaviour
    {
        [Header("Player References")]
        public PlayerHealth playerHealth;
        public PlayerCombat playerCombat;

        public GameObject gameOverPanel;

        private void OnEnable()
        {
            if (playerHealth != null)
            {
                playerHealth.OnDeath += HandlePlayerDeath;
            }
        }

        private void OnDisable()
        {
            if (playerHealth != null)
            {
                playerHealth.OnDeath -= HandlePlayerDeath;
            }
        }

        private void HandlePlayerDeath()
        {
            if (gameOverPanel != null) gameOverPanel.SetActive(true);
        }

        private void OnGUI()
        {
            if (playerHealth == null) return;

            // Health & Armor HUD
            GUI.Box(new Rect(20, Screen.height - 100, 220, 75), "PLAYER STATUS");
            GUI.Label(new Rect(30, Screen.height - 75, 200, 25), $"HP: {Mathf.CeilToInt(playerHealth.currentHealth)} / {playerHealth.maxHealth}");
            GUI.Label(new Rect(30, Screen.height - 50, 200, 25), $"ARMOR: {Mathf.CeilToInt(playerHealth.currentArmor)}");

            // Ammo HUD
            if (playerCombat != null && playerCombat.currentWeapon != null)
            {
                GUI.Box(new Rect(Screen.width - 220, Screen.height - 80, 200, 60), "WEAPON");
                string ammoText = playerCombat.isReloading ? "RELOADING..." : $"{playerCombat.currentAmmo} / {playerCombat.currentWeapon.magazineSize}";
                GUI.Label(new Rect(Screen.width - 210, Screen.height - 55, 180, 30), $"AMMO: {ammoText}");
            }

            // Crosshair
            GUI.Box(new Rect(Screen.width / 2 - 5, Screen.height / 2 - 5, 10, 10), "+");
        }
    }
}
