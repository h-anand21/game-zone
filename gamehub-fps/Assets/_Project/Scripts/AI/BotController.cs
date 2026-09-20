// ============================================================
// GameHub FPS — Practice Mode AI Bot Controller
// ============================================================

using UnityEngine;
using GameHub.FPS.Player;

namespace GameHub.FPS.AI
{
    [RequireComponent(typeof(PlayerHealth))]
    public class BotController : MonoBehaviour
    {
        public Transform targetPlayer;
        public float attackRange = 25f;
        public float moveSpeed = 3.5f;
        public float fireInterval = 0.5f;

        private PlayerHealth health;
        private float nextFireTime = 0f;

        private void Awake()
        {
            health = GetComponent<PlayerHealth>();
        }

        private void Update()
        {
            if (health.isDead || targetPlayer == null) return;

            float distance = Vector3.Distance(transform.position, targetPlayer.position);

            if (distance <= attackRange)
            {
                // Look at target
                Vector3 lookPos = targetPlayer.position - transform.position;
                lookPos.y = 0;
                transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(lookPos), Time.deltaTime * 5f);

                // Move closer if further than 5m
                if (distance > 5f)
                {
                    transform.position = Vector3.MoveTowards(transform.position, targetPlayer.position, moveSpeed * Time.deltaTime);
                }

                // Shoot at player
                if (Time.time >= nextFireTime)
                {
                    nextFireTime = Time.time + fireInterval;
                    PlayerHealth playerHealth = targetPlayer.GetComponent<PlayerHealth>();
                    if (playerHealth != null)
                    {
                        playerHealth.TakeDamage(15f, "bot_ai");
                    }
                }
            }
        }
    }
}
