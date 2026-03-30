interface LaunchButtonProps {
	running: boolean;
	onLaunch: () => void;
}

export default function LaunchButton({ running, onLaunch }: LaunchButtonProps) {
	return (
		<button
			onClick={onLaunch}
			disabled={running}
			className={`
        w-full rounded-lg py-3 text-[14px] font-semibold transition-all duration-150
        ${
					running
						? "bg-elevated border border-green-500 text-green-500 cursor-not-allowed"
						: "bg-green-500 text-white hover:bg-green-400 hover:-translate-y-px hover:shadow-lg"
				}
      `}
		>
			{running ? (
				<span className="flex items-center justify-center gap-2">
					<span>Optimisation</span>
					<span className="flex gap-0.5">
						{[0, 1, 2].map((i) => (
							<span
								key={i}
								className="w-1 h-1 rounded-full bg-green-500 animate-bounce"
								style={{ animationDelay: `${i * 150}ms` }}
							/>
						))}
					</span>
				</span>
			) : (
				"Lancer l'optimisation ↗"
			)}
		</button>
	);
}
