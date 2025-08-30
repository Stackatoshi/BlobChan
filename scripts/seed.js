const { execSync } = require('child_process')

console.log('🌱 Seeding database...')

try {
  // Run the TypeScript seed file
  execSync('npx tsx lib/seed.ts', { stdio: 'inherit' })
  console.log('✅ Database seeded successfully!')
} catch (error) {
  console.error('❌ Failed to seed database:', error.message)
  process.exit(1)
}
