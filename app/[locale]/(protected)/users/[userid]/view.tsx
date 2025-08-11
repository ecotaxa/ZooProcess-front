import { useUserByIdWithAuth } from '@/app/api/user';
import { ErrorComponent } from '@/components/ErrorComponent';
import { MySpinner } from '@/components/mySpinner';
import { Button } from '@heroui/button';
import { FC, useEffect, useState } from 'react';

interface pageProps {
  params: {
    userid: string;
  };
}

const UserByID: FC<pageProps> = ({ params }) => {
  const navigate = useNavigate();

  const userid = params.userid;

  const { user, isLoading, isError } = useUserByIdWithAuth(userid);
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const ShowData = () => {
    if (isLoading) return <MySpinner />;
    if (isError) return <ErrorComponent error={isError} />;
    if (!userInfo) return <ErrorComponent error="User not found" />;
    const myUser = userInfo as User;
    console.log('userInfo: ', userInfo);
    return (
      <div>
        <h1>User {userid}</h1>
        <ul>
          <li>ID: {myUser.id}</li>
          <li>Name: {myUser.name}</li>
          <li>Email: {myUser.email}</li>
          <li>Role: {(userInfo as any).role}</li>
          {/* <li>Created: {myUser.created}</li>
                    <li>Updated: {myUser.updated}</li> */}
        </ul>
      </div>
    );
  };
  return (
    <>
      {ShowData()}

      <Button onClick={() => router.back()}>Back</Button>
    </>
  );
};

export default UserByID;
