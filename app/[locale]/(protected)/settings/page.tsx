import React, { Suspense } from 'react';
import AsyncAuthComponent from './AsyncAuthComponent';

const PageWrapper = () => {
  const navigate = useNavigate();
  const { data: session, status } = useSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncAuthComponent router={router} session={session} status={status} />
    </Suspense>
  );
};

export default PageWrapper;
