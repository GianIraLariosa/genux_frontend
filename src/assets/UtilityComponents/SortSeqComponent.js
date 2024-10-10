const sortSequenceFlows = (sequenceFlows, startEventId) => {
  let sortedFlows = [];
  let flowMap = new Map();
  let visitedFlows = new Set();

  // Create a map for easy lookup of flows by sourceRef
  sequenceFlows.forEach(flow => {
    const sourceRef = flow.sourceRef;
    if (!flowMap.has(sourceRef)) {
      flowMap.set(sourceRef, []);
    }
    flowMap.get(sourceRef).push(flow);
  });

  // Helper function to recursively traverse the flows
  const traverseFlows = (currentFlows) => {
    while (currentFlows.length > 0) {
      let currentFlow = currentFlows.shift();

      if (visitedFlows.has(currentFlow.id)) {
        // Prevent looping back to the same flow
        continue;
      }

      // Mark the flow as visited
      visitedFlows.add(currentFlow.id);
      sortedFlows.push(currentFlow);

      // Check if the current flow points to a gateway
      const nextFlows = flowMap.get(currentFlow.targetRef);

      if (nextFlows) {
        if (currentFlow.targetRef.startsWith('Gateway')) {
          // Mark the start of the gateway
          sortedFlows.push({ isGatewayStart: true, gatewayId: currentFlow.targetRef });

          // Process each branch of the gateway recursively
          nextFlows.forEach(flow => {
            traverseFlows([flow]);
          });

          // After all branches have been processed, mark the end of the gateway
          sortedFlows.push({ isGatewayEnd: true, gatewayId: currentFlow.targetRef });
        } else {
          // Otherwise, just follow the next flow in sequence
          traverseFlows(nextFlows);
        }
      } else {
        // If there are no next flows, it's the end of a branch
        sortedFlows.push({ isEndOfBranch: true });
      }
    }
  };

    // Start from the event id (start event) and traverse the flows
    let initialFlows = flowMap.get(startEventId) || [];
    traverseFlows(initialFlows);

    return sortedFlows;
};

export default sortSequenceFlows;