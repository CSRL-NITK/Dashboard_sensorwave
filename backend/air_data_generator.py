import csv, random, time, os

filename = "air_data.csv"

# create header if not exist
if not os.path.exists(filename):
    with open(filename, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "CO2", "Methane", "PM2.5", "PM10", "Temperature", "Humidity", "Ozone", "NO2", "SO2", "VOC"])

while True:
    row = [
        time.strftime("%Y-%m-%d %H:%M:%S"),
        random.uniform(350, 1200),    # CO2
        random.uniform(1, 5),         # Methane
        random.uniform(10, 150),      # PM2.5
        random.uniform(20, 200),      # PM10
        random.uniform(20, 40),       # Temp
        random.uniform(30, 80),       # Humidity
        random.uniform(0, 0.1),       # Ozone
        random.uniform(0, 0.5),       # NO2
        random.uniform(0, 0.3),       # SO2
        random.uniform(0, 1)          # VOC
    ]
    with open(filename, "a", newline="") as f:
        csv.writer(f).writerow(row)
    print("Generated:", row)
    time.sleep(2)  # every 2 seconds
