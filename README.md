# ESP32SmartBoard_NodeRED

This Node-RED Flow completes the Arduino Project [ESP32SmartBoard_MqttSensors_BleCfg](https://github.com/ronaldsieber/ESP32SmartBoard_MqttSensors_BleCfg) with a dashboard as well as enables to save the sensor data into a database. The dashboard shows the current sensor data and provides a GUI for configuring the runtime behavior of the *ESP32SmartBoard*.

## Project Overview

This Node-RED Flow communicates with the *ESP32SmartBoard* via MQTT messages. It receives sensor data from the board, displays it graphically on the dashboard and writes it in parallel to an InfluxDB database. The dashboard also contains controls that enables the user to configure the behavior of the board. To do this, the flow sends the corresponding configuration messages to the board via MQTT. For example, a drop-down menu can be used to choose whether the LED Bar Indicator shows the measured value of the temperature, humidity or CO2 sensor. The Heartbeat Mode (blinking of the blue LED on the ESP32DevKit) is primarily controlled by a configurable timer. In order to be able to use the board in bedrooms, Heartbeat is deactivated at night and only switched on during the day. Alternatively, Heartbeat can also be permanently switched on or off manually using a drop-down menu.

![\[Project Overview\]](Documentation/ESP32SmartBoard_NodeRED.png)

Node-RED itself is a graphical, event-based Low-Code Programming environment. For both, creation of the program (called "Flow") and the displaying of the dashboard only a browser is used. This means that all common devices such as PCs and Laptops are suitable for programming, and Tablets or Smartphones are also suitable for displaying the dashboard.

![\[Dashboard\]](Documentation/Screenshot_Dashbaord_GUI.png)

## Setup of Flow in Node-RED

**Installation of Third-Party Nodes**

The Node-RED Flow for the ESP32SmartBoard uses various third-party nodes that must first be installed manually to the Node-RED Palette. Therefore the following steps are necessary:

 - Node-RED Main Menu ("Hamburger Menu") -> Manage Palette
   
 - Switch to the "Install" tabsheet in the Palette Manager and use the
   search field to search for and install the third-party nodes listed
   below:

![\[Install Node\]](Documentation/Screenshot_ManagePalette_InstallNode.png)

**List of Third Party Nodes to Install**

 - node-red-dashboard
 - node-red-contrib-influxdb
 - node-red-contrib-bigtimer
 - node-red-contrib-countdown
 - node-red-contrib-simple-gate
 - node-red-contrib-ui-led-fork
 - node-red-contrib-ui-level
 - node-red-node-ui-table


**Import of the flow into Node-RED**

To insert the Flow [ESP32SmartBoard_NodeRED](ESP32SmartBoard_NodeRED/ESP32SmartBoard_NodeRED.json) in Node-RED, the following steps are necessary:

- Node-RED Main Menu ("Hamburger Menu") -> Import

- Select "new flow" as the destination for "import to"

- Import the file [ESP32SmartBoard_NodeRED.json](ESP32SmartBoard_NodeRED/ESP32SmartBoard_NodeRED.json) via "select a file to imort"

![\[Import Node\]](Documentation/Screenshot_ManagePalette_ImportNode.png)
## Linking the Node-RED Flow with the ESP32SmartBoard

The *ESP32SmartBoard* and Node-RED Flow communicate with a set of MQTT messages. For this purpose, the flow uses five MQTT nodes, one for receiving sensor data (1x MQTT_In) and two additional nodes for sending configuration messages (4x MQTT_Out):

![\[ESP32SmartBoard Flow\]](Documentation/Screenshot_ESP32SmartBoard_Flow.png)

In order to be able to exchange data with each other, both, the *ESP32SmartBoard* and Node-RED Flow must use the same set of MQTT messages. Therefore, to link ESP32SmartBoard and Node-RED Flow, it is necessary to adopt the topics used by the board for four of the MQTT nodes (see marking in the image above). This is done in the property dialog of the nodes by adjusting the "Topic" field accordingly:

![\[Configure MQTT Topics\]](Documentation/Screenshot_MqttNode_PropertyDialog.png)

Details on the structure of the topics are described in the section *"Individualization of the MQTT Topics at Runtime"* in the Arduino Project [ESP32SmartBoard_MqttSensors_BleCfg](https://github.com/ronaldsieber/ESP32SmartBoard_MqttSensors_BleCfg). In the standard configuration, the *ESP32SmartBoard* shows a list of all topics used in the serial terminal window during the boot process.

## Implementation Details of the Node-RED Flow

The *ESP32SmartBoard* and the Node-RED Flow exchange their data via MQTT messages. The board's sensor data is read into the flow via the MQTT input node. The function node [Sensor_Decoder](FunctionNodes/Fun_Sensor_Decoder.js) works as a multiplexer and outputs the received sensor data depending on the topic (= sensor type) at one of its 3 outputs. As a result, each of the 3 following instrument widgets (temperature, humidity, CO2 level) only receives the data that is relevant for the respective element.

In addition to the instrument widgets, the measured values ​​are displayed in compact form in a table. In the function node [Table_Update](FunctionNodes/Fun_Table_Update.js), the sensor data received via the MQTT input node are formatted and transferred to the table widget with a timestamp.

In parallel to the display in the dashboard widgets, the sensor data is written to an InfluxDB database. This allows the measured values ​​to be evaluated later as a time series (e.g. in Grafana). The Influxdb_Out Node is responsible for writing the data to the database. The function node [InfluxDB_Insert](FunctionNodes/Fun_InfluxDB_Insert.js) in front extracts the sensor name from the received MQTT topic and move it as the `msg.measurement` attribute in the return object. The Influxdb_Out Node then takes it over from there as the measurement name for entering the data in the InfluxDB.

The Function Node [Packet_ACK](FunctionNodes/Fun_Packet_ACK.js) extracts the packet number of the received sensor data packet, the subsequent n MQTT Output Node sends this back to the *ESP32SmartBoard* as an acknowledgement.

The flow chain consisting of a *BigTimer* node and subsequent MQTT output node is used to control the cycle time of the data transmission from the *ESP32SmartBoard*. A cycle time of typically 1 minute is used during the day, while at night the transmission interval is increased to 2 minutes so that less data is written to the database.

The two dropdown menus allow the user to configure the behavior of the board. To do this, the flow sends the corresponding MQTT messages to the board. The inject nodes in front of the dropdown nodes select the respective default values ​​from the dropdown menus once during deployment. The Heartbeat Mode (flashing of the blue LED on the ESP32DevKit) is controlled by the *BigTimer* node in the "Timer Automatic" state. The times for switching the Heartbeat on and off can be specified via the property dialog of the node:

![\[BigTimer Property Dialog\]](Documentation/Screenshot_BigTimer_PropertyDialog.png)

Thanks to the time control, the board can also be used in bedrooms, whereby Heartbeat is automatically deactivated at night in order to prevent annoying flashing. The timer can be deactivated using the drop-down menu in front and the Heartbeat Mode can be set manually instead. This is done by writing the control commands `"auto"`, `"manual on / off"` or `"quiet"` to the timer. When the status changes, the *BigTimer* emits the required command at its first output to set the Heartbeat behavior of the *ESP32SmartBoard* (on / off). The following MQTT output node then generates the corresponding MQTT message for the board. At its second output, the *BigTimer* gives information about the current timer status once a minute. The `msg.extState` attribute of the return object provides the status information as text, which is displayed in the following text widget in the dashboard and updated every minute (e.g. *"On for 12hrs 34mins"*).

Detailed information on the BigTimer Node can be found on the website https://tech.scargill.net/big-timer/.
