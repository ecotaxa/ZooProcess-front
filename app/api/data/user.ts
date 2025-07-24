import { User } from '@/api/network/interfaces';

import { getUserMe } from '@/api/network/zooprocess-api';

export async function getMe(): Promise<User> {
  try {
    const user = await getUserMe(`/users/me`);
    return user;
  } catch (error) {
    console.error('Error - getMe()', error);
    throw error;
  }
}
