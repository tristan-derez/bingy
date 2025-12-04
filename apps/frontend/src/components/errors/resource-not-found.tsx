import { Link } from "@tanstack/react-router";
import { AlertCircle, HomeIcon } from "lucide-react";
import { CenteredLayout } from "../layout/centered-layout";
import { BackButton } from "../ui/back-button";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

interface ResourceNotFoundProps {
	title: string;
	description: string;
	onBack: () => void;
}

export function ResourceNotFound({
	title,
	description,
	onBack,
}: ResourceNotFoundProps) {
	return (
		<CenteredLayout>
			<Card className="min-w-80">
				<CardHeader>
					<div className="flex items-center gap-2">
						<AlertCircle className="h-5 w-5 text-destructive" />
						<CardTitle>{title}</CardTitle>
					</div>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<BackButton onBack={onBack} style="w-full" />

					<Button asChild variant="outline" className="w-full">
						<Link to="/">
							<HomeIcon className="h-4 w-4" /> Home
						</Link>
					</Button>
				</CardContent>
			</Card>
		</CenteredLayout>
	);
}
