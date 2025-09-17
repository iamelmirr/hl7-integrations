const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serviraj statičke fajlove iz public foldera
app.use(express.static(path.join(__dirname, '..', 'public')));

// Funkcija za parsiranje HL7 poruke
function parseHL7(message) {
    const segments = message.split(/\r\n|\r|\n/);
    const parsed = [];
    segments.forEach(segment => {
        if (segment.trim() === '') return;
        const fields = segment.split('|');
        parsed.push(fields);
    });
    return parsed;
}

// Funkcija za konverziju u JSON
function hl7ToJson(parsed) {
    const json = {};
    parsed.forEach(segment => {
        const segmentType = segment[0];
        json[segmentType] = {};
        for (let i = 1; i < segment.length; i++) {
            json[segmentType][`field${i}`] = segment[i];
        }
    });
    return json;
}

// Endpoint za dobijanje HL7 podataka kao JSON
app.get('/api/hl7', (req, res) => {
    const hl7FilePath = path.join(__dirname, '..', 'samples', 'sample.hl7');
    const hl7Message = fs.readFileSync(hl7FilePath, 'utf8');
    const parsedMessage = parseHL7(hl7Message);
    const jsonMessage = hl7ToJson(parsedMessage);
    res.json(jsonMessage);
});

// Endpoint za parsirane segmente
app.get('/api/hl7/segments', (req, res) => {
    const hl7FilePath = path.join(__dirname, '..', 'samples', 'sample.hl7');
    const hl7Message = fs.readFileSync(hl7FilePath, 'utf8');
    const parsedMessage = parseHL7(hl7Message);
    res.json(parsedMessage);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});