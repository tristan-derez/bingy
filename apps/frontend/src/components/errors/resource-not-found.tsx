import { IconAlertCircle, IconSmartHome } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { CenteredLayout } from "@/components/layout/centered-layout";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { m } from "@/paraglide/messages";

interface ResourceNotFoundProps {
	title: string;
	description: string;
}

export function ResourceNotFound({
	title,
	description,
}: ResourceNotFoundProps) {
	return (
		<CenteredLayout>
			<Card className="min-w-80">
				<CardHeader>
					<div className="flex items-center gap-2">
						<IconAlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle>{title}</CardTitle>
					</div>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<BackButton style="w-full" text={m.btn_go_back()} />

					<Button variant="outline" className="w-full">
						<Link
							to="/"
							className="hover:cursor-default flex items-center gap-2 flex-1 justify-center"
						>
							<IconSmartHome className="h-4 w-4" /> Home
						</Link>
					</Button>
				</CardContent>
			</Card>
		</CenteredLayout>
	);
}
