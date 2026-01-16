// Walkthrough keyframe generation utilities

export function generateWalkthroughKeyframes(rooms) {
  if (rooms.length === 0) {
    return [
      {
        position: [5, 1.7, 8],
        target: [0, 1.5, 0],
        duration: 3,
      },
    ];
  }

  const keyframes = [];

  // Start at center, looking around
  keyframes.push({
    position: [0, 1.7, 0],
    target: [0, 1.5, 0],
    duration: 2,
  });

  // Visit each room
  rooms.forEach((room, index) => {
    const centerX = room.x / 40 + room.width / 80;
    const centerZ = room.y / 40 + room.height / 80;

    // Entry to room
    keyframes.push({
      position: [centerX - 1.5, 1.7, centerZ - 1.5],
      target: [centerX, 1.5, centerZ],
      duration: 2 + index * 0.5,
    });

    // Pan across room
    keyframes.push({
      position: [centerX + 1, 1.7, centerZ],
      target: [centerX, 1.5, centerZ],
      duration: 1.5,
    });

    // Pan other direction
    keyframes.push({
      position: [centerX, 1.7, centerZ + 1],
      target: [centerX, 1.5, centerZ],
      duration: 1.5,
    });
  });

  // Return to center
  keyframes.push({
    position: [0, 1.7, 5],
    target: [0, 1.5, 0],
    duration: 3,
  });

  return keyframes;
}

// Helper function for interpolating between 3D points
function interpolateVector(start, end, t) {
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t,
  ];
}

export function WalkthroughController(_props) {
  return null;
}
