require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
import process from "node:process";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Insert users
    const usersData = [
      {
        email: 'user@example.com',
        password_hash: hashedPassword,
        name: 'John Doe',
        role: 'user',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        is_verified: true
      },
      {
        email: 'helper@example.com',
        password_hash: hashedPassword,
        name: 'Jane Smith',
        role: 'helper',
        phone: '+1234567891',
        address: '456 Helper Ave, City, State',
        is_verified: true
      },
      {
        email: 'admin@example.com',
        password_hash: await bcrypt.hash('admin123', saltRounds),
        name: 'Admin User',
        role: 'admin',
        phone: '+1234567892',
        is_verified: true
      }
    ];

    for (const user of usersData) {
      await pool.query(`
        INSERT INTO users (email, password_hash, name, role, phone, address, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO NOTHING
      `, [user.email, user.password_hash, user.name, user.role, user.phone, user.address, user.is_verified]);
    }

    console.log('✅ Users seeded');

    // Insert services
    const servicesData = [
      {
        name: 'Home Cleaning',
        description: 'Professional cleaning service for your home',
        category: 'cleaning',
        price: 50.00,
        duration: '2 hours',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLxhN_UB7HoYAM2rfWBLkjuyIViKVFndDf7MAYEPMPFgoQd22l8yIXkt17W8X8n-i5RkRZFK9JKBjxZkWF9tvbpQ2LXlghGaBA3d_OORyKwC0pNWtricjb5I8dg6ehHRDQMDPaXxaPiWUchIfy-i7H60gOHXRH5fdNTkfzNbgQxRqXIpB0Gr4pc1xNoCaP0Rn46x9IbDVM4Nkj7voZOm0VvLJUTQLKmXUCP9R_ntyXV6ETC25GUUshQjGJ-vFLHajteRaMhj9F3A'
      },
      {
        name: 'Plumbing',
        description: 'Fix leaks and install fixtures',
        category: 'plumbing',
        price: 75.00,
        duration: '1 hour',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwrvkF5XgZZRDam280cbJSBJJNV_34NrF4P2q32S_pNVG4J2XsycCjdgP-v1Zk0KKLZmChtXedJMqg3fbYzDUMAnoFndIcUskB_ikugXhn-ZUL3ieK6e2fRypxFopnSirY2fVJNeVpZG2tYTpU-pT1GpylEo5rKGIuj3JazgUPrbbuwu3pNl9R6SztD7DMUWrNFhBdx5HF579JUACh_2mYtqEULNef3eDTD8vDxMcR7Mj6Y8-J_nUwM-_nQVxf0UyZ1mq15nsQTq4'
      },
      {
        name: 'Beauty Services',
        description: 'Salon services at your home',
        category: 'beauty',
        price: 60.00,
        duration: '1.5 hours',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuPMMzyJraKLUwTAA6D-gDlCNiowYxfRF8A8whfj5EdES4EA1RVt9tklQyvxiLhv9bilQE_wnCvF6puUJIgx3GCfs59wwr9KlkyH99gppXKyJqFpf4IZ7DsCrlCKRZMjoHTvIAk6JGf2z0LO0U1mRj7gLZUq9WGMBIQ_z17bRu-yeq37uE5hOFb4lcMP0RZk703Rva179dnuv80n4BZFskDVcFgvNa2CAmqbfppmm2txkzSYlSnT0fuXXf4ol-GfikopE1M0lksO8'
      },
      {
        name: 'Electrical Work',
        description: 'Safe and reliable electrical work',
        category: 'electrical',
        price: 80.00,
        duration: '2 hours',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABLcJx7T6lbuf_YTgRFX6UqZ8FjRkd8EkEsMpd2-GQPfytJUVrpoeFCWKr0koDsTF-F1A7bvRJqxHJBubSuXF64J4QyCHUr6CdhBIUh-bkpF8W2-Ofr9wHjVbzpcmqNguIfK7YcOgaM5XXXp6272c837XLVIVAcHdz1u7TF5423m7-9D7KfwdOSinX7hszuR0CTsFRg9VcrmwNT0Gpwd66pyTuy-F8f4ATUh3opdrOZO6Lyzg_K4gFhhDDDvRRn20AGeqYHqC27u0'
      },
      {
        name: 'Handyman Services',
        description: 'For all your repair needs',
        category: 'handyman',
        price: 55.00,
        duration: '1.5 hours',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADwYPFjV1T82bTIFAPfqcHy3fohXSCAL1idFd7wZmuOJE-j9pXxQ8V6zwaDI337IKgrgeSv7Bx5_x4dAeYhyj6vf7gtjftDfaPAYErHdVyZQASnIFPsFZ4cRrXspBmO7K9iMbi34xkl061sCB4MpR5YLa_pLbrSfF8614wSBsh7nDhJLEO3jNg6oGOq3t_LmtWN-rgsK0clLbSMk1PtpkvKi5f84jb1JtWzaL8S40vFoCqX9KQZGuVcV8dte3HNHHbG5F6r32NzPg'
      },
      {
        name: 'Tutoring',
        description: 'Expert academic support',
        category: 'education',
        price: 40.00,
        duration: '1 hour',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDur8NjCScs7kDBa4ZyLNh_EgAA8EVbDzJQFEaf8sA2pwDcMri_DllKE-5PHBhhdG5b4zI7ucdAz90Eh0M6DIBCLfgtJpRhUzPtVxIqJjmVl5YXPTvZhILWRK8MMcJbszvfwD0MukB1dABBfdnu9FBfDUlvaM4dI8dIOK-Vc9_1ytF7PBdk-ksNgi0H-tNEprj_FYJ4n15NDgk1eNgYxw8if3Iv-5Mj5sNLP-xWij1PhCBVY6UjMuSTx0xT4wmdqxBE1OhsN78z72w'
      }
    ];

    for (const service of servicesData) {
      await pool.query(`
        INSERT INTO services (name, description, category, price, duration, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [service.name, service.description, service.category, service.price, service.duration, service.image]);
    }

    console.log('✅ Services seeded');

    // Link helper to services
    await pool.query(`
      INSERT INTO helper_services (helper_id, service_id)
      SELECT u.id, s.id
      FROM users u, services s
      WHERE u.role = 'helper' AND s.category IN ('cleaning', 'plumbing')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Helper services linked');

    // Add availability slots for helper
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const availabilitySlots = [
      { start: '09:00', end: '11:00' },
      { start: '14:00', end: '16:00' },
      { start: '18:00', end: '20:00' }
    ];

    for (const slot of availabilitySlots) {
      await pool.query(`
        INSERT INTO availability_slots (helper_id, date, start_time, end_time)
        SELECT id, $2, $3, $4 FROM users WHERE role = 'helper'
        ON CONFLICT DO NOTHING
      `, [dateStr, slot.start, slot.end]);
    }

    console.log('✅ Availability slots seeded');

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedDatabase();