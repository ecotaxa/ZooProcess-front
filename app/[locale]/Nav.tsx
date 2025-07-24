import { options } from '../api/auth/[...nextauth]/options';

const Nav = async () => {
  const session = await getServerSession(options);
  return (
    <header className="bg-gray-600 text-gray-100">
      <nav className="flex justify-between item-center w-full px-10 py-4">
        <div>Zooprocess</div>
        <div className="flex gap-10">
          <Link href="/CreateUser">Home</Link>
          <Link href="/ClientMember">Client Member</Link>
          <Link href="/Member">Member</Link>
          <Link href="/Public">Public</Link>
          {session ? (
            <Link href="/api/auth/signout?callnackUrl=/">Logout</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
};
