import sortSequenceFlows from "./SortSeqComponent";

const parseXML = (xmlString) => {
    // Parse XML string to DOM
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Step 2: Locate the <bpmn2:startEvent> element
    const startEvent = xmlDoc.getElementsByTagName('bpmn2:startEvent')[0];

    // Initialize an array to store activities and sequence flows
    const activities = [];
    let sequenceFlows = [];
    const gateways = [];
    const endEvents = [];
    // Step 3: Extract and store the id attribute
    if (startEvent) {
    const startEventId = startEvent.getAttribute('id');
      // Get all sequence flows
    const flows = xmlDoc.getElementsByTagName('bpmn2:sequenceFlow');
    for (let flow of flows) {
        const id = flow.getAttribute('id');
        const name = flow.getAttribute('name');
        const sourceRef = flow.getAttribute('sourceRef');
        const targetRef = flow.getAttribute('targetRef');
        sequenceFlows.push({ id, name, sourceRef, targetRef });
    }

    sequenceFlows = sortSequenceFlows(sequenceFlows, startEventId);

      // Get all tasks
    const tasks = xmlDoc.getElementsByTagName('bpmn2:task');
    for (let task of tasks) {
        const taskId = task.getAttribute('id');
        const taskName = task.getAttribute('name');

        // Ensure task has a name
        if (taskName) {
        activities.push({
            id: taskId,
            name: taskName,
        });
        }
    }
    // Extract exclusive gateways
    const gatewayElements = xmlDoc.getElementsByTagName('bpmn2:exclusiveGateway');
    for (let gateway of gatewayElements) {
        const id = gateway.getAttribute('id');
        const name = gateway.getAttribute('name');
        gateways.push({ id, name });
    }

    // Extract end events
    const endEventElements = xmlDoc.getElementsByTagName('bpmn2:endEvent');
    for (let endEvent of endEventElements) {
        const id = endEvent.getAttribute('id');
        // const name = endEvent.getAttribute('name');
        // if (name) {
        endEvents.push({ id });
        // }
    }

    // Check if every activity is connected by a sequence flow
    for (let activity of activities) {
        const isConnected = sequenceFlows.some(flow => 
        flow.sourceRef === activity.id || flow.targetRef === activity.id
        );

        if (!isConnected) {
        console.error(`Error: Activity ${activity.name} (id: ${activity.id}) is not connected by any sequence flow.`);
        return null; // Stop further processing if an error is found
        }
    }

    return { startEventId, endEvents, activities, sequenceFlows, gateways };

    } else {
    console.error('Start Event not found!');
    }
};

export default parseXML;