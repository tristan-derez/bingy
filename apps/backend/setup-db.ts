import postgres from "postgres";
import env from "#lib/env";

const DB_CONFIG = {
	READY_TIMEOUT_MS: 15_000,
	READY_RETRY_MS: 500,
	MAX_RETRIES: Math.floor(15_000 / 500),
} as const;

const dbHostWithPort = `${env.DB_HOST}:${env.DB_PORT}`;

const createDbConnection = () => {
	return postgres({
		host: env.DB_HOST,
		username: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		port: Number(env.DB_PORT),
		ssl: env.NODE_ENV === "production",
		max: 20,
		idle_timeout: 20,
		connect_timeout: 60,
	});
};

const isDatabaseReady = async (sql: postgres.Sql): Promise<boolean> => {
	try {
		await sql`SELECT 1`;
		return true;
	} catch {
		return false;
	}
};

const waitFor = async (
	condition: () => Promise<boolean>,
	timeoutMs: number,
	intervalMs: number,
	description: string = "Condition",
): Promise<void> => {
	const start = Date.now();
	let attempt = 0;

	while (true) {
		attempt++;
		const result = await condition();

		if (result) {
			console.log(`✅ ${description} satisfied after ${attempt} attempts`);
			return;
		}

		const elapsed = Date.now() - start;
		if (elapsed > timeoutMs) {
			throw new Error(`${description} not met within ${timeoutMs}ms`);
		}

		const timeUntilNextRetry = Math.min(intervalMs, timeoutMs - elapsed);
		console.log(
			`⏳ ${description} not ready (attempt ${attempt}), retrying in ${timeUntilNextRetry}ms...`,
		);

		await Bun.sleep(timeUntilNextRetry);
	}
};

const runCommand = async (cmd: string[], label: string): Promise<void> => {
	console.log(`▶️  ${label}: ${cmd.join(" ")}`);

	const proc = Bun.spawn(cmd, {
		stdio: ["inherit", "inherit", "inherit"],
		env: { ...process.env },
	});

	const exitCode = await proc.exited;

	if (exitCode !== 0) {
		throw new Error(
			`${label} failed with exit code ${exitCode}. Command: ${cmd.join(" ")}`,
		);
	}

	console.log(`✅ ${label} completed successfully`);
};

const setupDatabase = async (): Promise<void> => {
	const sql = createDbConnection();

	try {
		console.log(`🔍 Checking if Postgres at ${dbHostWithPort} is ready...`);
		console.log(`Database: ${env.DB_NAME}, User: ${env.DB_USER}`);

		const isReady = await isDatabaseReady(sql);

		if (!isReady) {
			console.log("📦 Database not ready, starting Docker services...");
			await runCommand(
				["docker", "compose", "up", "-d", "--wait"],
				"Starting Docker with health checks",
			);

			console.log("⏳ Waiting for Postgres to become ready...");
			await waitFor(
				() => isDatabaseReady(sql),
				DB_CONFIG.READY_TIMEOUT_MS,
				DB_CONFIG.READY_RETRY_MS,
				`Postgres at ${dbHostWithPort}`,
			);
		} else {
			console.log("✅ Database is already ready");
		}

		await runCommand(
			["bun", "--bun", "run", "db:push"],
			"Running database migrations",
		);
		console.log("Setup complete! Database is ready and migrations applied.");

		console.log("💡 You can now:");
		console.log("   → Run `bun run dev` to start the server with hot reload");
		console.log("   → Open your browser to view the application");
	} catch (error) {
		console.error(
			"❌ Setup failed:",
			error instanceof Error ? error.message : String(error),
		);

		if (error instanceof Error && error.message.includes("docker")) {
			console.log(
				"💡 Hint: Make sure Docker is running and docker-compose is available",
			);
		}

		process.exit(1);
	} finally {
		await sql.end();
	}
};

setupDatabase();
