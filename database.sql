-- Create the database
CREATE DATABASE weather_db;
GO

USE weather_db;
GO

CREATE TABLE Locations (
    location_id INT IDENTITY(1,1) PRIMARY KEY,
    city_name NVARCHAR(100) NOT NULL,
    latitude FLOAT,
    longitude FLOAT
);
GO

CREATE TABLE Weather_Data (
    weather_id INT IDENTITY(1,1) PRIMARY KEY,
    location_id INT,
    temperature FLOAT NOT NULL,
    humidity FLOAT NOT NULL,
    timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);
GO
