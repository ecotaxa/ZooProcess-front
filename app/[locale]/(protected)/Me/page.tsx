import { useUserMe } from '@/app/api/user';

const MePage = () => {
  const { user, isLoading, isError } = useUserMe();

  return <>{user.name}</>;
};

export default MePage;
