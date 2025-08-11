import { Tab, Tabs } from '@heroui/react';

export default function SamplesLayout(props: {
  children: React.ReactNode;
  // stats: React.ReactNode;
  // metadata: React.ReactNode;
  // samples: React.ReactNode;
}) {
  const projectid = 10;
  return (
    <section className="w-full">
      <div className="w-full">
        subsambples layout scan
        {props.children}
      </div>
    </section>
  );
}
