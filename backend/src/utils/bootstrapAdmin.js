import { User } from '../models/User.js';

export async function bootstrapAdmin() {
  const hasAdmin = await User.exists({ role: 'admin' });
  if (hasAdmin) return;

  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      'ADMIN_EMAIL/ADMIN_PASSWORD not set; skipping admin bootstrap',
    );
    return;
  }
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('Promoted existing user to admin:', email);
    }
    return;
  }
  await User.create({ name, email, password, role: 'admin', isVerified: true });
  console.log('Created admin user:', email);
}
