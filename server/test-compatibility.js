// Simple test script for compatibility functions
const { analyzeRelationshipDynamics, generateGrowthAreas } = require('./api-router');

// Test Dragon-Dog compatibility
const sign1 = 'Dragon';
const sign2 = 'Dog';
const compatibilityType = 'Worst Couple';

console.log('\nTesting Dragon-Dog Relationship Dynamics:');
const dynamics = analyzeRelationshipDynamics(sign1, sign2, compatibilityType);
console.log(dynamics);

console.log('\nTesting Dragon-Dog Growth Areas:');
const growthAreas = generateGrowthAreas(sign1, sign2, compatibilityType);
console.log(growthAreas);
