// ============================================================
// GameHub FPS — Weapon Data ScriptableObject
// ============================================================

using UnityEngine;

namespace GameHub.FPS.Weapons
{
    [CreateAssetMenu(fileName = "NewWeaponData", menuName = "GameHub/Weapon Data")]
    public class WeaponData : ScriptableObject
    {
        public string weaponId = "rifle";
        public string weaponName = "Assault Rifle";
        public float damage = 34f;
        public float fireRate = 10f; // rounds per second
        public float range = 100f;
        public int magazineSize = 30;
        public float reloadTime = 2.2f;
        public float headshotMultiplier = 2.0f;
        public bool isAutomatic = true;

        public GameObject weaponPrefab;
        public AudioClip fireSound;
        public AudioClip reloadSound;
    }
}
