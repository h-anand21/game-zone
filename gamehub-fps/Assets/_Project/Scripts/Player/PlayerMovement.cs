// ============================================================
// GameHub FPS — Player Movement Controller
// ============================================================

using UnityEngine;

namespace GameHub.FPS.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerMovement : MonoBehaviour
    {
        [Header("Movement Settings")]
        public float walkSpeed = 5.0f;
        public float sprintSpeed = 8.0f;
        public float jumpHeight = 1.5f;
        public float gravity = -9.81f;

        [Header("Mobile Joystick Reference")]
        public Vector2 mobileInput;

        private CharacterController characterController;
        private Vector3 velocity;
        private bool isGrounded;

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
        }

        private void Update()
        {
            isGrounded = characterController.isGrounded;
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -2f;
            }

            // Combine Keyboard WASD with Mobile Joystick input
            float inputX = Input.GetAxis("Horizontal") + mobileInput.x;
            float inputZ = Input.GetAxis("Vertical") + mobileInput.y;

            Vector3 move = transform.right * Mathf.Clamp(inputX, -1f, 1f) + transform.forward * Mathf.Clamp(inputZ, -1f, 1f);
            float currentSpeed = Input.GetKey(KeyCode.LeftShift) ? sprintSpeed : walkSpeed;

            characterController.Move(move * currentSpeed * Time.deltaTime);

            if ((Input.GetButtonDown("Jump") || Input.GetKeyDown(KeyCode.Space)) && isGrounded)
            {
                velocity.y = Mathf.Sqrt(jumpHeight * -2f * gravity);
            }

            velocity.y += gravity * Time.deltaTime;
            characterController.Move(velocity * Time.deltaTime);
        }
    }
}
