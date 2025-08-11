// import '../globals.css';

export default function GroupLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: React.ReactNode;
}) {
  return (
    <section className="bg-blue-300">
      {children}
      <div>{user}</div>
    </section>
  );
}
