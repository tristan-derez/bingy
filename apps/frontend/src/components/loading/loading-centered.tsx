import { CenteredLayout } from "@/components/layout/centered-layout";
import { LoaderTwo } from "@/components/ui/loader";

export function LoadingCentered() {
	return (
		<CenteredLayout>
			<LoaderTwo />
		</CenteredLayout>
	);
}
