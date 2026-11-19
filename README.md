SmartPark – Modern Parking & Live Monitoring Dashboard

Project Overview

SmartPark is a modern parking management system designed to monitor parking spaces, manage vehicle entry and exit, calculate parking fees, and display parking activity through an interactive dashboard.

The system provides a simple way to manage parking operations and monitor available, occupied, and unavailable parking spaces.

Technologies Used
	•	React
	•	TypeScript
	•	Vite
	•	Tailwind CSS
	•	Lucide React
	•	Local Storage

Main Features
	•	Modern parking dashboard
	•	Real-time parking space status updates within the application
	•	Vehicle entry and exit management
	•	Vehicle registration records
	•	Automatic parking fee calculation
	•	Parking zones A, B, C, and D
	•	Vehicle movement history
	•	Revenue monitoring
	•	Staff and settings sections
	•	Dark and light mode
	•	Responsive user interface
	•	Local storage for saving application data

Object-Oriented Programming Concepts

SmartPark uses Object-Oriented Programming concepts through TypeScript classes.

1. Encapsulation

The Vehicle class contains private properties such as registration number and driver name. These properties are accessed through public methods.

2. Abstraction

The Vehicle class is an abstract class. It defines the common structure and abstract method for different vehicle types.

3. Inheritance

Sedan, SUV, ElectricVehicle, Van, and Truck classes inherit from the Vehicle class.

4. Polymorphism

Each vehicle subclass implements its own version of the getVehicleType() method.

5. Classes and Objects

The ParkingManager class manages vehicle entry, exit, parking-space status, and available parking spaces.

The VehicleFactory class creates objects of different vehicle types.

Project Structure

Smart-Parking-System/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   │   └── mockData.ts
│   ├── models/
│   │   └── Vehicle.ts
│   ├── services/
│   │   └── ParkingManager.ts
│   ├── App.tsx
│   ├── types.ts
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

