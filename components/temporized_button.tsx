"use client";

import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { title } from "process";
import { useEffect, useState } from "react";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";

interface TemporizedButtonProps {
  onClick: () => void;
  label?: string;
  waitlabel?: string
  timer?: number
  run: boolean
//   onRestart?: () => void;
};

export const TemporizedButton = ({
  onClick = ()=>{},
  label = "Scan",
  waitlabel = "Waiting",
  timer = 30,
  run = false,
//   onRestart
}: TemporizedButtonProps) => {

    const [enabled, setEnable] = useState(false)
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [buttonLabel, setButtonLabel] = useState( changeButtonLabel(timer) )
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //       setElapsedSeconds((prevSeconds) => prevSeconds + 1);
    //     }, 1000);
    
    //     setEnable(true)
    //     return () => clearInterval(interval);
    //   }, []);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(timer);

    function changeButtonLabel(time:number):string{

        const l = enabled ? label : waitlabel + " " + time + "s"
        // setButtonLabel(l)
        return l
    }

    const restartTimer = () => {
        setIsRunning(true);
        setEnable(false);
        setTime(timer);
        setButtonLabel(changeButtonLabel(timer));
      };

    useEffect(() => {
        if (run) {
        //   setIsRunning(true);
          restartTimer();
        //   setEnable(false);
        //   setTime(timer);
        }
      }, [run]);//, timer]);
      

    useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
        interval = setInterval(() => {
        setTime((prevTime) => {
            const newTime = prevTime - 1;
            setButtonLabel(changeButtonLabel(newTime))
            if (newTime === 0 /*&& onChange*/) {
                // onChange();
                setIsRunning(false);
                setEnable(true)
            }
            return newTime;
        });
        }, 1000);
    } else {
        clearInterval(interval!);
    }

    return () => clearInterval(interval!);
    }, [isRunning,/* onChange*/]);

  return (
    <Button 
        isDisabled={ !enabled }
        color="primary"
        // showAnchorIcon
        variant="solid"
        data-testid="newProjectBtn"
        // >Scan {actions[nextAction(action)]}</Button>
        // onPress={onClick}
        onPress={() => onClick() }
    >{buttonLabel}</Button>
  );
};
