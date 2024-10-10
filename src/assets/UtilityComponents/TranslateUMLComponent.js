import data from './ParseXMLComponent';

const translateToPlantUML = (data) => {
    // if (!data || !data.startEventId || !data.endEventId) {
    //   return '@startuml\nNo start or end event found\n@enduml';
    // }
  
    let plantUML = '@startuml\n';
    let done = true;
    let gatewayStack = []; // Stack to track active gateways
    let gatewayBranches = [];

    data.sequenceFlows.forEach((flow) => {
        const sourceGateway = data.gateways.find(g => g.id === flow.sourceRef);
        const sourceActivity = data.activities.find(activity => activity.id === flow.sourceRef);
        const targetActivity = data.activities.find(activity => activity.id === flow.targetRef);
        const targetGateway = data.gateways.find(g => g.id === flow.targetRef);
        const targetEnd = data.endEvents.find(end => end.id === flow.targetRef);

        // Process start event
        if (flow.sourceRef === data.startEventId) {
          if (targetGateway) {
            plantUML += `(*) --> if "${targetGateway.name}" then\n`;
          } else if (targetActivity) {
            plantUML += `(*) --> "${targetActivity.name}"\n`;
          }
        }
    
        // Process activity-to-activity transitions
        if (sourceActivity && targetActivity) {
          plantUML += `"${sourceActivity.name}" --> "${targetActivity.name}"\n`;
        }
    
        // Process activity to gateway
        if (sourceActivity && targetGateway) {
          plantUML += `"${sourceActivity.name}" --> if "${targetGateway.name}" then\n`;
        }

        // Process activity to end event
        if (sourceActivity && targetEnd) {
          plantUML += `"${sourceActivity.name}" --> (*)\n`;
        }

        if (flow.isGatewayEnd) {
            plantUML += "endif\n";
        }
    
        // Process gateway decisions
        if (sourceGateway) {

          // Check for else condition before adding the current gateway to the stack
           if (sourceGateway.id === gatewayStack[gatewayStack.length - 1]) {
            plantUML += 'else\n';
            gatewayStack.pop(); // Pop the gateway after processing else

            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }

          } else {
            if(targetGateway) {
              plantUML += `-->[${flow.name || 'true'}] if "${targetGateway.name}" then\n`;
            } else {
              plantUML += `-->[${flow.name || 'true'}] "${targetActivity ? targetActivity.name : targetGateway.name}"\n`;
            }
  
              gatewayStack.push(sourceGateway.id);
            }
        }

    });  
    // End the diagram
    plantUML += '@enduml';
  
    return plantUML;
  };

export default translateToPlantUML;