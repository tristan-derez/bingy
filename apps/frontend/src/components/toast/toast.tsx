import {
	IconAlertTriangle,
	IconCircleCheck,
	IconCircleX,
	IconInfoCircle,
	IconLoader2,
} from "@tabler/icons-react";
import { type ExternalToast, toast as sonnerToast } from "sonner";

interface ToastButton {
	label: string;
	onClick: () => void;
}

interface ToastProps {
	id: string | number;
	title: string;
	description?: string;
	button?: ToastButton;
	variant?: "default" | "success" | "error" | "warning" | "loading";
}

interface ToastInput {
	title: string;
	description?: string;
	button?: ToastButton;
	variant?: "default" | "success" | "error" | "warning" | "loading";
}

const variantIconStyles = {
	default: "text-blue-500",
	success: "text-green-500",
	error: "text-red-500",
	warning: "text-yellow-500",
	loading: "text-foreground",
};

const variantButtonStyles = {
	default: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
	success: "bg-green-100 text-green-700 hover:bg-green-200",
	error: "bg-red-100 text-red-700 hover:bg-red-200",
	warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
	loading: "",
};

const variantIcons = {
	default: IconInfoCircle,
	success: IconCircleCheck,
	error: IconCircleX,
	warning: IconAlertTriangle,
	loading: IconLoader2,
};

function Toast(props: ToastProps) {
	const { title, description, button, id, variant = "default" } = props;
	const Icon = variantIcons[variant];

	return (
		<div className="flex rounded-2xl bg-accent border border-black/5 w-full md:w-xs items-center py-2 px-3">
			<div className="flex flex-1 items-center gap-3">
				<Icon
					className={`${variantIconStyles[variant]} shrink-0 ${variant === "loading" ? "animate-spin" : ""}`}
					size={20}
				/>
				<div className="w-full flex flex-col gap-1">
					<p className="text-sm font-medium text-foreground">{title}</p>
					{description ? (
						<p className="text-sm text-muted-foreground">{description}</p>
					) : null}
				</div>
			</div>
			{button ? (
				<div className="ml-5 shrink-0">
					<button
						className={`rounded-md px-3 py-1 text-sm font-semibold transition-colors ${variantButtonStyles[variant]}`}
						onClick={() => {
							button.onClick();
							sonnerToast.dismiss(id);
						}}
						type="button"
					>
						{button.label}
					</button>
				</div>
			) : null}
		</div>
	);
}

export function toast(input: ToastInput, options?: ExternalToast) {
	return sonnerToast.custom((id) => <Toast id={id} {...input} />, {
		unstyled: true,
		...options,
	});
}

toast.success = (input: Omit<ToastInput, "variant">, options?: ExternalToast) =>
	toast({ ...input, variant: "success" }, options);

toast.error = (input: Omit<ToastInput, "variant">, options?: ExternalToast) =>
	toast({ ...input, variant: "error" }, options);

toast.warning = (input: Omit<ToastInput, "variant">, options?: ExternalToast) =>
	toast({ ...input, variant: "warning" }, options);

toast.loading = (input: Omit<ToastInput, "variant">, options?: ExternalToast) =>
	toast({ ...input, variant: "loading" }, options);
