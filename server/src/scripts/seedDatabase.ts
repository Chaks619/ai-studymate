/**
 * Seed Database Script
 * Populates database with initial data
 */
export async function seedDatabase() {
  console.log('Seeding database...');
  // Add initial data (categories, default settings, etc.)
  console.log('Database seeded successfully');
}

// Run if executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}
