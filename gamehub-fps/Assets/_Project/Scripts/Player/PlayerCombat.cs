// ============================================================
// GameHub FPS — Player Combat & Shooting System
// ============================================================

using UnityEngine;
using GameHub.FPS.Weapons;

namespace GameHub.FPS.Player
{
    public class PlayerCombat : MonoBehaviour
    {
        public Camera fpsCamera;
        public WeaponData currentWeapon;
        public LayerMask hitLayers;

        public int currentAmmo = 30;
        public bool isReloading = false;

        private float nextTimeToFire = 0f;

        private void Start()
        {
            if (currentWeapon != null)
            {
                currentAmmo = currentWeapon.magazineSize;
            }
        }

        private void Update()
        {
            if (isReloading || currentWeapon == null) return;

            if (Input.GetButton("Fire1") && Time.time >= nextTimeToFire)
            {
                nextTimeToFire = Time.time + 1f / currentWeapon.fireRate;
                Shoot();
            }

            if (Input.GetKeyDown(KeyCode.R) && currentAmmo < currentWeapon.magazineSize)
            {
                StartCoroutine(ReloadCoroutine());
            }
        }

        public void Shoot()
        {
            if (currentAmmo <= 0) return;

            currentAmmo--;

            RaycastHit hit;
            if (Physics.Raycast(fpsCamera.transform.position, fpsCamera.transform.forward, out hit, currentWeapon.range, hitLayers))
            {
                bool isHeadshot = hit.collider.CompareTag("Head");
                PlayerHealth targetHealth = hit.collider.GetComponentInParent<PlayerHealth>();

                if (targetHealth != null)
                {
                    float finalDamage = currentWeapon.damage * (isHeadshot ? currentWeapon.headshotMultiplier : 1.0f);
                    targetHealth.TakeDamage(finalDamage);
                }
            }
        }

        private System.Collections.IEnumerator ReloadCoroutine()
        {
            isReloading = true;
            yield return new WaitForSeconds(currentWeapon.reloadTime);
            currentAmmo = currentWeapon.magazineSize;
            isReloading = false;
        }
    }
}
