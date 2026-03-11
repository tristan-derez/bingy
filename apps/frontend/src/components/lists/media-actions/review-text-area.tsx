import { type ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewTextareaProps {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder: string;
}

export function ReviewTextarea({
	value,
	onChange,
	label,
	placeholder,
}: ReviewTextareaProps) {
	const [localValue, setLocalValue] = useState(value);

	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setLocalValue(newValue);
		onChange(newValue);
	};

	return (
		<div className="flex flex-col gap-2 flex-1">
			<Label htmlFor="review">{label}</Label>
			<Textarea
				id="review"
				value={localValue}
				onChange={handleChange}
				placeholder={placeholder}
				className="flex-1 min-h-[120px] resize-none"
			/>
		</div>
	);
}
