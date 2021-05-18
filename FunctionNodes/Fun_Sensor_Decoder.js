
var strTopic;
var iIdx;
var strSensor;

strTopic = msg.topic;

// get sensor name (right part of topic after last slash)
iIdx = strTopic.lastIndexOf("/");
strSensor = strTopic.substr(iIdx+1);
msg.topic = strSensor;

// switch sensor date to corresponding output (connected to assoziated GUI element) 
switch (strSensor)
{
    case "Temperature":     return [msg, null, null];
    case "Humidity":        return [null, msg, null];
    case "CO2":             return [null, null, msg];
}

return [null, null, null];

