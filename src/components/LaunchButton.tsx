interface LaunchButtonProps {
	running: boolean;
	onLaunch: () => void;
}

export default function LaunchButton({ running, onLaunch }: LaunchButtonProps) {
	return (
		<button
			onClick={onLaunch}
			className={`
        w-full rounded-lg py-3 text-[14px] font-semibold transition-all duration-150
        ${
					running
						? "bg-red-500 text-white hover:bg-red-400 hover:-translate-y-px hover:shadow-lg"
						: "bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-lg"
				}
      `}
		>
			{running ? "Stop optimisation" : "Launch optimisation ↗"}
		</button>
	);
}
