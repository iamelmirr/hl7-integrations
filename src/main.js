const fs = require('fs');
const path = require('path');

// Funkcija za parsiranje HL7 poruke
function parseHL7(message) {
    const segments = message.split(/\r\n|\r|\n/); // HL7 može koristiti \r\n, \r ili \n
    const parsed = [];

    segments.forEach(segment => {
        if (segment.trim() === '') return;
        const fields = segment.split('|');
        parsed.push(fields);
    });

    return parsed;
}

// Čitanje HL7 fajla
const hl7FilePath = path.join(__dirname, '..', 'samples', 'sample.hl7');
const hl7Message = fs.readFileSync(hl7FilePath, 'utf8');
const parsedMessage = parseHL7(hl7Message);

// Ispis rezultata
console.log('Parsed HL7 Message:');
console.log('==================================================');
parsedMessage.forEach(segment => {
    console.log(`Segment Type: ${segment[0]}`);
    console.log('Fields:');
    for (let i = 1; i < segment.length; i++) {
        console.log(`  Field ${i}: ${segment[i]}`);
    }
    console.log('------------------------------');
});