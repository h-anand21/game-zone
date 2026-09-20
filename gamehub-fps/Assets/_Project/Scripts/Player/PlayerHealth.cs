// ============================================================
// GameHub FPS — Player Health & Damage System
// ============================================================

using UnityEngine;
using System;

namespace GameHub.FPS.Player
{
    public class PlayerHealth : MonoBehaviour
    {
        public float maxHealth = 100f;
        public float currentHealth = 100f;
        public float maxArmor = 50f;
        public float currentArmor = 50f;

        public bool isDead = false;

        public event Action<float, float> OnHealthChanged;
        public event Action<float, float> OnArmorChanged;
        public event Action OnDeath;

        private void Start()
        {
            ResetHealth();
        }

        public void TakeDamage(float damage, string attackerId = null)
        {
            if (isDead) return;

            if (currentArmor > 0)
            {
                float armorAbsorb = Mathf.Min(currentArmor, damage * 0.5f);
                currentArmor -= armorAbsorb;
                damage -= armorAbsorb;
                OnArmorChanged?.Invoke(currentArmor, maxArmor);
            }

            currentHealth -= damage;
            OnHealthChanged?.Invoke(currentHealth, maxHealth);

            if (currentHealth <= 0)
            {
                currentHealth = 0;
                isDead = true;
                OnDeath?.Invoke();
            }
        }

        public void ResetHealth()
        {
            currentHealth = maxHealth;
            currentArmor = maxArmor;
            isDead = false;
            OnHealthChanged?.Invoke(currentHealth, maxHealth);
            OnArmorChanged?.Invoke(currentArmor, maxArmor);
        }
    }
}
