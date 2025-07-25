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
const dropoutAssignmentByTripRoutes = require("./dropoutAssignment/dropoutAssignmentByTrip");
const dropoutAssignmentByDriverRoutes = require("./dropoutAssignment/dropoutAssignmentByDriver");

// Register routes
app.use("/api/driver", driverRoutes);
app.use("/api/driver/id", driverByIDRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/trip/driver", tripByDriverRoutes);
app.use("/api/dropout-assignment/trip", dropoutAssignmentByTripRoutes);
app.use("/api/dropout-assignment/driver", dropoutAssignmentByDriverRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
