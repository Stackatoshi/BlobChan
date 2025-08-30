import { db } from './db'
import { boards } from './schema'

export async function seedDatabase() {
  try {
    // Insert default boards
    await db.insert(boards).values([
      {
        id: 'tech',
        title: 'Technology',
        description: 'Discuss the latest in technology, programming, and software development',
        bannerUrl: null,
        pageLimit: 10,
        threadsPerPage: 15,
      },
      {
        id: 'crypto',
        title: 'Cryptocurrency',
        description: 'Bitcoin, Ethereum, DeFi, and all things blockchain',
        bannerUrl: null,
        pageLimit: 10,
        threadsPerPage: 15,
      },
      {
        id: 'rnd',
        title: 'Random',
        description: 'Random discussions, memes, and general chat',
        bannerUrl: null,
        pageLimit: 10,
        threadsPerPage: 15,
      },
      {
        id: 'gaming',
        title: 'Gaming',
        description: 'Video games, esports, and gaming culture',
        bannerUrl: null,
        pageLimit: 10,
        threadsPerPage: 15,
      },
      {
        id: 'news',
        title: 'News & Politics',
        description: 'Current events, politics, and world news',
        bannerUrl: null,
        pageLimit: 10,
        threadsPerPage: 15,
      },
    ])
    
    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
}
