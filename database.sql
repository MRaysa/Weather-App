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
