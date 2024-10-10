class DiagramInfo {
    constructor(userId, name, bpmn, script) {
      this.userId = userId;
      this.name = name;
      this.bpmn = bpmn;
      this.script = script;
    }
  
    logDetails() {
      console.log(`Diagram Name: ${this.name}\nUser ID: ${this.userId}\nBPMN: ${this.bpmn}`);
    }
  }
  // Export the DiagramInfo class so it can be used in other files
export default DiagramInfo;