import { zodResolver } from "@hookform/resolvers/zod";
import {
	createFileRoute,
	useNavigate,
	useRouteContext,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ListItemsPreview } from "@/components/lists/custom-lists/list-items-preview";
import { ListSearchAddInput } from "@/components/lists/custom-lists/list-search-add";
import { toast } from "@/components/toast/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateList } from "@/hooks/useLists";
import { createListDraftItemsAtom } from "@/lib/atoms/draft-list";
import { m } from "@/paraglide/messages";
import { createListSchema } from "@/schemas/create-list-schema";

export const Route = createFileRoute("/_auth/lists/create")({
	component: CreateListPage,
});

type CreateListFormValues = z.infer<typeof createListSchema>;

function CreateListPage() {
	const { authData } = useRouteContext({ from: "__root__" });
	const navigate = useNavigate();

	if (!authData) return null;
	const username = authData.user.name;

	const createList = useCreateList(username);
	const [selectedItems, setSelectedItems] = useAtom(createListDraftItemsAtom);

	const form = useForm<CreateListFormValues>({
		resolver: zodResolver(createListSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			description: "",
			visibility: "public",
			type: "unranked",
		},
	});

	const listType = form.watch("type");

	const handleRemoveItem = (tmdbId: number, mediaType: string) => {
		setSelectedItems(
			selectedItems.filter(
				(item) => !(item.tmdbId === tmdbId && item.mediaType === mediaType),
			),
		);
	};

	const handleReorder = (reorderedItems: typeof selectedItems) => {
		setSelectedItems(reorderedItems);
	};

	const handleUpdateNote = (
		tmdbId: number,
		mediaType: string,
		note: string,
	) => {
		setSelectedItems(
			selectedItems.map((item) =>
				item.tmdbId === tmdbId && item.mediaType === mediaType
					? { ...item, note }
					: item,
			),
		);
	};

	const onSubmit = (values: CreateListFormValues) => {
		const payload = {
			...values,
			items:
				selectedItems.length > 0
					? selectedItems.map((item, index) => ({
							tmdbId: item.tmdbId,
							mediaType: item.mediaType,
							note: item.note,
							position: values.type === "ranked" ? index + 1 : undefined,
						}))
					: undefined,
		};

		createList.mutate(payload, {
			onSuccess: (data) => {
				setSelectedItems([]);

				toast.success({
					title: m.toast_form_create_list_success({ list_name: values.name }),
				});
				navigate({
					to: "/@{$username}/lists/$slug",
					params: { username, slug: data.slug },
				});
			},
			onError: () => {
				toast.error({
					title: m.toast_form_create_list_error({ list_name: values.name }),
				});
			},
		});
	};

	return (
		<div className="container flex flex-col max-w-3xl gap-6">
			<Card>
				<CardHeader>
					<CardTitle>{m.create_list_title()}</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<Field className="w-full lg:w-[55%]">
										<FieldLabel>{m.form_create_list_name_label()}</FieldLabel>
										<FieldContent>
											<Input {...field} autoComplete="off" />
										</FieldContent>
										<FieldError
											errors={fieldState.error ? [fieldState.error] : undefined}
										/>
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="visibility"
								render={({ field, fieldState }) => {
									const visibilityLabel = {
										public: m.form_create_list_visibility_item_public_short(),
										limited: m.form_create_list_visibility_item_limited_short(),
										private: m.form_create_list_visibility_item_private_short(),
									}[field.value as "public" | "limited" | "private"];

									return (
										<Field className="w-full lg:w-[45%]">
											<FieldLabel>
												{m.form_create_list_visibility_label()}
											</FieldLabel>
											<FieldContent>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue>{visibilityLabel}</SelectValue>
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="public">
															{m.form_create_list_visibility_item_public()}
														</SelectItem>
														<SelectItem value="limited">
															{m.form_create_list_visibility_item_limited()}
														</SelectItem>
														<SelectItem value="private">
															{m.form_create_list_visibility_item_private()}
														</SelectItem>
													</SelectContent>
												</Select>
											</FieldContent>
											<FieldError
												errors={
													fieldState.error ? [fieldState.error] : undefined
												}
											/>
										</Field>
									);
								}}
							/>
						</div>

						<Controller
							control={form.control}
							name="type"
							render={({ field }) => (
								<Field>
									<FieldContent className="flex flex-row gap-2 items-center">
										<Checkbox
											checked={field.value === "ranked"}
											onCheckedChange={(checked) =>
												field.onChange(checked ? "ranked" : "unranked")
											}
										/>
										<FieldLabel>{m.form_create_list_type_ranked()}</FieldLabel>
									</FieldContent>
									<FieldDescription>
										{m.form_create_list_type_ranked_description()}
									</FieldDescription>
								</Field>
							)}
						/>

						<Controller
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>
										{m.form_create_list_description_label()}
									</FieldLabel>
									<FieldContent>
										<Textarea
											className="resize-y field-sizing-content"
											rows={4}
											{...field}
										/>
									</FieldContent>
									<FieldError
										errors={fieldState.error ? [fieldState.error] : undefined}
									/>
								</Field>
							)}
						/>

						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-2">
								<FieldLabel>{m.form_create_list_add_items_label()}</FieldLabel>
								<ListSearchAddInput draftItemsAtom={createListDraftItemsAtom} />
							</div>
						</div>
						<div className="flex w-full gap-2">
							<Button
								type="button"
								disabled={createList.isPending}
								variant="destructive"
								onClick={() =>
									navigate({
										to: "/@{$username}/lists",
										params: { username },
									})
								}
								className="flex-1"
							>
								{m.form_create_list_btn_cancel()}
							</Button>
							<Button
								type="submit"
								disabled={createList.isPending}
								className="flex-1"
							>
								{createList.isPending
									? m.form_create_list_btn_creating()
									: m.form_create_list_btn_create()}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* items (movies/tv shows) added to the list */}
			<ListItemsPreview
				selectedItems={selectedItems}
				listType={listType}
				clearItems={() => setSelectedItems([])}
				handleRemoveItem={handleRemoveItem}
				handleUpdateNote={handleUpdateNote}
				handleReorder={handleReorder}
			/>
		</div>
	);
}
