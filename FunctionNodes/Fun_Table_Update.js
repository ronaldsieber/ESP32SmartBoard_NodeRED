
var  strTopic;
var  strPayload;
var  iID;
var  strSensor;
var  strValue;
var  dtTimeStamp;
var  strTimestamp;
var  iIdx;

strTopic = msg.topic;
strPayload = msg.payload;

// get sensor name (right part of topic after last slash)
iIdx = strTopic.lastIndexOf('/');
strSensor = strTopic.substring(iIdx + 1);

// process sensor data
switch (strSensor)
{
    case "Temperature":
    {
        iID = 1;
        strValue = strPayload;
        break;
    }
    case "Humidity":
    {
        iID = 2;
        strValue = strPayload;
        break;
    }

    case "CO2":
    {
        iID = 3;
        strValue = strPayload;
        break;
    }

    case "SensTemp":
    {
        iID = 4;
        strValue = strPayload;
        break;
    }

    default:
    {
        return;
    }
}


// build Timestamp
dtTimeStamp = new Date();
strTimestamp = dtTimeStamp.getFullYear() + "-" +
               ('0'+(dtTimeStamp.getMonth() + 1)).slice(-2) + "-" +
               ('0'+ dtTimeStamp.getDate()).slice(-2) + " - " +
               ('0'+ dtTimeStamp.getHours()).slice(-2) + ":" +
               ('0'+ dtTimeStamp.getMinutes()).slice(-2) + ":" +
               ('0'+ dtTimeStamp.getSeconds()).slice(-2);


// build message to send
msg.payload = {
    command: "updateOrAddData",
    arguments: [
        [
            {
                "id": iID,
                "Sensor": strSensor,
                "Value": strValue,
                "Timestamp": strTimestamp
            }
        ]
    ],
    returnPromise: true
}


return msg;

