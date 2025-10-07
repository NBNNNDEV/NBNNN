import { useEffect, useMemo, useState } from "react";

type TimeLeft = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const totalMs = targetDate.getTime() - now.getTime();
  const clamped = Math.max(0, totalMs);

  const secondsTotal = Math.floor(clamped / 1000);
  const minutesTotal = Math.floor(secondsTotal / 60);
  const hoursTotal = Math.floor(minutesTotal / 60);
  const daysTotal = Math.floor(hoursTotal / 24);

  // Approximate months as 30 days for a simple, readable countdown
  const months = Math.floor(daysTotal / 30);
  const days = daysTotal % 30;
  const hours = hoursTotal % 24;
  const minutes = minutesTotal % 60;
  const seconds = secondsTotal % 60;

  return { months, days, hours, minutes, seconds };
}

export const Countdown = () => {
  const target = useMemo(() => new Date("2025-11-01T00:00:00Z"), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

  const done =
    timeLeft.months === 0 &&
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-6 px-4">
      <h2 className="text-3xl font-bold">Countdown to November 2025</h2>

      {done ? (
        <p className="text-xl">It's November! Brace yourself.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
          {[
            { label: "Months", value: timeLeft.months },
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center justify-center w-full rounded-lg border p-4 text-center"
            >
              <div className="w-full text-4xl font-semibold">{item.value.toString().padStart(2, "0")}</div>
              <div className="w-full text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Countdown;
