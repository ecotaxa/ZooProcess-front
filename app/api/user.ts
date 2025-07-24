import * as api from '@/app/api/network/zooprocess-api';
import useSWR from 'swr';

export async function useUserByEmail(email: string) {
  // const res = await fetch()

  const {
    data = [],
    error = false,
    isLoading = true,
  } = useSWR(`/user?email=${email}`, api.getUserByEmail, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // if ( isLoading==false && error==false ){
  //   console.log("useProjects()")
  //   console.log("  data      -> ", data )
  //   console.log("  isLoading -> ", isLoading )
  //   console.log("  error     -> ", error )
  // }

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export async function useUserById(userId: any) {
  console.log('useUserById() | userId :', userId);
  // const user = await api.getUserById(`/users/${userId}`)
  // return user

  // const res = await fetch()

  const {
    data = [],
    error = false,
    isLoading = true,
  } = useSWR(`/users/${userId}`, api.getUserById, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.debug('useUserById() | data :', data);
  console.debug('useUserById() | error :', error);
  console.debug('useUserById() | isLoading :', isLoading);
  console.debug('useUserById() | data.email :', data.email);
  console.debug('useUserById() | data.role :', data.role);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export function useUserByIdWithAuth(userId: any) {
  console.log('useUserByIdWithAuth() | userId :', userId);
  // const user = await api.getUserById(`/users/${userId}`)
  // return user

  // const res = await fetch()

  const {
    data = [],
    error = false,
    isLoading = true,
  } = useSWR(`/users/${userId}`, api.getUserByIdWithAuth, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  console.debug('useUserByIdWithAuth() | data :', data);
  console.debug('useUserByIdWithAuth() | error :', error);
  console.debug('useUserByIdWithAuth() | isLoading :', isLoading);
  console.debug('useUserByIdWithAuth() | data.email :', data.email);
  console.debug('useUserByIdWithAuth() | data.role :', data.role);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

// export function useUserMe() {

//   console.log("useUserMe()" )

//     // const { data={}, error=false, isLoading=true } = useSWR(`/users/me`, api.getUserMe,
//     const { data=[], error=false, isLoading=true } = useSWR(`/users/me` ,api.getUserMe,
//       {
//           revalidateIfStale: false,
//           revalidateOnFocus: false,
//           revalidateOnReconnect: false
//       }
//     )

//     if ( isLoading==false && error==false ){
//       console.log("useUserMe()")
//       console.log("  data      -> ", data )
//     }

//     return {
//       user: data,
//       isLoading,
//       isError: error
//     }

// }

export function useUsers() {
  const {
    data = [],
    error = false,
    isLoading = true,
  } = useSWR('/users/', api.getUsers, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // if ( isLoading==false && error==false ){
  //   console.log("useProjects()")
  //   console.log("  data      -> ", data )
  //   console.log("  isLoading -> ", isLoading )
  //   console.log("  error     -> ", error )
  // }

  console.debug('useUsers(), dta: ', data);

  return {
    users: data,
    isLoading,
    isError: error,
  };
}

export async function updateUser({ userId, data }) {
  console.debug('updateUser() userId: ', userId, 'data: ', data);

  return api
    .updateUser(userId, data)
    .then(res => {
      console.log('updateUser() res: ', res);
      // return res;
      return Promise.resolve({ data: res, message: 'User updated successfully' });
    })
    .catch(error => {
      console.log('updateUser() err: ', error);
      // return err;
      throw {
        message: 'Cannot update user',
        error,
        data,
        userId,
      };
    });
}

export async function createUser(name: any, email: any, password: any) {
  console.log('createUser(', name, ',', email, 'password');

  //TODO chiffrer le password ici
  const data = { name, email, password };

  return await api
    .createUser(data)
    .then(res => {
      console.log('User', name, 'created');
      return Promise.resolve({ data: res, message: `User ${name} created successfully` });
    })
    .catch(error => {
      console.error('Cannot create user', name);
      throw {
        message: `Cannot create user ${name} with ${email}`,
        error,
        name,
      };
    });
}
