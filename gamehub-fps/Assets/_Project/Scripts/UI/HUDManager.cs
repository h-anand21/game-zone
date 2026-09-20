// ============================================================
// GameHub FPS — HUD & UI Overlay Manager
// ============================================================

using UnityEngine;
using UnityEngine.UI;
using GameHub.FPS.Player;

namespace GameHub.FPS.UI
{
    public class HUDManager : MonoBehaviour
    {
        [Header("Player References")]
        public PlayerHealth playerHealth;
        public PlayerCombat playerCombat;

        [Header("UI Elements")]
        public Text healthText;
        public Text armorText;
        public Text ammoText;
        public Text killFeedText;
        public GameObject gameOverPanel;

        private void OnEnable()
        {
            if (playerHealth != null)
            {
                playerHealth.OnHealthChanged += UpdateHealthUI;
                playerHealth.OnArmorChanged += UpdateArmorUI;
                playerHealth.OnDeath += HandlePlayerDeath;
            }
        }

        private void OnDisable()
        {
            if (playerHealth != null)
            {
                playerHealth.OnHealthChanged -= UpdateHealthUI;
                playerHealth.OnArmorChanged -= UpdateArmorUI;
                playerHealth.OnDeath -= HandlePlayerDeath;
            }
        }

        private void Update()
        {
            if (playerCombat != null && ammoText != null)
            {
                ammoText.text = playerCombat.isReloading
                    ? "RELOADING..."
                    : $"{playerCombat.currentAmmo} / {playerCombat.currentWeapon.magazineSize}";
            }
        }

        private void UpdateHealthUI(float current, float max)
        {
            if (healthText != null) healthText.text = $"HP: {Mathf.CeilToInt(current)}";
        }

        private void UpdateArmorUI(float current, float max)
        {
            if (armorText != null) armorText.text = $"ARMOR: {Mathf.CeilToInt(current)}";
        }

        private void HandlePlayerDeath()
        {
            if (gameOverPanel != null) gameOverPanel.SetActive(true);
        }
    }
}
