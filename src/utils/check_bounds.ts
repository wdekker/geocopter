import { REGIONS } from '../data/cities';

let totalOut = 0;
REGIONS.forEach(region => {
    let outCount = 0;
    const [north, south, east, west] = region.bounds;

    region.cities.forEach(city => {
        const lat = city.lat;
        const lng = city.lng;
        let isOut = false;

        if (lat > north || lat < south) {
            isOut = true;
        }

        if (region.id !== 'world') {
            if (lng > east || lng < west) {
                isOut = true;
            }
        }

        if (isOut) {
            console.log(`[${region.id}] City out of bounds: ${city.name} (${lat}, ${lng}) - Bounds N:${north} S:${south} E:${east} W:${west}`);
            outCount++;
            totalOut++;
        }
    });
    if (outCount > 0) {
        console.log(`Region ${region.id} has ${outCount} cities out of bounds.`);
    }
});
if (totalOut === 0) {
    console.log("All cities are perfectly within their region bounds!");
} else {
    console.log(`Total cities out of bounds: ${totalOut}`);
}
