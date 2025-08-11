// import getServerSession from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
// const Member = async () => {

//     const session = await getServerSession(options);
//     return (
//         <div>
//             <h1>Member Client Session</h1>
//             <p>{session?.user?.email}</p>
//             <p>{session?.user?.role}</p>
//         </div>
//     );
// };

const Member = async () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl='/ClientMember");
    },
  });
  return (
    <div>
      <h1>Member Client Session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
};

export default Member;
