import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, HomeIcon } from "lucide-react";
import { CenteredLayout } from "../layout/centered-layout";
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
					<Button onClick={onBack} variant="outline" className="w-full">
						<ArrowLeft className="h-4 w-4" /> Back
					</Button>
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
