// ============================================================
// ARROW KINGDOM: SLIDE ESCAPE — Handcrafted Levels from Starter
// 10 Progressive Solvable Levels with Exact Solution Sequences
// ============================================================

import type { GameLevel } from '../game/types';

export const LEVELS: GameLevel[] = [
  {
    "id": 1,
    "worldId": 1,
    "worldName": "Whispering Forest",
    "name": "Kingdom 1",
    "rows": 6,
    "cols": 6,
    "threeStarMoves": 6,
    "twoStarMoves": 9,
    "reward": {
      "coins": 50,
      "gems": 0
    },
    "hiddenSymbol": "🏰",
    "tutorialText": "Tap each arrow to slide it off the board! ➜",
    "pieces": [
      {
        "id": "a1",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 3,
            "col": 0
          },
          {
            "row": 3,
            "col": 1
          },
          {
            "row": 3,
            "col": 2
          },
          {
            "row": 3,
            "col": 3
          }
        ]
      },
      {
        "id": "a2",
        "direction": "up",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 1,
            "col": 5
          },
          {
            "row": 0,
            "col": 5
          }
        ]
      },
      {
        "id": "a3",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 5,
            "col": 1
          },
          {
            "row": 5,
            "col": 2
          }
        ]
      },
      {
        "id": "a4",
        "direction": "left",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 4,
            "col": 4
          },
          {
            "row": 4,
            "col": 3
          }
        ]
      },
      {
        "id": "a5",
        "direction": "down",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 2,
            "col": 4
          },
          {
            "row": 3,
            "col": 4
          }
        ]
      },
      {
        "id": "a6",
        "direction": "right",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 2,
            "col": 1
          },
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 1,
            "col": 2
          },
          {
            "row": 1,
            "col": 3
          }
        ]
      }
    ],
    "solution": [
      "a2",
      "a3",
      "a4",
      "a5",
      "a1",
      "a6"
    ]
  },
  {
    "id": 2,
    "worldId": 1,
    "worldName": "Whispering Forest",
    "name": "Kingdom 2",
    "rows": 7,
    "cols": 7,
    "threeStarMoves": 7,
    "twoStarMoves": 10,
    "reward": {
      "coins": 60,
      "gems": 0
    },
    "hiddenSymbol": "🐉",
    "pieces": [
      {
        "id": "a1",
        "direction": "up",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 5,
            "col": 1
          },
          {
            "row": 4,
            "col": 1
          },
          {
            "row": 3,
            "col": 1
          },
          {
            "row": 2,
            "col": 1
          }
        ]
      },
      {
        "id": "a2",
        "direction": "right",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 0,
            "col": 5
          },
          {
            "row": 1,
            "col": 5
          },
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 3,
            "col": 5
          },
          {
            "row": 3,
            "col": 6
          }
        ]
      },
      {
        "id": "a3",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 5,
            "col": 4
          },
          {
            "row": 5,
            "col": 5
          },
          {
            "row": 5,
            "col": 6
          },
          {
            "row": 6,
            "col": 6
          }
        ]
      },
      {
        "id": "a4",
        "direction": "up",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 4,
            "col": 3
          },
          {
            "row": 3,
            "col": 3
          },
          {
            "row": 2,
            "col": 3
          }
        ]
      },
      {
        "id": "a5",
        "direction": "up",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 6,
            "col": 3
          },
          {
            "row": 6,
            "col": 2
          },
          {
            "row": 5,
            "col": 2
          },
          {
            "row": 4,
            "col": 2
          },
          {
            "row": 3,
            "col": 2
          }
        ]
      },
      {
        "id": "a6",
        "direction": "down",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 3,
            "col": 0
          },
          {
            "row": 4,
            "col": 0
          },
          {
            "row": 5,
            "col": 0
          }
        ]
      },
      {
        "id": "a7",
        "direction": "right",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 1,
            "col": 2
          }
        ]
      }
    ],
    "solution": [
      "a2",
      "a3",
      "a4",
      "a6",
      "a7",
      "a1",
      "a5"
    ]
  },
  {
    "id": 3,
    "worldId": 1,
    "worldName": "Whispering Forest",
    "name": "Kingdom 3",
    "rows": 8,
    "cols": 8,
    "threeStarMoves": 8,
    "twoStarMoves": 11,
    "reward": {
      "coins": 70,
      "gems": 0
    },
    "hiddenSymbol": "💎",
    "pieces": [
      {
        "id": "a1",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 2,
            "col": 0
          },
          {
            "row": 3,
            "col": 0
          },
          {
            "row": 3,
            "col": 1
          }
        ]
      },
      {
        "id": "a2",
        "direction": "up",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 7,
            "col": 4
          },
          {
            "row": 6,
            "col": 4
          },
          {
            "row": 5,
            "col": 4
          }
        ]
      },
      {
        "id": "a3",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 5,
            "col": 5
          },
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 4,
            "col": 6
          }
        ]
      },
      {
        "id": "a4",
        "direction": "right",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 4,
            "col": 4
          },
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 2,
            "col": 4
          },
          {
            "row": 1,
            "col": 4
          },
          {
            "row": 1,
            "col": 5
          },
          {
            "row": 1,
            "col": 6
          },
          {
            "row": 1,
            "col": 7
          }
        ]
      },
      {
        "id": "a5",
        "direction": "left",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 6,
            "col": 2
          },
          {
            "row": 6,
            "col": 1
          },
          {
            "row": 6,
            "col": 0
          }
        ]
      },
      {
        "id": "a6",
        "direction": "up",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 4,
            "col": 3
          },
          {
            "row": 3,
            "col": 3
          },
          {
            "row": 2,
            "col": 3
          },
          {
            "row": 1,
            "col": 3
          }
        ]
      },
      {
        "id": "a7",
        "direction": "up",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 5,
            "col": 1
          },
          {
            "row": 4,
            "col": 1
          }
        ]
      },
      {
        "id": "a8",
        "direction": "right",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 0,
            "col": 3
          },
          {
            "row": 0,
            "col": 4
          },
          {
            "row": 0,
            "col": 5
          },
          {
            "row": 0,
            "col": 6
          }
        ]
      }
    ],
    "solution": [
      "a3",
      "a4",
      "a5",
      "a8",
      "a2",
      "a6",
      "a1",
      "a7"
    ]
  },
  {
    "id": 4,
    "worldId": 1,
    "worldName": "Whispering Forest",
    "name": "Kingdom 4",
    "rows": 9,
    "cols": 9,
    "threeStarMoves": 9,
    "twoStarMoves": 12,
    "reward": {
      "coins": 80,
      "gems": 0
    },
    "hiddenSymbol": "🌲",
    "pieces": [
      {
        "id": "a1",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 4,
            "col": 7
          },
          {
            "row": 5,
            "col": 7
          },
          {
            "row": 6,
            "col": 7
          }
        ]
      },
      {
        "id": "a2",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 3,
            "col": 0
          },
          {
            "row": 4,
            "col": 0
          },
          {
            "row": 5,
            "col": 0
          },
          {
            "row": 6,
            "col": 0
          }
        ]
      },
      {
        "id": "a3",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 2,
            "col": 2
          },
          {
            "row": 2,
            "col": 3
          },
          {
            "row": 2,
            "col": 4
          },
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 3,
            "col": 5
          },
          {
            "row": 4,
            "col": 5
          }
        ]
      },
      {
        "id": "a4",
        "direction": "left",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 5,
            "col": 4
          },
          {
            "row": 5,
            "col": 3
          },
          {
            "row": 5,
            "col": 2
          },
          {
            "row": 5,
            "col": 1
          }
        ]
      },
      {
        "id": "a5",
        "direction": "right",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 7,
            "col": 6
          },
          {
            "row": 7,
            "col": 7
          }
        ]
      },
      {
        "id": "a6",
        "direction": "right",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 0,
            "col": 4
          },
          {
            "row": 0,
            "col": 5
          }
        ]
      },
      {
        "id": "a7",
        "direction": "up",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 7,
            "col": 8
          },
          {
            "row": 6,
            "col": 8
          }
        ]
      },
      {
        "id": "a8",
        "direction": "up",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 2,
            "col": 6
          },
          {
            "row": 2,
            "col": 7
          },
          {
            "row": 2,
            "col": 8
          },
          {
            "row": 1,
            "col": 8
          }
        ]
      },
      {
        "id": "a9",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 6,
            "col": 4
          },
          {
            "row": 6,
            "col": 5
          },
          {
            "row": 6,
            "col": 6
          }
        ]
      }
    ],
    "solution": [
      "a2",
      "a4",
      "a6",
      "a8",
      "a7",
      "a5",
      "a1",
      "a9",
      "a3"
    ]
  },
  {
    "id": 5,
    "worldId": 1,
    "worldName": "Whispering Forest",
    "name": "Kingdom 5",
    "rows": 10,
    "cols": 10,
    "threeStarMoves": 10,
    "twoStarMoves": 13,
    "reward": {
      "coins": 90,
      "gems": 1
    },
    "hiddenSymbol": "👑",
    "pieces": [
      {
        "id": "a1",
        "direction": "up",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 5,
            "col": 0
          },
          {
            "row": 4,
            "col": 0
          },
          {
            "row": 3,
            "col": 0
          },
          {
            "row": 2,
            "col": 0
          }
        ]
      },
      {
        "id": "a2",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 1,
            "col": 7
          },
          {
            "row": 2,
            "col": 7
          },
          {
            "row": 3,
            "col": 7
          }
        ]
      },
      {
        "id": "a3",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 4,
            "col": 7
          },
          {
            "row": 5,
            "col": 7
          },
          {
            "row": 6,
            "col": 7
          },
          {
            "row": 7,
            "col": 7
          }
        ]
      },
      {
        "id": "a4",
        "direction": "up",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 9,
            "col": 1
          },
          {
            "row": 8,
            "col": 1
          },
          {
            "row": 7,
            "col": 1
          },
          {
            "row": 6,
            "col": 1
          }
        ]
      },
      {
        "id": "a5",
        "direction": "right",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 2,
            "col": 4
          },
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 2,
            "col": 6
          }
        ]
      },
      {
        "id": "a6",
        "direction": "right",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 8,
            "col": 3
          },
          {
            "row": 9,
            "col": 3
          },
          {
            "row": 9,
            "col": 4
          },
          {
            "row": 9,
            "col": 5
          }
        ]
      },
      {
        "id": "a7",
        "direction": "left",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 6,
            "col": 4
          },
          {
            "row": 6,
            "col": 3
          }
        ]
      },
      {
        "id": "a8",
        "direction": "up",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 3,
            "col": 2
          },
          {
            "row": 3,
            "col": 3
          },
          {
            "row": 2,
            "col": 3
          },
          {
            "row": 1,
            "col": 3
          }
        ]
      },
      {
        "id": "a9",
        "direction": "up",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 7,
            "col": 5
          },
          {
            "row": 6,
            "col": 5
          }
        ]
      },
      {
        "id": "a10",
        "direction": "right",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 4,
            "col": 1
          },
          {
            "row": 4,
            "col": 2
          },
          {
            "row": 4,
            "col": 3
          }
        ]
      }
    ],
    "solution": [
      "a1",
      "a3",
      "a2",
      "a5",
      "a6",
      "a8",
      "a9",
      "a10",
      "a4",
      "a7"
    ]
  },
  {
    "id": 6,
    "worldId": 2,
    "worldName": "Crystal Coast",
    "name": "Kingdom 6",
    "rows": 10,
    "cols": 10,
    "threeStarMoves": 12,
    "twoStarMoves": 15,
    "reward": {
      "coins": 100,
      "gems": 0
    },
    "hiddenSymbol": "🗺️",
    "pieces": [
      {
        "id": "a1",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 3,
            "col": 5
          },
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 5,
            "col": 5
          }
        ]
      },
      {
        "id": "a2",
        "direction": "left",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 3,
            "col": 8
          },
          {
            "row": 3,
            "col": 7
          },
          {
            "row": 3,
            "col": 6
          }
        ]
      },
      {
        "id": "a3",
        "direction": "up",
        "color": "#49E67A",
        "cells": [
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 0,
            "col": 1
          }
        ]
      },
      {
        "id": "a4",
        "direction": "left",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 9,
            "col": 7
          },
          {
            "row": 8,
            "col": 7
          },
          {
            "row": 8,
            "col": 6
          },
          {
            "row": 8,
            "col": 5
          },
          {
            "row": 8,
            "col": 4
          }
        ]
      },
      {
        "id": "a5",
        "direction": "left",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 4,
            "col": 1
          },
          {
            "row": 3,
            "col": 1
          },
          {
            "row": 3,
            "col": 0
          }
        ]
      },
      {
        "id": "a6",
        "direction": "down",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 4,
            "col": 2
          },
          {
            "row": 4,
            "col": 3
          },
          {
            "row": 5,
            "col": 3
          },
          {
            "row": 6,
            "col": 3
          },
          {
            "row": 7,
            "col": 3
          }
        ]
      },
      {
        "id": "a7",
        "direction": "down",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 1,
            "col": 8
          },
          {
            "row": 2,
            "col": 8
          }
        ]
      },
      {
        "id": "a8",
        "direction": "down",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 0,
            "col": 8
          },
          {
            "row": 0,
            "col": 7
          },
          {
            "row": 1,
            "col": 7
          }
        ]
      },
      {
        "id": "a9",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 4,
            "col": 6
          },
          {
            "row": 5,
            "col": 6
          },
          {
            "row": 6,
            "col": 6
          },
          {
            "row": 7,
            "col": 6
          }
        ]
      },
      {
        "id": "a10",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 1,
            "col": 3
          },
          {
            "row": 2,
            "col": 3
          },
          {
            "row": 3,
            "col": 3
          }
        ]
      },
      {
        "id": "a11",
        "direction": "left",
        "color": "#49E67A",
        "cells": [
          {
            "row": 7,
            "col": 2
          },
          {
            "row": 7,
            "col": 1
          },
          {
            "row": 7,
            "col": 0
          }
        ]
      },
      {
        "id": "a12",
        "direction": "down",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 5,
            "col": 2
          },
          {
            "row": 6,
            "col": 2
          }
        ]
      }
    ],
    "solution": [
      "a3",
      "a4",
      "a1",
      "a5",
      "a9",
      "a11",
      "a12",
      "a6",
      "a10",
      "a2",
      "a7",
      "a8"
    ]
  },
  {
    "id": 7,
    "worldId": 2,
    "worldName": "Crystal Coast",
    "name": "Kingdom 7",
    "rows": 11,
    "cols": 11,
    "threeStarMoves": 14,
    "twoStarMoves": 17,
    "reward": {
      "coins": 110,
      "gems": 0
    },
    "hiddenSymbol": "🛡️",
    "pieces": [
      {
        "id": "a1",
        "direction": "up",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 4,
            "col": 6
          },
          {
            "row": 4,
            "col": 7
          },
          {
            "row": 3,
            "col": 7
          },
          {
            "row": 2,
            "col": 7
          }
        ]
      },
      {
        "id": "a2",
        "direction": "up",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 6,
            "col": 9
          },
          {
            "row": 5,
            "col": 9
          },
          {
            "row": 4,
            "col": 9
          }
        ]
      },
      {
        "id": "a3",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 7,
            "col": 3
          },
          {
            "row": 6,
            "col": 3
          },
          {
            "row": 5,
            "col": 3
          },
          {
            "row": 5,
            "col": 4
          },
          {
            "row": 5,
            "col": 5
          },
          {
            "row": 5,
            "col": 6
          }
        ]
      },
      {
        "id": "a4",
        "direction": "down",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 7,
            "col": 6
          },
          {
            "row": 8,
            "col": 6
          },
          {
            "row": 9,
            "col": 6
          },
          {
            "row": 10,
            "col": 6
          }
        ]
      },
      {
        "id": "a5",
        "direction": "up",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 4,
            "col": 4
          },
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 2,
            "col": 4
          }
        ]
      },
      {
        "id": "a6",
        "direction": "up",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 1,
            "col": 2
          },
          {
            "row": 1,
            "col": 3
          },
          {
            "row": 1,
            "col": 4
          },
          {
            "row": 1,
            "col": 5
          },
          {
            "row": 0,
            "col": 5
          }
        ]
      },
      {
        "id": "a7",
        "direction": "up",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 6,
            "col": 8
          },
          {
            "row": 5,
            "col": 8
          },
          {
            "row": 4,
            "col": 8
          }
        ]
      },
      {
        "id": "a8",
        "direction": "right",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 9,
            "col": 1
          },
          {
            "row": 9,
            "col": 2
          }
        ]
      },
      {
        "id": "a9",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 2,
            "col": 9
          },
          {
            "row": 1,
            "col": 9
          },
          {
            "row": 1,
            "col": 10
          }
        ]
      },
      {
        "id": "a10",
        "direction": "right",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 7,
            "col": 8
          },
          {
            "row": 8,
            "col": 8
          },
          {
            "row": 9,
            "col": 8
          },
          {
            "row": 10,
            "col": 8
          },
          {
            "row": 10,
            "col": 9
          },
          {
            "row": 10,
            "col": 10
          }
        ]
      },
      {
        "id": "a11",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 7,
            "col": 5
          },
          {
            "row": 6,
            "col": 5
          },
          {
            "row": 6,
            "col": 6
          },
          {
            "row": 6,
            "col": 7
          }
        ]
      },
      {
        "id": "a12",
        "direction": "left",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 8,
            "col": 5
          },
          {
            "row": 8,
            "col": 4
          },
          {
            "row": 8,
            "col": 3
          },
          {
            "row": 8,
            "col": 2
          }
        ]
      },
      {
        "id": "a13",
        "direction": "down",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 0,
            "col": 1
          },
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 2,
            "col": 1
          }
        ]
      },
      {
        "id": "a14",
        "direction": "right",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 9,
            "col": 3
          },
          {
            "row": 9,
            "col": 4
          },
          {
            "row": 9,
            "col": 5
          }
        ]
      }
    ],
    "solution": [
      "a4",
      "a6",
      "a1",
      "a5",
      "a7",
      "a9",
      "a2",
      "a10",
      "a11",
      "a3",
      "a12",
      "a14",
      "a8",
      "a13"
    ]
  },
  {
    "id": 8,
    "worldId": 2,
    "worldName": "Crystal Coast",
    "name": "Kingdom 8",
    "rows": 12,
    "cols": 12,
    "threeStarMoves": 16,
    "twoStarMoves": 19,
    "reward": {
      "coins": 120,
      "gems": 0
    },
    "hiddenSymbol": "⚔️",
    "pieces": [
      {
        "id": "a1",
        "direction": "left",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 3,
            "col": 3
          }
        ]
      },
      {
        "id": "a2",
        "direction": "left",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 2,
            "col": 9
          },
          {
            "row": 3,
            "col": 9
          },
          {
            "row": 3,
            "col": 8
          },
          {
            "row": 3,
            "col": 7
          }
        ]
      },
      {
        "id": "a3",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 3,
            "col": 2
          },
          {
            "row": 4,
            "col": 2
          },
          {
            "row": 5,
            "col": 2
          },
          {
            "row": 6,
            "col": 2
          }
        ]
      },
      {
        "id": "a4",
        "direction": "down",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 5,
            "col": 0
          },
          {
            "row": 6,
            "col": 0
          },
          {
            "row": 7,
            "col": 0
          }
        ]
      },
      {
        "id": "a5",
        "direction": "down",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 8,
            "col": 7
          },
          {
            "row": 8,
            "col": 8
          },
          {
            "row": 8,
            "col": 9
          },
          {
            "row": 9,
            "col": 9
          },
          {
            "row": 10,
            "col": 9
          },
          {
            "row": 11,
            "col": 9
          }
        ]
      },
      {
        "id": "a6",
        "direction": "up",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 6,
            "col": 9
          },
          {
            "row": 5,
            "col": 9
          }
        ]
      },
      {
        "id": "a7",
        "direction": "left",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 11,
            "col": 8
          },
          {
            "row": 11,
            "col": 7
          }
        ]
      },
      {
        "id": "a8",
        "direction": "right",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 5,
            "col": 7
          },
          {
            "row": 5,
            "col": 8
          }
        ]
      },
      {
        "id": "a9",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 5,
            "col": 1
          },
          {
            "row": 6,
            "col": 1
          }
        ]
      },
      {
        "id": "a10",
        "direction": "right",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 1,
            "col": 3
          },
          {
            "row": 1,
            "col": 4
          },
          {
            "row": 1,
            "col": 5
          }
        ]
      },
      {
        "id": "a11",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 8,
            "col": 5
          },
          {
            "row": 8,
            "col": 4
          },
          {
            "row": 8,
            "col": 3
          },
          {
            "row": 9,
            "col": 3
          },
          {
            "row": 10,
            "col": 3
          }
        ]
      },
      {
        "id": "a12",
        "direction": "down",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 1,
            "col": 10
          },
          {
            "row": 2,
            "col": 10
          },
          {
            "row": 3,
            "col": 10
          }
        ]
      },
      {
        "id": "a13",
        "direction": "left",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 7,
            "col": 6
          },
          {
            "row": 6,
            "col": 6
          },
          {
            "row": 5,
            "col": 6
          },
          {
            "row": 4,
            "col": 6
          },
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 4,
            "col": 4
          }
        ]
      },
      {
        "id": "a14",
        "direction": "down",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 5,
            "col": 11
          },
          {
            "row": 5,
            "col": 10
          },
          {
            "row": 6,
            "col": 10
          },
          {
            "row": 7,
            "col": 10
          }
        ]
      },
      {
        "id": "a15",
        "direction": "right",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 9,
            "col": 4
          },
          {
            "row": 9,
            "col": 5
          },
          {
            "row": 9,
            "col": 6
          }
        ]
      },
      {
        "id": "a16",
        "direction": "down",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 1,
            "col": 2
          },
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 2,
            "col": 1
          },
          {
            "row": 3,
            "col": 1
          },
          {
            "row": 4,
            "col": 1
          }
        ]
      }
    ],
    "solution": [
      "a3",
      "a4",
      "a7",
      "a5",
      "a9",
      "a14",
      "a12",
      "a10",
      "a15",
      "a11",
      "a16",
      "a1",
      "a2",
      "a6",
      "a8",
      "a13"
    ]
  },
  {
    "id": 9,
    "worldId": 2,
    "worldName": "Crystal Coast",
    "name": "Kingdom 9",
    "rows": 12,
    "cols": 12,
    "threeStarMoves": 18,
    "twoStarMoves": 21,
    "reward": {
      "coins": 130,
      "gems": 0
    },
    "hiddenSymbol": "🌋",
    "pieces": [
      {
        "id": "a1",
        "direction": "left",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 8,
            "col": 6
          },
          {
            "row": 8,
            "col": 5
          },
          {
            "row": 8,
            "col": 4
          },
          {
            "row": 8,
            "col": 3
          }
        ]
      },
      {
        "id": "a2",
        "direction": "up",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 7,
            "col": 5
          },
          {
            "row": 7,
            "col": 6
          },
          {
            "row": 6,
            "col": 6
          }
        ]
      },
      {
        "id": "a3",
        "direction": "left",
        "color": "#49E67A",
        "cells": [
          {
            "row": 11,
            "col": 7
          },
          {
            "row": 11,
            "col": 6
          },
          {
            "row": 11,
            "col": 5
          },
          {
            "row": 11,
            "col": 4
          }
        ]
      },
      {
        "id": "a4",
        "direction": "right",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 9,
            "col": 3
          },
          {
            "row": 9,
            "col": 4
          },
          {
            "row": 9,
            "col": 5
          }
        ]
      },
      {
        "id": "a5",
        "direction": "up",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 2,
            "col": 6
          },
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 1,
            "col": 5
          },
          {
            "row": 0,
            "col": 5
          }
        ]
      },
      {
        "id": "a6",
        "direction": "down",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 9,
            "col": 2
          },
          {
            "row": 10,
            "col": 2
          }
        ]
      },
      {
        "id": "a7",
        "direction": "left",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 3,
            "col": 9
          },
          {
            "row": 4,
            "col": 9
          },
          {
            "row": 4,
            "col": 8
          },
          {
            "row": 4,
            "col": 7
          },
          {
            "row": 4,
            "col": 6
          }
        ]
      },
      {
        "id": "a8",
        "direction": "left",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 6,
            "col": 2
          },
          {
            "row": 6,
            "col": 1
          }
        ]
      },
      {
        "id": "a9",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 7,
            "col": 9
          },
          {
            "row": 7,
            "col": 10
          },
          {
            "row": 7,
            "col": 11
          },
          {
            "row": 8,
            "col": 11
          },
          {
            "row": 9,
            "col": 11
          },
          {
            "row": 10,
            "col": 11
          }
        ]
      },
      {
        "id": "a10",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 9,
            "col": 6
          },
          {
            "row": 9,
            "col": 7
          },
          {
            "row": 9,
            "col": 8
          },
          {
            "row": 10,
            "col": 8
          },
          {
            "row": 11,
            "col": 8
          }
        ]
      },
      {
        "id": "a11",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 1,
            "col": 1
          },
          {
            "row": 2,
            "col": 1
          },
          {
            "row": 3,
            "col": 1
          },
          {
            "row": 4,
            "col": 1
          }
        ]
      },
      {
        "id": "a12",
        "direction": "left",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 2,
            "col": 9
          },
          {
            "row": 2,
            "col": 8
          },
          {
            "row": 2,
            "col": 7
          }
        ]
      },
      {
        "id": "a13",
        "direction": "right",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 5,
            "col": 10
          },
          {
            "row": 4,
            "col": 10
          },
          {
            "row": 3,
            "col": 10
          },
          {
            "row": 2,
            "col": 10
          },
          {
            "row": 2,
            "col": 11
          }
        ]
      },
      {
        "id": "a14",
        "direction": "up",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 6,
            "col": 5
          },
          {
            "row": 6,
            "col": 4
          },
          {
            "row": 5,
            "col": 4
          },
          {
            "row": 4,
            "col": 4
          }
        ]
      },
      {
        "id": "a15",
        "direction": "left",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 6,
            "col": 10
          },
          {
            "row": 6,
            "col": 9
          },
          {
            "row": 6,
            "col": 8
          },
          {
            "row": 6,
            "col": 7
          }
        ]
      },
      {
        "id": "a16",
        "direction": "up",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 3,
            "col": 5
          },
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 3,
            "col": 3
          },
          {
            "row": 3,
            "col": 2
          },
          {
            "row": 2,
            "col": 2
          },
          {
            "row": 1,
            "col": 2
          },
          {
            "row": 0,
            "col": 2
          }
        ]
      },
      {
        "id": "a17",
        "direction": "up",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 1,
            "col": 10
          },
          {
            "row": 0,
            "col": 10
          }
        ]
      },
      {
        "id": "a18",
        "direction": "up",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 11,
            "col": 0
          },
          {
            "row": 10,
            "col": 0
          },
          {
            "row": 9,
            "col": 0
          },
          {
            "row": 8,
            "col": 0
          }
        ]
      }
    ],
    "solution": [
      "a5",
      "a6",
      "a8",
      "a9",
      "a11",
      "a13",
      "a16",
      "a12",
      "a14",
      "a7",
      "a2",
      "a15",
      "a17",
      "a18",
      "a1",
      "a3",
      "a10",
      "a4"
    ]
  },
  {
    "id": 10,
    "worldId": 2,
    "worldName": "Crystal Coast",
    "name": "Kingdom 10",
    "rows": 13,
    "cols": 13,
    "threeStarMoves": 20,
    "twoStarMoves": 23,
    "reward": {
      "coins": 140,
      "gems": 1
    },
    "hiddenSymbol": "✨",
    "pieces": [
      {
        "id": "a1",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 0,
            "col": 4
          },
          {
            "row": 0,
            "col": 5
          },
          {
            "row": 0,
            "col": 6
          },
          {
            "row": 0,
            "col": 7
          }
        ]
      },
      {
        "id": "a2",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 1,
            "col": 11
          },
          {
            "row": 2,
            "col": 11
          },
          {
            "row": 3,
            "col": 11
          }
        ]
      },
      {
        "id": "a3",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 10,
            "col": 0
          },
          {
            "row": 9,
            "col": 0
          },
          {
            "row": 9,
            "col": 1
          }
        ]
      },
      {
        "id": "a4",
        "direction": "up",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 9,
            "col": 5
          },
          {
            "row": 8,
            "col": 5
          }
        ]
      },
      {
        "id": "a5",
        "direction": "up",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 2,
            "col": 6
          },
          {
            "row": 2,
            "col": 5
          },
          {
            "row": 2,
            "col": 4
          },
          {
            "row": 2,
            "col": 3
          },
          {
            "row": 1,
            "col": 3
          }
        ]
      },
      {
        "id": "a6",
        "direction": "right",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 2,
            "col": 0
          },
          {
            "row": 2,
            "col": 1
          },
          {
            "row": 2,
            "col": 2
          }
        ]
      },
      {
        "id": "a7",
        "direction": "up",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 12,
            "col": 12
          },
          {
            "row": 11,
            "col": 12
          },
          {
            "row": 10,
            "col": 12
          }
        ]
      },
      {
        "id": "a8",
        "direction": "right",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 6,
            "col": 5
          },
          {
            "row": 5,
            "col": 5
          },
          {
            "row": 4,
            "col": 5
          },
          {
            "row": 4,
            "col": 6
          }
        ]
      },
      {
        "id": "a9",
        "direction": "right",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 8,
            "col": 2
          },
          {
            "row": 9,
            "col": 2
          },
          {
            "row": 10,
            "col": 2
          },
          {
            "row": 10,
            "col": 3
          },
          {
            "row": 10,
            "col": 4
          },
          {
            "row": 10,
            "col": 5
          }
        ]
      },
      {
        "id": "a10",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 4,
            "col": 3
          },
          {
            "row": 4,
            "col": 2
          },
          {
            "row": 5,
            "col": 2
          }
        ]
      },
      {
        "id": "a11",
        "direction": "down",
        "color": "#49E67A",
        "cells": [
          {
            "row": 3,
            "col": 4
          },
          {
            "row": 4,
            "col": 4
          },
          {
            "row": 5,
            "col": 4
          },
          {
            "row": 6,
            "col": 4
          }
        ]
      },
      {
        "id": "a12",
        "direction": "up",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 2,
            "col": 9
          },
          {
            "row": 1,
            "col": 9
          },
          {
            "row": 0,
            "col": 9
          }
        ]
      },
      {
        "id": "a13",
        "direction": "right",
        "color": "#A64DFF",
        "cells": [
          {
            "row": 7,
            "col": 8
          },
          {
            "row": 7,
            "col": 9
          }
        ]
      },
      {
        "id": "a14",
        "direction": "up",
        "color": "#FF8C22",
        "cells": [
          {
            "row": 7,
            "col": 12
          },
          {
            "row": 6,
            "col": 12
          },
          {
            "row": 5,
            "col": 12
          },
          {
            "row": 4,
            "col": 12
          }
        ]
      },
      {
        "id": "a15",
        "direction": "right",
        "color": "#36D1DC",
        "cells": [
          {
            "row": 9,
            "col": 8
          },
          {
            "row": 10,
            "col": 8
          },
          {
            "row": 11,
            "col": 8
          },
          {
            "row": 12,
            "col": 8
          },
          {
            "row": 12,
            "col": 9
          },
          {
            "row": 12,
            "col": 10
          },
          {
            "row": 12,
            "col": 11
          }
        ]
      },
      {
        "id": "a16",
        "direction": "right",
        "color": "#F16B8C",
        "cells": [
          {
            "row": 11,
            "col": 0
          },
          {
            "row": 12,
            "col": 0
          },
          {
            "row": 12,
            "col": 1
          },
          {
            "row": 12,
            "col": 2
          },
          {
            "row": 12,
            "col": 3
          }
        ]
      },
      {
        "id": "a17",
        "direction": "down",
        "color": "#FF45B5",
        "cells": [
          {
            "row": 5,
            "col": 10
          },
          {
            "row": 6,
            "col": 10
          },
          {
            "row": 7,
            "col": 10
          }
        ]
      },
      {
        "id": "a18",
        "direction": "down",
        "color": "#20BFFF",
        "cells": [
          {
            "row": 9,
            "col": 7
          },
          {
            "row": 10,
            "col": 7
          },
          {
            "row": 11,
            "col": 7
          }
        ]
      },
      {
        "id": "a19",
        "direction": "right",
        "color": "#49E67A",
        "cells": [
          {
            "row": 10,
            "col": 10
          },
          {
            "row": 11,
            "col": 10
          },
          {
            "row": 11,
            "col": 11
          }
        ]
      },
      {
        "id": "a20",
        "direction": "down",
        "color": "#FFD43B",
        "cells": [
          {
            "row": 4,
            "col": 0
          },
          {
            "row": 5,
            "col": 0
          },
          {
            "row": 6,
            "col": 0
          }
        ]
      }
    ],
    "solution": [
      "a12",
      "a1",
      "a5",
      "a14",
      "a7",
      "a18",
      "a19",
      "a15",
      "a2",
      "a6",
      "a16",
      "a17",
      "a8",
      "a4",
      "a9",
      "a3",
      "a10",
      "a11",
      "a13",
      "a20"
    ]
  }
];

import { generateProceduralLevel } from './levelGenerator';

export const getLevel = (id: number): GameLevel => {
  const handcrafted = LEVELS.find((l) => l.id === id);
  if (handcrafted) return handcrafted;
  return generateProceduralLevel(id);
};

export const getAllAvailableLevels = (maxLevel: number): GameLevel[] => {
  const count = Math.max(maxLevel, 10);
  const result: GameLevel[] = [];
  for (let i = 1; i <= count; i++) {
    result.push(getLevel(i));
  }
  return result;
};

