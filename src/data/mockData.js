const LOCATIONS = ["Konoha", "Suna", "Kiri", "Iwa", "Kumo"];
const HEALTH_STATUS = ["Healthy", "Injured", "Critical"];

const generateData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: `abc${i + 1}`,
            name: `Character ${i + 1}`,
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            health: HEALTH_STATUS[Math.floor(Math.random() * HEALTH_STATUS.length)],
            power: Math.floor(Math.random() * (10000 - 100 + 1)) + 100,
        });
    }
    return data;
};

export const MOCK_DATA = generateData(1005);
