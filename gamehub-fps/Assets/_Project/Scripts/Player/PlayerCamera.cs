// ============================================================
// GameHub FPS — First Person Camera Controller
// ============================================================

using UnityEngine;

namespace GameHub.FPS.Player
{
    public class PlayerCamera : MonoBehaviour
    {
        public Transform playerBody;
        public float mouseSensitivity = 100.0f;
        public float touchSensitivity = 0.2f;

        [HideInInspector]
        public Vector2 touchLookInput;

        private float xRotation = 0.0f;

        private void Start()
        {
            if (Application.platform != RuntimePlatform.Android && Application.platform != RuntimePlatform.IPhonePlayer)
            {
                Cursor.lockState = CursorLockMode.Locked;
            }
        }

        private void Update()
        {
            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity * Time.deltaTime + touchLookInput.x * touchSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity * Time.deltaTime + touchLookInput.y * touchSensitivity;

            xRotation -= mouseY;
            xRotation = Mathf.Clamp(xRotation, -85.0f, 85.0f);

            transform.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
            if (playerBody != null)
            {
                playerBody.Rotate(Vector3.up * mouseX);
            }
        }
    }
}
