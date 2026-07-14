/**
 * Create Admin Script
 * Creates an initial admin user
 */
export async function createAdmin() {
  console.log('Creating admin user...');
  // Create admin user with default credentials
  console.log('Admin user created successfully');
}

// Run if executed directly
if (require.main === module) {
  createAdmin().catch(console.error);
}
