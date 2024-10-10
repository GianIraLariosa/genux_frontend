const parseTextToPlantUML = (text) => {
    const lines = text.split("\n").map(line => line.trim());
    const screens = [];
    const connections = [];

    let parsingScreens = false;
    let parsingConnections = false;

    const screenSectionRegex = /.*(Screens).*/;  // Match headers like "## Screens:" or "**Screens:**"
    const connectionSectionRegex = /.*(Connections).*/;  // Match headers like "## Connections:"

    lines.forEach(line => {
        if (screenSectionRegex.test(line)) {
            parsingScreens = true;
            parsingConnections = false;
        } else if (connectionSectionRegex.test(line)) {
            parsingScreens = false;
            parsingConnections = true;
        } else if (parsingScreens && line.startsWith("-") || parsingScreens && line.startsWith("*")) {
            screens.push(line.substring(2).trim());
        } else if (parsingConnections && line.startsWith("-") || parsingConnections && line.startsWith("*")) {
            const connection = line.substring(2).trim().split(" --> ");
        if (connection.length === 2) {
            const [from, rest] = connection;
            const [to, action] = rest.split(" : ");
            connections.push({ from: from.trim(), to: to.trim(), action: action.trim() });
        }
        }
    });

    // Generate PlantUML script
    let plantUMLScript = "@startuml\n";
    plantUMLScript += "(*) --> \"" + screens[0] + "\"\n";

    connections.forEach(({ from, to, action }) => {
        plantUMLScript += `"${from}" --> [${action}] "${to}"\n`;
    });

    plantUMLScript += "@enduml";
    return plantUMLScript;
};

export default parseTextToPlantUML;