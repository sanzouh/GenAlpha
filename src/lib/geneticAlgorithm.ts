import { ASSETS } from "@/data/assets";

// ─────────────────────────────────────────────
//  TYPES
//  En JS : pas de types, on découvre les erreurs à l'exécution
//  En TS : on définit la forme des données à l'avance
//  L'éditeur détecte les erreurs avant même de lancer le code
// ─────────────────────────────────────────────

// Un actif financier — les données fixes de chaque entreprise
export interface Asset {
	ticker: string; // "AAPL"
	name: string; // "Apple Inc."
	expectedReturn: number; // 12.4 (en %)
	volatility: number; // 18.2 (en %)
	color: string; // "bg-aapl" — pour l'UI
}

// Un portefeuille évalué — le résultat de evaluatePortfolio()
export interface Portfolio {
	weights: number[]; // [0.20, 0.15, 0.30, 0.10, 0.15, 0.10]
	expectedReturn: number; // rendement calculé
	volatility: number; // risque calculé
	sharpe: number; // ratio de Sharpe
}

// Les paramètres passés à runGeneticAlgorithm()
export interface GAParams {
	populationSize: number; // 80
	generations: number; // 60
	crossoverRate: number; // 75 (en %)
	mutationRate: number; // 8  (en %)
	maxRisk: number; // 20 (en %)
}

// Ce que le générateur émet à chaque génération vers l'interface
export interface GAResult {
	generation: number;
	best: Portfolio;
	population: Portfolio[];
	paretoFront: Portfolio[];
	progress: number; // 0 → 100
}

// ─────────────────────────────────────────────
//  CONSTANTE
//  Le taux sans risque = ce que rapporte la banque sans investir
//  On le soustrait dans le Sharpe pour mesurer le "vrai" gain
//  de l'investissement par rapport à ne rien risquer
// ─────────────────────────────────────────────
const RISK_FREE_RATE = 2; // 2% — taux moyen d'un livret bancaire

// ─────────────────────────────────────────────
//  NORMALIZE
//  Force la somme des poids à valoir exactement 1
//  Requis après chaque croisement et mutation
//
//  Complexité : O(n) — on parcourt le tableau deux fois
//  (une fois pour la somme, une fois pour diviser)
// ─────────────────────────────────────────────

// TS : number[] indique explicitement un tableau de nombres
// JS : function normalize(weights) { ... } — pas de type
function normalize(weights: number[]): number[] {
	const sum = weights.reduce((acc, w) => acc + w, 0);
	// TS : le .map retourne number[] automatiquement — inféré par TS
	return weights.map((w) => w / sum);
}

// ─────────────────────────────────────────────
//  RANDOM PORTFOLIO
//  Crée un portefeuille aléatoire normalisé
//  C'est un "individu" de la population initiale
//
//  Complexité : O(n) — n = nombre d'actifs
// ─────────────────────────────────────────────
export function randomPortfolio(): number[] {
	// On ajoute 0.02 pour éviter les poids proches de 0
	// Sans ça, certains actifs auraient une allocation quasi nulle dès le départ
	const weights = ASSETS.map(() => Math.random() + 0.02);
	return normalize(weights);
}

// ─────────────────────────────────────────────
//  EVALUATE PORTFOLIO
//  Calcule les 3 métriques d'un portefeuille :
//  rendement attendu, volatilité, ratio de Sharpe
//
//  Complexité : O(n) — un seul parcours du tableau
// ─────────────────────────────────────────────
export function evaluatePortfolio(weights: number[]): Portfolio {
	let expectedReturn = 0;
	let volatility = 0;

	ASSETS.forEach((asset, i) => {
		// Rendement : moyenne pondérée simple
		// ex: 20% dans AAPL(12.4%) → contribution = 0.20 × 12.4 = 2.48%
		expectedReturn += weights[i] * asset.expectedReturn;

		// Volatilité : somme pondérée linéaire (démo : dispersion plus visible)
		// ex: 20% dans AAPL(18.2%) → contribution = 0.20 × 18.2 = 3.64
		volatility += weights[i] * asset.volatility;
	});

	// Ratio de Sharpe : gain au-delà du taux sans risque, par unité de risque
	// ex: rendement=15%, volatilité=10% → Sharpe = (15-2)/10 = 1.3
	const sharpe = (expectedReturn - RISK_FREE_RATE) / volatility;

	// TS : le type de retour Portfolio est vérifié par le compilateur
	// Si on oublie une propriété, TS signale une erreur immédiatement
	return { weights, expectedReturn, volatility, sharpe };
}

/*
Pourquoi la formule de Markowitz plutôt que la somme linéaire ?
Linéaire (ancienne version) :
volatility += weights[i] * asset.volatility
→ suppose que tous les actifs montent et descendent ensemble
→ surestime le risque réel

Markowitz (nouvelle version) :
volatility = √( Σ wi² × vi² )
→ suppose que les actifs sont indépendants
→ la diversification réduit naturellement le risque
→ c'est pour ça qu'un portefeuille mixte est moins risqué
  qu'un seul actif
*/

// ─────────────────────────────────────────────
//  FITNESS
//  Score final d'un portefeuille — c'est ce qu'on maximise
//  Sharpe + pénalité si le risque dépasse le seuil fixé
//
//  Complexité : O(1) — pas de boucle, calcul direct
// ─────────────────────────────────────────────
export function fitness(portfolio: Portfolio, maxRisk: number): number {
	// Pénalité proportionnelle — plus le risque dépasse maxRisk, plus la pénalité est grande
	// ex: volatilité=25%, maxRisk=20% → penalty = (25-20) × 0.5 = 2.5
	// Ancienne version : penalty = -5 fixe → trop brutal, crée une falaise
	const penalty = Math.max(0, portfolio.volatility - maxRisk) * 0.5;
	return portfolio.sharpe - penalty;
}

// ─────────────────────────────────────────────
//  CROSSOVER (croisement uniforme)
//  Mélange les poids de deux parents pour créer un enfant
//  À chaque position, on choisit le poids du parent A ou B au hasard
//
//  Complexité : O(n) — un parcours du tableau
// ─────────────────────────────────────────────
export function crossover(parentA: number[], parentB: number[]): number[] {
	const childWeights = parentA.map((w, i) =>
		// 50% de chance de prendre le poids de A, 50% de B
		// C'est le croisement uniforme — chaque gène est indépendant
		Math.random() < 0.5 ? w : parentB[i],
	);
	// Renormalisation obligatoire — le mélange peut rompre la contrainte somme=1
	return normalize(childWeights);
}

// ─────────────────────────────────────────────
//  MUTATE
//  Perturbe légèrement certains poids avec une probabilité donnée
//  Permet d'explorer de nouvelles zones — évite les minima locaux
//
//  Complexité : O(n) — un parcours du tableau
// ─────────────────────────────────────────────
export function mutate(weights: number[], mutationRate: number): number[] {
	const mutated = weights.map((w) => {
		// mutationRate vient du slider — ex: 8 → 8% de chance de muter
		if (Math.random() < mutationRate / 100) {
			// Perturbation aléatoire entre -0.15 et +0.15
			// Réduit par rapport à l'original (0.3) — mutations plus douces
			// Une mutation trop forte détruit l'information génétique
			return w + (Math.random() - 0.5) * 0.15;
		}
		return w; // pas de mutation sur ce poids
	});

	// On s'assure que tous les poids restent positifs
	// Un poids négatif n'a pas de sens — on ne peut pas investir -10%
	const positive = mutated.map((w) => Math.max(0.01, w));

	// Renormalisation — les perturbations ont rompu la contrainte somme=1
	return normalize(positive);
}

// ─────────────────────────────────────────────
//  DOMINATES
//  Vérifie si le portefeuille A est strictement meilleur que B
//  sur les deux critères simultanément
//
//  Règle : A domine B si :
//    1. A a un rendement >= B (au moins aussi bon)
//    2. A a une volatilité <= B (au moins aussi sûr)
//    3. A est STRICTEMENT meilleur sur au moins un des deux
//
//  Complexité : O(1) — trois comparaisons directes
// ─────────────────────────────────────────────

// Non exportée — utilitaire interne utilisé uniquement par getParetoFront
function dominates(a: Portfolio, b: Portfolio): boolean {
	return (
		a.expectedReturn >= b.expectedReturn && // condition 1
		a.volatility <= b.volatility && // condition 2
		(a.expectedReturn > b.expectedReturn || // strictement meilleur sur le rendement
			a.volatility < b.volatility) // OU strictement meilleur sur le risque
	);
}

// ─────────────────────────────────────────────
//  GET PARETO FRONT
//  Filtre la population pour ne garder que les solutions
//  non-dominées — le "meilleur compromis" rendement/risque
//
//  Complexité : O(n²) — pour chaque portefeuille, on le compare
//  à tous les autres → n × n comparaisons
//  Avec n=80 → 6400 comparaisons max, négligeable pour le CPU
// ─────────────────────────────────────────────
export function getParetoFront(population: Portfolio[]): Portfolio[] {
	return population.filter(
		(p) =>
			// On garde p si AUCUN autre portefeuille q ne le domine
			!population.some((q) => dominates(q, p)),
	);
}

// ─────────────────────────────────────────────
//  RUN GENETIC ALGORITHM
//  Le cœur de l'application — orchestre toutes les étapes
//
//  C'est un GÉNÉRATEUR ASYNCHRONE :
//  - "async" : peut faire des pauses (await)
//  - "function*" : peut émettre des valeurs intermédiaires (yield)
//  - Combinés : émet une valeur à chaque génération
//    ET fait une pause pour laisser React re-rendre l'interface
//
//  Sans générateur async → l'interface serait gelée pendant
//  toute l'optimisation, on ne verrait le résultat qu'à la fin
//
//  Complexité globale : O(g × n²)
//  g = générations, n = population
//  Par défaut : 60 × 80² = 384 000 opérations
// ─────────────────────────────────────────────

// AsyncGenerator<GAResult, void, unknown> :
//   GAResult  → le type de chaque valeur émise par yield
//   void      → le type de retour final (rien)
//   unknown   → le type des valeurs qu'on peut envoyer au générateur (rien ici)
export async function* runGeneticAlgorithm(
	params: GAParams,
): AsyncGenerator<GAResult, void, unknown> {
	const { populationSize, generations, crossoverRate, mutationRate, maxRisk } =
		params;

	// ── ÉTAPE 1 : Population initiale ──
	// On crée populationSize portefeuilles aléatoires et on les évalue immédiatement
	// Array.from({ length: n }, fn) → crée un tableau de n éléments via fn
	let population: Portfolio[] = Array.from({ length: populationSize }, () =>
		evaluatePortfolio(randomPortfolio()),
	);

	for (let gen = 0; gen < generations; gen++) {
		// Pause de 80ms — laisse React re-rendre l'interface entre chaque génération
		// Sans ce await, la boucle monopolise le thread JS et l'UI se fige
		await new Promise((r) => setTimeout(r, 16));

		// ── ÉTAPE 2 : Évaluation et tri par fitness ──
		// On recalcule le score de chaque portefeuille et on trie du meilleur au pire
		// Le spread { ...p } crée une copie — on n'écrase pas l'objet original
		const evaluated = population
			.map((p) => ({ ...p, fit: fitness(p, maxRisk) }))
			.sort((a, b) => b.fit - a.fit); // tri décroissant — le meilleur en premier

		// ── ÉTAPE 3 : Sélection — top 25% ──
		// Math.floor arrondit à l'entier inférieur
		// ex: 80 × 0.25 = 20 élites
		const eliteCount = Math.floor(populationSize * 0.25);
		const elite = evaluated.slice(0, eliteCount);

		// ── ÉTAPE 4 : Reproduction ──
		// On commence avec les élites intacts (élitisme)
		// { ...e } : copie de l'objet pour ne pas modifier l'original
		const newPopulation: Portfolio[] = elite.map((e) => ({ ...e }));

		while (newPopulation.length < populationSize) {
			// Sélection aléatoire de deux parents parmi les élites
			const parentA = elite[Math.floor(Math.random() * elite.length)];
			const parentB = elite[Math.floor(Math.random() * elite.length)];

			// Croisement selon le taux crossoverRate (ex: 75%)
			let childWeights =
				Math.random() < crossoverRate / 100
					? crossover(parentA.weights, parentB.weights)
					: [...parentA.weights]; // copie directe si pas de croisement

			// Mutation selon le taux mutationRate (ex: 8%)
			childWeights = mutate(childWeights, mutationRate);

			// Évaluation du nouvel enfant et ajout à la population
			newPopulation.push(evaluatePortfolio(childWeights));
		}

		population = newPopulation;

		// ── ÉTAPE 5 : Front de Pareto ──
		const paretoFront = getParetoFront(population);

		// ── YIELD : émission des données vers l'interface ──
		// yield = "pause et envoie ce résultat à celui qui écoute"
		// Le hook useGeneticAlgorithm reçoit ces données et met à jour React
		yield {
			generation: gen + 1, // 1-indexé pour l'affichage
			best: evaluated[0], // meilleur portefeuille de la génération
			population: evaluated, // toute la population pour un Pareto fidèle
			paretoFront,
			progress: Math.round(((gen + 1) / generations) * 100), // 0 → 100%
		};
	}
}
/* function normale    → retourne UNE valeur à la fin
function*           → peut retourner PLUSIEURS valeurs via yield, une par une
async function      → peut faire des pauses avec await
async function*     → les deux combinés

Sans yield :
  Génération 1 ──┐
  Génération 2   │  → interface bloquée → résultat final seulement
  Génération 60 ─┘

Avec yield :
  Génération 1  → yield → React re-rend → pause 80ms
  Génération 2  → yield → React re-rend → pause 80ms
  Génération 60 → yield → React re-rend → FIN */
