type LaunchStatus = "idle" | "running" | "paused";

interface LaunchButtonProps {
	status: LaunchStatus;
	onStart: () => void;
	onPause: () => void;
	onResume: () => void;
}

export default function LaunchButton({ status, onStart, onPause, onResume }: LaunchButtonProps) {
	const isRunning = status === "running";
	const isPaused = status === "paused";

	return (
		<button
			onClick={() => {
				if (isRunning) onPause();
				else if (isPaused) onResume();
				else onStart();
			}}
			className={`
        w-full rounded-lg py-3 text-[14px] font-semibold transition-all duration-150
        ${
				isRunning
					? "bg-red-500 text-white hover:bg-red-400 hover:-translate-y-px hover:shadow-lg"
				: isPaused
					? "bg-yellow-500 text-black hover:bg-yellow-400 hover:-translate-y-px hover:shadow-lg"
					: "bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-lg"
			}
      `}
		>
			{isRunning ? "Pause optimisation" : isPaused ? "Resume optimisation" : "Launch optimisation ↗"}
		</button>
	);
}
