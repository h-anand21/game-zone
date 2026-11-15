// ============================================================
// Block Blast — Musical Combo Audio Module
// ============================================================

export const BlockSound = {
  /**
   * Musical scale frequencies for consecutive combo ascensions
   * C4 (261.63), D4 (293.66), E4 (329.63), F4 (349.23),
   * G4 (392.00), A4 (440.00), B4 (493.88), C5 (523.25)
   */
  comboNotes: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25],

  playComboChime: (streak: number) => {
    // Pitch rises with each combo streak level
    const noteIdx = Math.min(streak - 1, BlockSound.comboNotes.length - 1);
    // Safe sound invocation placeholder (can be linked to Audio.Sound or WebAudio synth)
  },

  playSnapSound: () => {},
  playBlastSound: () => {},
  playGameOverSound: () => {},
};
