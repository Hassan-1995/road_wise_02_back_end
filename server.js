const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Importing routes
const driverRoutes = require("./driver/driverRoute");
const driverByIDRoutes = require("./driver/driverByID");

const tripRoutes = require("./trip/tripRoute");
const tripByDriverRoutes = require("./trip/tripByDriver");
const tripEntry = require("./trip/tripEntry");

const dropoutAssignmentByTripRoutes = require("./dropoutAssignment/dropoutAssignmentByTrip");
const dropoutAssignmentByDriverRoutes = require("./dropoutAssignment/dropoutAssignmentByDriver");
const dropoffEntry = require("./dropoutAssignment/dropoutAssignmentEntry");
const storeStatusByDriver = require("./dropoutAssignment/storeStatusByDriver");

const vehicleRoutes = require("./vehicle/vehicleRoute");
const vehicleByID = require("./vehicle/vehicleByID");
const vehicleByDriverID = require("./vehicle/vehicleByDriverID");
const fuelEntry = require("./vehicle/fuelEntry");
const serviceEntry = require("./vehicle/serviceEntry");
const repairEntry = require("./vehicle/repairEntry");
const vehicleMaintenanceRoute = require("./vehicleMaintenanceLog/vehicleMaintenanceRoute");

const liveDriverTracker = require("./liveTracker/driverLivePosition");

const storeRoutes = require("./store/storeRoute");

const optimisedPath = require("./path/optimisedPath");
const getOptimisedPath = require("./path/getOptimisedPath");
const statusOrEndtime = require("./path/status_endTime");
const actualPointPath = require("./path/actualPointPath");

// Register routes
app.use("/api/driver", driverRoutes); // get all drivers
app.use("/api/driver/id", driverByIDRoutes); // get driver by id

app.use("/api/trip", tripRoutes); // get all trips
app.use("/api/trip/driver/id", tripByDriverRoutes); // get trips by driverID
app.use("/api/trip/new", tripEntry); // create new trip entry

app.use("/api/dropout-assignment/trip", dropoutAssignmentByTripRoutes); // get dropoff locations under tripID
app.use("/api/dropout-assignment/driver", dropoutAssignmentByDriverRoutes); // get assigned dropoff locations to driverID
app.use("/api/dropout-assignment/driver", storeStatusByDriver); // update/put status of dropoff location [Pending|Completed|Cancelled]
app.use("/api/dropout-assignment/new", dropoffEntry); // insert fuel log entry

app.use("/api/vehicle", vehicleRoutes); // get all vehicles
app.use("/api/vehicle/id", vehicleByID); // get vehicle by id
app.use("/api/vehicle/driver/id", vehicleByDriverID); // get completed vehicle info including maintenance wrt driverID
app.use("/api/vehicle/fuel/maintenance", fuelEntry); // insert fuel log entry
app.use("/api/vehicle/service/maintenance", serviceEntry); // insert service log entry
app.use("/api/vehicle/repair/maintenance", repairEntry); // insert repair log entry
app.use("/api/vehicle-maintenance", vehicleMaintenanceRoute); // get completed vehicle info including maintenance

app.use("/api/driver-live-position", liveDriverTracker); // get drivers live position

app.use("/api/store", storeRoutes); // get all store

app.use("/api/optimised-path", optimisedPath); // create optimised path
app.use("/api/get-optimised-path/trip", getOptimisedPath); // create optimised path
app.use("/api/update-status-or-endtime", statusOrEndtime); // update status and endtime
app.use("/api/actual-point-path", actualPointPath); // insert actual point path

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
