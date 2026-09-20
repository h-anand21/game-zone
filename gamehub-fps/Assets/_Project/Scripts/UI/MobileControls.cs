// ============================================================
// GameHub FPS — Touch Screen Mobile Controls Overlay
// ============================================================

using UnityEngine;
using GameHub.FPS.Player;

namespace GameHub.FPS.UI
{
    public class MobileControls : MonoBehaviour
    {
        public PlayerMovement playerMovement;
        public PlayerCamera playerCamera;
        public PlayerCombat playerCombat;

        [Header("Touch Settings")]
        public float dragSensitivity = 0.5f;

        private Vector2 touchStartPos;
        private int lookTouchId = -1;

        private void Update()
        {
            HandleTouchLook();
        }

        private void HandleTouchLook()
        {
            if (playerCamera == null) return;

            foreach (Touch touch in Input.touches)
            {
                // Right half of screen for looking around
                if (touch.position.x > Screen.width * 0.4f)
                {
                    if (touch.phase == TouchPhase.Began)
                    {
                        lookTouchId = touch.fingerId;
                        touchStartPos = touch.position;
                    }
                    else if (touch.phase == TouchPhase.Moved && touch.fingerId == lookTouchId)
                    {
                        Vector2 delta = touch.deltaPosition * dragSensitivity;
                        playerCamera.touchLookInput = delta;
                    }
                    else if (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
                    {
                        if (touch.fingerId == lookTouchId)
                        {
                            lookTouchId = -1;
                            playerCamera.touchLookInput = Vector2.zero;
                        }
                    }
                }
            }
        }

        public void OnFireButtonPressed()
        {
            if (playerCombat != null)
            {
                playerCombat.Shoot();
            }
        }

        public void OnReloadButtonPressed()
        {
            if (playerCombat != null && !playerCombat.isReloading)
            {
                playerCombat.StartCoroutine("ReloadCoroutine");
            }
        }
    }
}
