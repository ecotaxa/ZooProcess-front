import Timer from '@/components/timer';

// const ThirtySeconds = (nextState: state) => {
//     if ( current != state.thirtys1 && current != state.thirtys1bis ) {
//         return <></>
//     }

//     const handleTimerEnd = () => {
//         setCurrent(nextState)
//     }

//     return (
//         <Timer initialTime={30} onChange={handleTimerEnd} />
//     )
// }

export function ThirtySeconds(param: { onCancel: () => void; onValid: () => void; time: number }) {
  const { onCancel, onValid, time } = param;

  return (
    <>
      <Timer initialTime={time} onComplete={onValid} />
      {/* <Timer duration={time} onComplete={onValid} /> */}
    </>
  );
}
